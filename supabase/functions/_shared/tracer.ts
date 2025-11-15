/**
 * OpenTelemetry Tracer Utility
 * Provides distributed tracing across Edge Functions
 */

export interface Span {
  spanId: string;
  traceId: string;
  startTime: number;
  endTime?: number;
  attributes?: Record<string, any>;
  status?: 'ok' | 'error';
  error?: Error;
}

/**
 * Generate trace ID for linking logs across requests
 */
export function generateTraceId(): string {
  return crypto.randomUUID();
}

/**
 * Generate span ID for distributed tracing
 */
export function generateSpanId(): string {
  return crypto.randomUUID().substring(0, 16);
}

/**
 * Extract trace context from HTTP headers (W3C traceparent format)
 */
export function extractTraceContext(req: Request): { traceId: string; spanId?: string } {
  const traceParent = req.headers.get('traceparent');
  if (traceParent) {
    const parts = traceParent.split('-');
    if (parts.length >= 3) {
      return { traceId: parts[1], spanId: parts[2] };
    }
  }
  return { traceId: generateTraceId() };
}

/**
 * Wrap async operation in a span for distributed tracing
 */
export async function withSpan<T>(
  name: string,
  fn: (span: Span) => Promise<T>,
  traceId?: string,
  attributes?: Record<string, any>
): Promise<{ result: T; span: Span }> {
  const span: Span = {
    spanId: generateSpanId(),
    traceId: traceId || generateTraceId(),
    startTime: Date.now(),
    attributes: { operation: name, ...attributes },
  };

  try {
    const result = await fn(span);
    span.endTime = Date.now();
    span.status = 'ok';
    return { result, span };
  } catch (error) {
    span.endTime = Date.now();
    span.status = 'error';
    span.error = error as Error;
    throw error;
  }
}
