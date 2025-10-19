-- Fix RLS policy for chat_conversations to allow anonymous users to create conversations properly
-- Drop the old restrictive policy
DROP POLICY IF EXISTS "anyone_can_insert_conversations" ON chat_conversations;

-- Create new policy that properly handles both authenticated and anonymous users
CREATE POLICY "anyone_can_insert_conversations_v2" ON chat_conversations
FOR INSERT
WITH CHECK (
  -- Authenticated users must match their own user_id
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR
  -- Anonymous users can create conversations with NULL user_id (regardless of session_id)
  (auth.uid() IS NULL AND user_id IS NULL)
);