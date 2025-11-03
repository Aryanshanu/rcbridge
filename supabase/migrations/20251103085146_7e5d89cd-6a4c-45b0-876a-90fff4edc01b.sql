-- Fix chat_conversations RLS policy to allow anonymous users to update conversations
-- This resolves the "new row violates row-level security policy" error when using upsert

-- Drop the existing restrictive UPDATE policy
DROP POLICY IF EXISTS "users_can_update_own_conversations" ON public.chat_conversations;

-- Create comprehensive UPDATE policy that handles both authenticated and anonymous users
CREATE POLICY "anyone_can_update_own_conversations"
ON public.chat_conversations
FOR UPDATE
USING (
  -- Authenticated users can update their own conversations
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR
  -- Anonymous users can update conversations with null user_id and matching session_id
  (auth.uid() IS NULL AND user_id IS NULL AND session_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'session_id'::text))
)
WITH CHECK (
  -- Authenticated users must keep their user_id
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR
  -- Anonymous users must keep user_id as null
  (auth.uid() IS NULL AND user_id IS NULL)
);