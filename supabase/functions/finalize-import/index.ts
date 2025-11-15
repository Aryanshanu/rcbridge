import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseClient = createClient(supabaseUrl, serviceRoleKey);

    // Get user from JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify admin role
    const { data: roleData } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!roleData || roleData.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { job_id, approved_records } = await req.json();

    if (!job_id || !Array.isArray(approved_records)) {
      return new Response(
        JSON.stringify({ error: "Invalid request: job_id and approved_records required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[finalize-import] Processing ${approved_records.length} approved properties for job ${job_id}`);

    let insertedCount = 0;
    let errorCount = 0;
    const insertErrors: string[] = [];

    // Insert each approved property
    for (const record of approved_records) {
      try {
        // Prepare property data
        const propertyData = {
          title: record.title,
          description: record.description,
          location: record.location,
          price: record.price,
          bedrooms: record.bedrooms,
          bathrooms: record.bathrooms,
          area: record.area,
          land_size: record.land_size,
          property_type: record.property_type,
          listing_type: record.listing_type,
          features: record.features || [],
          amenities: record.amenities || {},
          source_platform: 'instagram',
          source_url: record.source_url,
          source_instagram_handle: record.source_instagram_handle,
          source_contact_name: record.contact_name || record.source_contact_name,
          source_contact_phone: record.contact_phone || record.source_contact_phone,
          source_contact_email: record.contact_email || record.source_contact_email,
          rental_duration: record.rental_duration,
          rental_terms: record.rental_terms,
          roi_potential: record.roi_potential,
          status: 'available',
          owner_id: user.id,
          // Import metadata (new fields)
          created_by: user.id,
          import_job_id: job_id,
          raw_source_data: record.raw_data || null,
          duplicate_of: record.duplicate_of || null,
          duplicate_confidence: record.duplicate_confidence || null,
        };

        // Insert property
        const { data: insertedProperty, error: insertError } = await supabaseClient
          .from("properties")
          .insert(propertyData)
          .select()
          .single();

        if (insertError) {
          console.error(`[finalize-import] Insert error:`, insertError);
          insertErrors.push(`${record.title}: ${insertError.message}`);
          errorCount++;
          continue;
        }

        insertedCount++;
        console.log(`[finalize-import] Inserted property ${insertedProperty.id}`);

        // Insert property images if provided
        if (record.images && Array.isArray(record.images)) {
          for (let i = 0; i < record.images.length; i++) {
            await supabaseClient
              .from("property_images")
              .insert({
                property_id: insertedProperty.id,
                url: record.images[i],
                is_primary: i === 0,
              });
          }
        }
      } catch (error) {
        console.error(`[finalize-import] Error processing record:`, error);
        insertErrors.push(`${record.title}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        errorCount++;
      }
    }

    // Update scraping job
    await supabaseClient
      .from("scraping_jobs")
      .update({
        status: errorCount === 0 ? "completed" : "completed_with_errors",
        properties_added: insertedCount,
        properties_skipped: errorCount,
        completed_at: new Date().toISOString(),
        error_message: insertErrors.length > 0 ? insertErrors.join("; ") : null,
      })
      .eq("id", job_id);

    // Log activity
    await supabaseClient
      .from("customer_activity_history")
      .insert({
        customer_id: user.id,
        customer_email: user.email,
        activity_type: "instagram_import_completed",
        activity_details: {
          job_id,
          inserted: insertedCount,
          errors: errorCount,
        },
      });

    console.log(`[finalize-import] Import completed: ${insertedCount} inserted, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        inserted: insertedCount,
        errors: errorCount,
        error_messages: insertErrors,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[finalize-import] Fatal error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
