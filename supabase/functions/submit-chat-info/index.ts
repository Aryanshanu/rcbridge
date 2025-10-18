import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { conversation_id, session_id, name, email, phone, requirements } = await req.json();

    // Validate inputs
    if (!conversation_id || !name || !email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: conversation_id, name, email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate phone if provided
    if (phone && !/^[\d\s\-\+\(\)]+$/.test(phone)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create service role client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Ensure conversation exists (update session_id if needed for anonymous)
    if (session_id) {
      const { error: convError } = await supabaseAdmin
        .from('chat_conversations')
        .update({ session_id })
        .eq('id', conversation_id);
      
      if (convError) {
        console.error('Error updating conversation:', convError);
      }
    }

    // Insert chat user info
    const { data: chatInfo, error: insertError } = await supabaseAdmin
      .from('chat_user_info')
      .insert({
        conversation_id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        requirements: requirements?.trim() || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting chat info:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to save information', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log activity
    await supabaseAdmin
      .from('customer_activity_history')
      .insert({
        customer_email: email.trim().toLowerCase(),
        customer_name: name.trim(),
        activity_type: 'chat_inquiry_submitted',
        activity_details: {
          conversation_id,
          phone,
          requirements,
        },
      });

    return new Response(
      JSON.stringify({ success: true, data: chatInfo }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in submit-chat-info:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
