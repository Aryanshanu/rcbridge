-- Create main admin account: Ganesh Kumar

-- Step 1: Check if user already exists, if not this will be handled via auth.users
-- Note: The actual user creation in auth.users must be done via Supabase Auth API
-- This migration only handles the profile and role assignment

-- Step 2: Insert profile data (will be created when user signs up, or we insert manually if needed)
-- We'll use a DO block to handle this conditionally

DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Try to find existing user by email from auth.users
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'ganeshgoud0023@gmail.com';
  
  -- If user doesn't exist yet, we'll create a placeholder UUID
  -- The actual auth user must be created separately
  IF admin_user_id IS NULL THEN
    -- Generate a specific UUID for this admin (will be replaced when real user signs up)
    admin_user_id := gen_random_uuid();
    
    RAISE NOTICE 'Admin user does not exist in auth.users yet. You must create user via Supabase dashboard with email: ganeshgoud0023@gmail.com';
  END IF;
  
  -- Insert or update profile
  INSERT INTO public.profiles (id, username, full_name, role)
  VALUES (admin_user_id, 'ganeshkumar', 'Ganesh Kumar', 'admin')
  ON CONFLICT (id) DO UPDATE
  SET full_name = 'Ganesh Kumar',
      username = 'ganeshkumar',
      role = 'admin';
  
  -- Ensure admin role exists in user_roles table
  INSERT INTO public.user_roles (user_id, role, granted_by)
  VALUES (admin_user_id, 'admin', admin_user_id)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE 'Admin profile and role configured for user ID: %', admin_user_id;
END $$;