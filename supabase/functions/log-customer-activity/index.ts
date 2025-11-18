import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';
import { sanitizeError, logErrorSecurely } from '../_shared/errorSanitizer.ts';
import { Logger } from '../_shared/logger.ts';
import { extractTraceContext } from '../_shared/tracer.ts';

const logger = new Logger('log-customer-activity');

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

  const { traceId, spanId } = extractTraceContext(req);
  const startTime = Date.now();

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
      logErrorSecurely('log-customer-activity', error, { operation: 'insert', activity_type: activityData.activity_type });
      return new Response(
        JSON.stringify({ error: sanitizeError(error) }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Activity logged: ${activityData.activity_type} for ${activityData.customer_email || 'anonymous'}`);
    await logger.info('customer_activity_logged', traceId, {
      activity_type: activityData.activity_type,
      customer_email: activityData.customer_email,
      duration_ms: Date.now() - startTime
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Activity logged successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    await logger.error('customer_activity_log_failed', traceId, error as Error);
    logErrorSecurely('log-customer-activity', error, { operation: 'general' });
    return new Response(
      JSON.stringify({ error: sanitizeError(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
