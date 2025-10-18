import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ActivityRequest {
  customer_id?: string;
  customer_email?: string;
  customer_name?: string;
  activity_type: 'contact_form' | 'assistance_request' | 'property_inquiry' | 'chat_conversation' | 'profile_update' | 'search_query';
  activity_details: Record<string, any>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const activityData: ActivityRequest = await req.json();

    // Extract metadata from request
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const referrer = req.headers.get('referer') || req.headers.get('referrer') || 'direct';

    // Insert activity log
    const { error } = await supabase
      .from('customer_activity_history')
      .insert({
        customer_id: activityData.customer_id || null,
        customer_email: activityData.customer_email || null,
        customer_name: activityData.customer_name || null,
        activity_type: activityData.activity_type,
        activity_details: activityData.activity_details,
        ip_address: ipAddress,
        user_agent: userAgent,
        referrer: referrer,
      });

    if (error) {
      console.error('Failed to log activity:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to log activity', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Activity logged: ${activityData.activity_type} for ${activityData.customer_email || 'anonymous'}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Activity logged successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Activity logging error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
