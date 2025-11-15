/**
 * Capture Event Edge Function
 * Ingests frontend events and writes to system_logs
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Logger } from "../_shared/logger.ts";
import { extractTraceContext } from "../_shared/tracer.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, traceparent",
};

const logger = new Logger('capture-event');

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const { traceId, spanId } = extractTraceContext(req);
  const startTime = Date.now();

  try {
    const { action, details, severity = 'INFO' } = await req.json();

    // Extract user context from request
    const authHeader = req.headers.get('authorization');
    let userId, userEmail;

    // If authenticated, we could decode JWT here
    // For now, we'll just log the event

    await logger.log({
      action,
      severity,
      traceId,
      spanId,
      userId,
      userEmail,
      payload: details,
      metadata: {
        source: 'frontend',
        url: details?.url,
        viewport: details?.viewport,
      },
      durationMs: Date.now() - startTime,
      ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
      userAgent: req.headers.get('user-agent'),
      referrer: req.headers.get('referer') || req.headers.get('referrer'),
    });

    return new Response(
      JSON.stringify({ success: true, traceId }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    await logger.error('capture_event_failed', traceId, error as Error);
    return new Response(
      JSON.stringify({ error: 'Failed to capture event' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
