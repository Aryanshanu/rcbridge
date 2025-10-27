import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InstagramPost {
  description: string;
  account_name: string;
  instagram_handle: string;
  post_url: string;
  timestamp: string;
}

interface ParsedProperty {
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  property_type: 'residential' | 'commercial' | 'luxury' | 'industrial' | 'agricultural';
  listing_type: 'sale' | 'rent' | 'development';
  source_platform: string;
  source_url: string;
  source_contact_name: string;
  source_instagram_handle: string;
  source_contact_phone?: string;
}

function extractPrice(text: string): number | null {
  // Match patterns like: ₹79 Lakhs, 1.4 Cr, 50L, 1.2 crores, ₹6,000 per SFT
  const patterns = [
    /₹?\s*(\d+(?:\.\d+)?)\s*(?:Cr|Crore|crores?)/i,
    /₹?\s*(\d+(?:\.\d+)?)\s*(?:L|Lakh|lakhs?)/i,
    /₹?\s*(\d+(?:,\d+)*)\s*per\s*SFT/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseFloat(match[1].replace(/,/g, ''));
      if (text.toLowerCase().includes('cr')) {
        return value * 10000000; // Convert crores to rupees
      } else if (text.toLowerCase().includes('l')) {
        return value * 100000; // Convert lakhs to rupees
      } else if (text.toLowerCase().includes('per sft')) {
        // Assume average 1200 sq ft if price per sq ft
        return value * 1200;
      }
    }
  }
  return null;
}

function extractBedrooms(text: string): number | null {
  const patterns = [
    /(\d+)\s*BHK/i,
    /(\d+)\s*bed/i,
    /(\d+)\s*bedroom/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseInt(match[1]);
    }
  }
  return null;
}

function extractBathrooms(text: string): number | null {
  const patterns = [
    /(\d+)\s*bath/i,
    /(\d+)\s*bathroom/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseInt(match[1]);
    }
  }
  return null;
}

function extractArea(text: string): number | null {
  const patterns = [
    /(\d+(?:,\d+)?)\s*(?:SFT|sq\.?\s*ft|square\s*feet)/i,
    /(\d+)\s*(?:Sq\.\s*Yards|yards)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseInt(match[1].replace(/,/g, ''));
      if (text.toLowerCase().includes('yard')) {
        return value * 9; // Convert yards to sq ft
      }
      return value;
    }
  }
  return null;
}

function extractLocation(text: string): string {
  // Common Hyderabad locations
  const locations = [
    'Gachibowli', 'Hitech City', 'Madhapur', 'Kondapur', 'Kukatpally',
    'Miyapur', 'KPHB', 'Manikonda', 'Narsingi', 'Kokapet', 'Tellapur',
    'Puppalaguda', 'Nanakramguda', 'Raidurg', 'Jubilee Hills', 'Banjara Hills',
    'Begumpet', 'Ameerpet', 'Secunderabad', 'Uppal', 'LB Nagar', 'Dilsukhnagar',
    'Kompally', 'Bachupally', 'Nizampet', 'Pragathi Nagar', 'Moosapet',
    'SR Nagar', 'Punjagutta', 'Somajiguda', 'Nampally', 'Abids', 'Koti',
    'Charminar', 'Moghalpura', 'Chandrayangutta', 'Bandlaguda', 'Ghatkesar',
    'Pocharam', 'Elkatta', 'Shankarpally', 'Chevella', 'Shadnagar', 'Mokila',
    'Kollur', 'Santosh Nagar', 'Gagan Pahad', 'Aramghar', 'Noorinagar',
    'Pahadi Shareef', 'Jalpally', 'Tolichowki', 'Errakunta'
  ];

  for (const location of locations) {
    const regex = new RegExp(location, 'i');
    if (regex.test(text)) {
      return location;
    }
  }
  return 'Hyderabad';
}

function extractPropertyType(text: string): 'residential' | 'commercial' | 'luxury' | 'industrial' | 'agricultural' {
  const lower = text.toLowerCase();
  
  if (lower.includes('villa') || lower.includes('luxury') || lower.includes('penthouse') || lower.includes('premium')) {
    return 'luxury';
  }
  if (lower.includes('commercial') || lower.includes('office') || lower.includes('shop')) {
    return 'commercial';
  }
  if (lower.includes('plot') || lower.includes('land') || lower.includes('agriculture') || lower.includes('farm')) {
    return 'agricultural';
  }
  if (lower.includes('industrial') || lower.includes('warehouse') || lower.includes('factory')) {
    return 'industrial';
  }
  return 'residential';
}

