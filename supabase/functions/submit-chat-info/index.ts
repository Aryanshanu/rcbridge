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
    const body = await req.json();
    const { conversation_id, session_id, name, email, phone, requirements } = body;
    
    console.log('=== submit-chat-info called ===');
    console.log('Body received:', JSON.stringify({ conversation_id, session_id, name, email, phone: phone ? '***' : null, requirements: requirements ? 'provided' : null }));

    // Validate inputs
    if (!conversation_id || !name || !email) {
      console.error('Validation failed: Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields: conversation_id, name, email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Validation failed: Invalid email format');
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate phone if provided
    if (phone && !/^[\d\s\-\+\(\)]+$/.test(phone)) {
      console.error('Validation failed: Invalid phone format');
      return new Response(
        JSON.stringify({ error: 'Invalid phone format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Validation passed, creating Supabase admin client');

    // Create service role client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify conversation exists first
    const { data: existingConv, error: checkError } = await supabaseAdmin
      .from('chat_conversations')
      .select('id, user_id, session_id')
      .eq('id', conversation_id)
      .single();
    
    if (checkError) {
      console.error('Conversation check failed:', checkError);
      return new Response(
        JSON.stringify({ error: 'Conversation not found', details: checkError.message }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Conversation exists:', { id: existingConv.id, user_id: existingConv.user_id, has_session: !!existingConv.session_id });

    // Update session_id if needed for anonymous users
    if (session_id && !existingConv.session_id) {
      console.log('Updating conversation with session_id');
      const { error: convError } = await supabaseAdmin
        .from('chat_conversations')
        .update({ session_id })
        .eq('id', conversation_id);
      
      if (convError) {
        console.error('Error updating conversation session_id:', convError);
      } else {
        console.log('Session ID updated successfully');
      }
    }

    // Insert chat user info
    console.log('Inserting chat user info...');
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
    
    console.log('Chat user info inserted successfully:', chatInfo.id);

    // Log activity
    console.log('Logging customer activity...');
    const { error: activityError } = await supabaseAdmin
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
    
    if (activityError) {
      console.error('Error logging activity (non-fatal):', activityError);
    } else {
      console.log('Customer activity logged successfully');
    }

    console.log('=== submit-chat-info completed successfully ===');
    return new Response(
      JSON.stringify({ success: true, data: chatInfo }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('=== submit-chat-info ERROR ===');
    console.error('Error details:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
