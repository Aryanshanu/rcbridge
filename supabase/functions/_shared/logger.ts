/**
 * Structured Logger for System Logs
 * Writes to system_logs table with trace context
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

export type LogSeverity = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

interface LogEntry {
  action: string;
  component: string;
  severity: LogSeverity;
  traceId: string;
  spanId?: string;
  parentSpanId?: string;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  sessionId?: string;
  payload?: any;
  metadata?: any;
  errorType?: string;
  errorMessage?: string;
  stackTrace?: string;
  durationMs?: number;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}

export class Logger {
  private supabase: any;
  private component: string;

  constructor(component: string) {
    this.component = component;
    const url = Deno.env.get('SUPABASE_URL')!;
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    this.supabase = createClient(url, key);
  }

  async log(entry: Partial<LogEntry>) {
    try {
      const { error } = await this.supabase.from('system_logs').insert({
        action: entry.action,
        component: this.component,
        severity: entry.severity || 'INFO',
        trace_id: entry.traceId,
        span_id: entry.spanId,
        parent_span_id: entry.parentSpanId,
        user_id: entry.userId,
        user_email: entry.userEmail,
        user_role: entry.userRole,
        session_id: entry.sessionId,
        payload: entry.payload || {},
        metadata: entry.metadata || {},
        error_type: entry.errorType,
        error_message: entry.errorMessage,
        stack_trace: entry.stackTrace,
        duration_ms: entry.durationMs,
        ip_address: entry.ipAddress,
        user_agent: entry.userAgent,
        referrer: entry.referrer,
      });

      if (error) {
        console.error('[Logger] Failed to write log:', error);
      }

      // Also log to console for edge function logs
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        component: this.component,
        action: entry.action,
        severity: entry.severity,
        traceId: entry.traceId,
        ...entry,
      }));
    } catch (error) {
      console.error('[Logger] Exception writing log:', error);
    }
  }

  async info(action: string, traceId: string, payload?: any, metadata?: any) {
    await this.log({ action, traceId, severity: 'INFO', payload, metadata });
  }

  async warn(action: string, traceId: string, payload?: any, metadata?: any) {
    await this.log({ action, traceId, severity: 'WARN', payload, metadata });
  }

  async error(action: string, traceId: string, error: Error, metadata?: any) {
    await this.log({
      action,
      traceId,
      severity: 'ERROR',
      errorType: error.name,
      errorMessage: error.message,
      stackTrace: error.stack,
      metadata,
    });
  }

  async critical(action: string, traceId: string, error: Error, metadata?: any) {
    await this.log({
      action,
      traceId,
      severity: 'CRITICAL',
      errorType: error.name,
      errorMessage: error.message,
      stackTrace: error.stack,
      metadata,
    });
  }
}
