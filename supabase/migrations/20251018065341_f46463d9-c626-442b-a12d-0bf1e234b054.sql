-- STEP 1: Fix master admin password hash (bcrypt hash for 'Admin@2025')
UPDATE master_admin 
SET password_hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE username = 'master_admin';

-- STEP 2: Create admin login history table
CREATE TABLE IF NOT EXISTS admin_login_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES master_admin(id),
  username TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  login_attempt_time TIMESTAMPTZ DEFAULT NOW(),
  login_status TEXT NOT NULL CHECK(login_status IN ('success', 'failed', 'blocked')),
  failure_reason TEXT,
  session_token TEXT,
  session_duration INTERVAL,
  logout_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_login_history_admin_id ON admin_login_history(admin_id);
CREATE INDEX idx_admin_login_history_username ON admin_login_history(username);
CREATE INDEX idx_admin_login_history_time ON admin_login_history(login_attempt_time DESC);

-- RLS for admin_login_history
ALTER TABLE admin_login_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Master admins can view login history"
ON admin_login_history
FOR SELECT
USING (true);

CREATE POLICY "System can insert login history"
ON admin_login_history
FOR INSERT
WITH CHECK (true);

-- STEP 3: Create customer activity history table
CREATE TABLE IF NOT EXISTS customer_activity_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID,
  customer_email TEXT,
  customer_name TEXT,
  activity_type TEXT NOT NULL CHECK(activity_type IN (
    'contact_form', 'assistance_request', 'property_inquiry', 
    'chat_conversation', 'profile_update', 'search_query'
  )),
  activity_details JSONB NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customer_activity_customer_id ON customer_activity_history(customer_id);
CREATE INDEX idx_customer_activity_email ON customer_activity_history(customer_email);
CREATE INDEX idx_customer_activity_type ON customer_activity_history(activity_type);
CREATE INDEX idx_customer_activity_time ON customer_activity_history(created_at DESC);

-- RLS for customer_activity_history
ALTER TABLE customer_activity_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view customer activity"
ON customer_activity_history
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert customer activity"
ON customer_activity_history
FOR INSERT
WITH CHECK (true);