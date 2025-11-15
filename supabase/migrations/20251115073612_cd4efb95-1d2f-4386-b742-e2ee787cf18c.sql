-- Create comprehensive system logs table for observability
CREATE TABLE public.system_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  
  -- Identity
  user_id uuid,
  user_email text,
  user_role text,
  session_id text,
  
  -- Action tracking
  action text NOT NULL,
  component text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL')),
  
  -- Context
  payload jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Tracing
  trace_id text NOT NULL,
  span_id text,
  parent_span_id text,
  
  -- LLM mitigation
  llm_reasoning jsonb,
  mitigation_applied jsonb,
  mitigation_confidence numeric(3,2),
  auto_fixed boolean DEFAULT false,
  
  -- Technical details
  error_type text,
  error_message text,
  stack_trace text,
  request_id text,
  duration_ms integer,
  
  -- Network context
  ip_address text,
  user_agent text,
  referrer text
);

-- Indexes for fast queries
CREATE INDEX idx_system_logs_trace_id ON system_logs(trace_id);
CREATE INDEX idx_system_logs_user_id ON system_logs(user_id);
CREATE INDEX idx_system_logs_severity ON system_logs(severity);
CREATE INDEX idx_system_logs_action ON system_logs(action);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at DESC);
CREATE INDEX idx_system_logs_auto_fixed ON system_logs(auto_fixed) WHERE auto_fixed = true;

-- RLS policies
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all logs"
  ON system_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Service role can insert logs"
  ON system_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own logs"
  ON system_logs FOR SELECT
  USING (auth.uid() = user_id);