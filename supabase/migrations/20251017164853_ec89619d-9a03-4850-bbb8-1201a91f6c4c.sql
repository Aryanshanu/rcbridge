-- Fix function search_path for security
-- This prevents functions from being vulnerable to search_path manipulation

-- Update has_role function to include search_path (it already has it, but let's ensure it's correct)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Update update_user_role_secure function
CREATE OR REPLACE FUNCTION public.update_user_role_secure(target_user_id uuid, new_role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only admins can change roles
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;
  
  -- Prevent self-demotion
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot modify own role';
  END IF;
  
  -- Delete existing role and insert new one
  DELETE FROM user_roles WHERE user_id = target_user_id;
  INSERT INTO user_roles (user_id, role, granted_by) 
  VALUES (target_user_id, new_role, auth.uid());
END;
$$;

-- Update validate_and_consume_invite_code function
CREATE OR REPLACE FUNCTION public.validate_and_consume_invite_code(_code text, _user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
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
$$;

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$;