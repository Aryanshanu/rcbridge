-- Phase 4.1: Add view_count and inquiry_count to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS inquiry_count INTEGER DEFAULT 0;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_view_count ON properties(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_properties_inquiry_count ON properties(inquiry_count DESC);

-- Phase 4.2: Create property_views table for detailed tracking
CREATE TABLE IF NOT EXISTS property_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewer_email TEXT,
  viewer_ip TEXT,
  user_agent TEXT,
  referrer TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT
);

-- Enable RLS on property_views
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for property_views
CREATE POLICY "Admins can view all property views"
  ON property_views FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can track property views"
  ON property_views FOR INSERT
  WITH CHECK (true);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_property_views_property_id ON property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_viewed_at ON property_views(viewed_at DESC);

-- Phase 4.3: Create admin_login_history table
CREATE TABLE IF NOT EXISTS admin_login_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('login', 'logout')),
  login_method TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on admin_login_history
ALTER TABLE admin_login_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_login_history
CREATE POLICY "Admins can view all login history"
  ON admin_login_history FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert their own login history"
  ON admin_login_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_admin_login_history_user_id ON admin_login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_login_history_created_at ON admin_login_history(created_at DESC);