-- ============================================================================
-- CRITICAL SECURITY FIXES - ERROR LEVEL ISSUES
-- ============================================================================

-- ============================================================================
-- FIX 1: ENABLE RLS ON community_posts TABLE
-- ============================================================================

-- Enable Row Level Security
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Anyone can view published posts"
ON public.community_posts FOR SELECT
USING (true);

-- Users can create their own posts
CREATE POLICY "Users can create their own posts"
ON public.community_posts FOR INSERT
WITH CHECK (auth.uid() = author_id);

-- Users can update their own posts
CREATE POLICY "Users can update their own posts"
ON public.community_posts FOR UPDATE
USING (auth.uid() = author_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete their own posts"
ON public.community_posts FOR DELETE
USING (auth.uid() = author_id);

-- Admins have full access
CREATE POLICY "Admins have full access to posts"
ON public.community_posts FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- ============================================================================
-- FIX 2: CREATE SECURE DATABASE-BACKED INVITE SYSTEM
-- ============================================================================

-- Create invite codes table
CREATE TABLE public.invite_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  used_by uuid REFERENCES auth.users(id),
  created_by uuid REFERENCES auth.users(id),
  max_uses integer DEFAULT 1,
  current_uses integer DEFAULT 0
);

-- Enable RLS - no direct access
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

-- No direct SELECT access (all validation via function)
CREATE POLICY "No direct access to invite codes"
ON public.invite_codes FOR SELECT
USING (false);

-- Only admins can insert new codes
CREATE POLICY "Admins can create invite codes"
ON public.invite_codes FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Only admins can view codes for management
CREATE POLICY "Admins can manage invite codes"
ON public.invite_codes FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create secure validation function
CREATE OR REPLACE FUNCTION public.validate_and_consume_invite_code(
  _code text,
  _user_id uuid
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invite_record record;
BEGIN
  -- Find valid, non-expired code with available uses
  SELECT * INTO invite_record
  FROM invite_codes
  WHERE code = _code
    AND expires_at > now()
    AND (current_uses < max_uses OR max_uses = 0);
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'valid', false,
      'message', 'Invalid or expired invite code'
    );
  END IF;
  
  -- Check if already used by this user
  IF invite_record.used_by = _user_id THEN
    RETURN jsonb_build_object(
      'valid', false,
      'message', 'Invite code already used'
    );
  END IF;
  
  -- Mark as used/increment usage
  UPDATE invite_codes
  SET current_uses = current_uses + 1,
      used_at = CASE 
        WHEN used_at IS NULL THEN now() 
        ELSE used_at 
      END,
      used_by = CASE 
        WHEN used_by IS NULL THEN _user_id 
        ELSE used_by 
      END
  WHERE id = invite_record.id;
  
  RETURN jsonb_build_object(
    'valid', true,
    'role', invite_record.role,
    'message', 'Invite code valid'
  );
END;
$$ LANGUAGE plpgsql;

-- Seed initial invite codes (these should be rotated immediately)
INSERT INTO public.invite_codes (code, role, expires_at, max_uses)
VALUES 
  ('ADMIN-' || substring(md5(random()::text) from 1 for 8), 'admin', now() + interval '1 year', 1),
  ('DEV-' || substring(md5(random()::text) from 1 for 8), 'developer', now() + interval '1 year', 1),
  ('MAINT-' || substring(md5(random()::text) from 1 for 8), 'maintainer', now() + interval '1 year', 1);