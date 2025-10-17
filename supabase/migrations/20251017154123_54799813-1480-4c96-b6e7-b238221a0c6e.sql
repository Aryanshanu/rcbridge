-- Fix overly permissive chat RLS policies
-- Replace the "anyone_can_upsert_conversations" ALL policy with separate policies

-- Drop the existing overly permissive policies
DROP POLICY IF EXISTS "anyone_can_upsert_conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "anyone_can_view_messages" ON public.chat_messages;

-- Create secure SELECT policy for conversations
-- Users can only view their own conversations OR anonymous ones (user_id IS NULL)
CREATE POLICY "users_view_own_conversations"
ON public.chat_conversations
FOR SELECT
USING (
  user_id IS NULL OR 
  user_id = auth.uid()
);

-- Allow anyone to insert conversations (for anonymous chat support)
CREATE POLICY "anyone_can_insert_conversations"
ON public.chat_conversations
FOR INSERT
WITH CHECK (true);

-- Allow users to update their own conversations or anonymous ones
CREATE POLICY "users_can_update_own_conversations"
ON public.chat_conversations
FOR UPDATE
USING (
  user_id IS NULL OR 
  user_id = auth.uid()
);

-- Create secure SELECT policy for messages
-- Users can only view messages from their own conversations
CREATE POLICY "users_view_own_messages"
ON public.chat_messages
FOR SELECT
USING (
  conversation_id IN (
    SELECT id FROM chat_conversations 
    WHERE user_id IS NULL OR user_id = auth.uid()
  )
);

-- Keep the existing admin policy (already exists)
-- Admins can manage all chat conversations and messages