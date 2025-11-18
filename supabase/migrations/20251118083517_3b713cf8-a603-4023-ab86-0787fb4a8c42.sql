-- Phase 3: Enable realtime for all admin dashboard tables
-- Enable realtime for customer_activity_history
ALTER TABLE customer_activity_history REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE customer_activity_history;

-- Enable realtime for scraping_jobs
ALTER TABLE scraping_jobs REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE scraping_jobs;

-- Enable realtime for system_logs
ALTER TABLE system_logs REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE system_logs;

-- Enable realtime for admin_login_history
ALTER TABLE admin_login_history REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE admin_login_history;

-- Phase 7: Performance optimization - Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_system_logs_trace_created 
ON system_logs(trace_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_system_logs_severity_created 
ON system_logs(severity, created_at DESC) 
WHERE severity IN ('ERROR', 'CRITICAL');

CREATE INDEX IF NOT EXISTS idx_system_logs_action_created 
ON system_logs(action, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_scraping_jobs_status_created 
ON scraping_jobs(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_customer_activity_created 
ON customer_activity_history(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_customer_activity_type 
ON customer_activity_history(activity_type, created_at DESC);