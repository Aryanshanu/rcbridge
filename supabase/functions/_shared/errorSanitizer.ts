/**
 * Error Sanitizer Utility
 * Prevents leaking database internals to clients by sanitizing error messages
 */

export function sanitizeError(error: any): string {
  const msg = error?.message || '';
  
  if (msg.includes('duplicate key')) return 'Record already exists';
  if (msg.includes('foreign key')) return 'Invalid reference';
  if (msg.includes('violates check constraint')) return 'Invalid data';
  if (msg.includes('permission denied')) return 'Access denied';
  if (msg.includes('row-level security')) return 'Access denied';
  if (msg.includes('not found')) return 'Resource not found';
  if (msg.includes('violates unique constraint')) return 'Record already exists';
  
  return 'Operation failed';
}

export function logErrorSecurely(context: string, error: any, metadata?: Record<string, any>) {
  // Server logs only - never expose to client
  console.error(`[${context}]`, {
    code: error?.code,
    hint: error?.hint,
    metadata,
    timestamp: new Date().toISOString()
  });
}
