/**
 * Frontend Event Logger
 * Logs client-side events to backend for observability
 */

import { supabase } from "@/integrations/supabase/client";

let currentTraceId: string | null = null;

/**
 * Initialize new trace for user session
 */
export function initTrace(): string {
  currentTraceId = crypto.randomUUID();
  return currentTraceId;
}

/**
 * Get current trace ID
 */
export function getTraceId(): string {
  if (!currentTraceId) {
    currentTraceId = initTrace();
  }
  return currentTraceId;
}

export type EventSeverity = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

interface EventDetails {
  [key: string]: any;
}

/**
 * Log client-side event to backend
 */
export async function logEvent(
  action: string,
  details?: EventDetails,
  severity: EventSeverity = 'INFO'
) {
  try {
    const traceId = getTraceId();

    await supabase.functions.invoke('capture-event', {
      body: {
        action,
        details: {
          ...details,
          url: window.location.href,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          timestamp: new Date().toISOString(),
        },
        severity,
      },
      headers: {
        'traceparent': `00-${traceId}-${crypto.randomUUID().substring(0, 16)}-01`,
      },
    });
  } catch (error) {
    console.error('Failed to log event:', error);
  }
}

/**
 * Log error with automatic stack trace
 */
export async function logError(action: string, error: Error, details?: EventDetails) {
  await logEvent(action, {
    ...details,
    errorName: error.name,
    errorMessage: error.message,
    errorStack: error.stack,
  }, 'ERROR');
}

/**
 * Convenience methods for different log levels
 */
export const event = {
  info: (action: string, details?: EventDetails) => logEvent(action, details, 'INFO'),
  warn: (action: string, details?: EventDetails) => logEvent(action, details, 'WARN'),
  error: (action: string, error: Error, details?: EventDetails) => logError(action, error, details),
  critical: (action: string, details?: EventDetails) => logEvent(action, details, 'CRITICAL'),
};