function extractListingType(text: string): 'sale' | 'rent' | 'development' {
  const lower = text.toLowerCase();
  
  if (lower.includes('for rent') || lower.includes('rental')) {
    return 'rent';
  }
  if (lower.includes('under development') || lower.includes('under construction') || lower.includes('upcoming')) {
    return 'development';
  }
  return 'sale';
}

function extractPhone(text: string): string | null {
  const patterns = [
    /(?:\+91[\s-]?)?[6-9]\d{9}/g,
    /(?:\+91[\s-]?)?\d{5}[\s-]?\d{5}/g,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].replace(/\s|-/g, '');
    }
  }
  return null;
}

function parseInstagramPost(post: InstagramPost): ParsedProperty | null {
  const { description, account_name, instagram_handle, post_url } = post;
  
  const price = extractPrice(description);
  if (!price) {
    console.log('Skipping post - no price found:', description.substring(0, 100));
    return null;
  }

  const location = extractLocation(description);
  const bedrooms = extractBedrooms(description);
  const bathrooms = extractBathrooms(description);
  const area = extractArea(description);
  const property_type = extractPropertyType(description);
  const listing_type = extractListingType(description);
  const phone = extractPhone(description);

  // Generate title from first line or description
  const firstLine = description.split('\n')[0].trim();
  const title = firstLine.length > 10 && firstLine.length < 100 
    ? firstLine.replace(/[#@]/g, '').trim() 
    : `${bedrooms ? bedrooms + 'BHK' : ''} ${property_type} in ${location}`.trim();

  return {
    title: title.substring(0, 200),
    description: description.substring(0, 1000),
    location,
    price,
    bedrooms,
    bathrooms,
    area,
    property_type,
    listing_type,
    source_platform: 'instagram',
    source_url: post_url,
    source_contact_name: account_name,
    source_instagram_handle: instagram_handle,
    source_contact_phone: phone,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: userRole } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!userRole || userRole.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { posts } = await req.json();

    if (!posts || !Array.isArray(posts)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request body - posts array required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create scraping job
    const { data: job, error: jobError } = await supabaseClient
      .from('scraping_jobs')
      .insert({
        platform: 'instagram',
        status: 'running',
        started_at: new Date().toISOString(),
        triggered_by: user.id,
        properties_found: posts.length,
        import_data: { post_count: posts.length }
      })
      .select()
      .single();

    if (jobError) {
      console.error('Error creating job:', jobError);
      return new Response(
        JSON.stringify({ error: 'Failed to create import job' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let added = 0;
    let updated = 0;
    let skipped = 0;
    const errors: string[] = [];

    // Process each post
    for (const post of posts) {
      try {
        const parsed = parseInstagramPost(post);
        
        if (!parsed) {
          skipped++;
          continue;
        }

        // Check for duplicate by source_url
        const { data: existing } = await supabaseClient
          .from('properties')
          .select('id')
          .eq('source_url', parsed.source_url)
          .maybeSingle();

        if (existing) {
          // Update existing property
          const { error: updateError } = await supabaseClient
            .from('properties')
            .update({
              ...parsed,
              updated_at: new Date().toISOString(),
              source_scraped_at: new Date().toISOString(),
            })
            .eq('id', existing.id);

          if (updateError) {
            console.error('Update error:', updateError);
            errors.push(`Failed to update property: ${parsed.title}`);
            skipped++;
          } else {
            updated++;
          }
        } else {
          // Insert new property
          const { error: insertError } = await supabaseClient
            .from('properties')
            .insert({
              ...parsed,
              owner_id: user.id,
              status: 'available',
              source_scraped_at: new Date().toISOString(),
            });

          if (insertError) {
            console.error('Insert error:', insertError);
            errors.push(`Failed to insert property: ${parsed.title}`);
            skipped++;
          } else {
            added++;
          }
        }
      } catch (error) {
        console.error('Error processing post:', error);
        skipped++;
        errors.push(error.message);
      }
    }

    // Update job status
    await supabaseClient
      .from('scraping_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        properties_added: added,
        properties_updated: updated,
        properties_skipped: skipped,
        error_message: errors.length > 0 ? errors.join('; ') : null,
      })
      .eq('id', job.id);

    return new Response(
      JSON.stringify({
        success: true,
        job_id: job.id,
        summary: {
          total: posts.length,
          added,
          updated,
          skipped,
          errors: errors.length,
        },
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
