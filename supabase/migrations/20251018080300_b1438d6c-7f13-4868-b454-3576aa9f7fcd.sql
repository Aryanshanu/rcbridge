-- Fix function search_path for update_chat_context_updated_at
CREATE OR REPLACE FUNCTION public.update_chat_context_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Drop deprecated role column from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- Drop unused user_role enum type
DROP TYPE IF EXISTS user_role CASCADE;