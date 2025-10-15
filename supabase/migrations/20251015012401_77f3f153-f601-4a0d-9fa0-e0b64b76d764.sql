-- CRITICAL SECURITY FIXES FOR RC BRIDGE PLATFORM

-- ============================================================================
-- FIX 1: CREATE PROPER USER ROLES ARCHITECTURE
-- ============================================================================

-- Create app_role enum (separate from user_role to avoid conflicts)
CREATE TYPE public.app_role AS ENUM ('admin', 'developer', 'maintainer', 'user');

-- Create secure user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  granted_at timestamptz DEFAULT now(),
  granted_by uuid REFERENCES auth.users(id),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to prevent RLS recursion
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

-- Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role, granted_at)
SELECT 
  id,
  CASE 
    WHEN role = 'admin' THEN 'admin'::app_role
    WHEN role = 'developer' THEN 'developer'::app_role
    WHEN role = 'maintainer' THEN 'maintainer'::app_role
    ELSE 'user'::app_role
  END as role,
  created_at
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- RLS policy for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- ============================================================================
-- FIX 2: DROP INSECURE update_user_role FUNCTION
-- ============================================================================

DROP FUNCTION IF EXISTS public.update_user_role(uuid, user_role);

-- Create secure version with authorization
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

-- ============================================================================
-- FIX 3: ENABLE RLS ON UNPROTECTED TABLES
-- ============================================================================

-- assistance_requests: Enable RLS and add policies
ALTER TABLE public.assistance_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit assistance requests"
ON public.assistance_requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all assistance requests"
ON public.assistance_requests FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- user_rewards: Enable RLS and add policies
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rewards"
ON public.user_rewards FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all rewards"
ON public.user_rewards FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- property_alerts: Enable RLS and add policies
ALTER TABLE public.property_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own alerts"
ON public.property_alerts FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all alerts"
ON public.property_alerts FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- conversations: Enable RLS (legacy table)
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can access conversations"
ON public.conversations FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- ============================================================================
-- FIX 4: SECURE demo_requests POLICIES
-- ============================================================================

-- Drop existing insecure policies
DROP POLICY IF EXISTS "Users can view their own demo requests" ON public.demo_requests;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.demo_requests;

-- Create secure policies
CREATE POLICY "Users can insert their own demo requests"
ON public.demo_requests FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Users can view their own demo requests"
ON public.demo_requests FOR SELECT
USING (
  auth.uid() IS NOT NULL AND 
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Admins can view all demo requests"
ON public.demo_requests FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update demo requests"
ON public.demo_requests FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- ============================================================================
-- FIX 5: UPDATE EXISTING RLS POLICIES TO USE has_role()
-- ============================================================================

-- Update properties table policies
DROP POLICY IF EXISTS "Admins have full access to properties" ON public.properties;
DROP POLICY IF EXISTS "Developers can insert and update properties" ON public.properties;
DROP POLICY IF EXISTS "Developers can insert properties" ON public.properties;
DROP POLICY IF EXISTS "Developers can view and update properties" ON public.properties;
DROP POLICY IF EXISTS "Maintainers can update properties" ON public.properties;
DROP POLICY IF EXISTS "Maintainers can view properties" ON public.properties;

CREATE POLICY "Admins have full access to properties"
ON public.properties FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Developers can manage properties"
ON public.properties FOR ALL
USING (has_role(auth.uid(), 'developer'));

CREATE POLICY "Maintainers can view and update properties"
ON public.properties FOR SELECT
USING (has_role(auth.uid(), 'maintainer'));

CREATE POLICY "Maintainers can update properties"
ON public.properties FOR UPDATE
USING (has_role(auth.uid(), 'maintainer'));

-- Update profiles policies
DROP POLICY IF EXISTS "Authenticated users can view any profile" ON public.profiles;

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Update chat policies
DROP POLICY IF EXISTS "Admins can do all on chat_conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Admins can do all on chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Admins can do all on chat_user_info" ON public.chat_user_info;

CREATE POLICY "Admins can manage all chat conversations"
ON public.chat_conversations FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all chat messages"
ON public.chat_messages FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all chat user info"
ON public.chat_user_info FOR ALL
USING (has_role(auth.uid(), 'admin'));