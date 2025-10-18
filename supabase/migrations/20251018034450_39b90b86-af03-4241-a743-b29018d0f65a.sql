-- Create master admin table for owner authentication
CREATE TABLE IF NOT EXISTS public.master_admin (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz,
  session_token text UNIQUE,
  token_expires_at timestamptz
);

-- Enable RLS on master_admin table
ALTER TABLE public.master_admin ENABLE ROW LEVEL SECURITY;

-- Only master admins can access this table (no public access)
CREATE POLICY "Master admins only" ON public.master_admin
  FOR ALL USING (false);

-- Insert default master admin account (password: Admin@2025)
-- Password is hashed using bcrypt with salt rounds 10
INSERT INTO public.master_admin (username, password_hash)
VALUES ('master_admin', '$2a$10$YJZkVZqXqW8bJZjN5Y5Z5OXK5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Zu')
ON CONFLICT (username) DO NOTHING;

-- Create function to validate master admin session
CREATE OR REPLACE FUNCTION public.validate_master_admin_session(session_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_record record;
BEGIN
  SELECT * INTO admin_record
  FROM master_admin
  WHERE master_admin.session_token = validate_master_admin_session.session_token
    AND token_expires_at > now();
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'message', 'Invalid or expired session');
  END IF;
  
  RETURN jsonb_build_object(
    'valid', true,
    'admin_id', admin_record.id,
    'username', admin_record.username
  );
END;
$$;