-- Fix RLS policies for chat_conversations to allow anonymous users

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Anonymous users can insert chat_conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Users can see their own conversations" ON public.chat_conversations;

-- Create new policies for chat_conversations
-- Allow anonymous users to create conversations with null user_id
CREATE POLICY "anon_can_create_conversation"
ON public.chat_conversations
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- Allow authenticated users to create their own conversations
CREATE POLICY "users_can_create_conversation"
ON public.chat_conversations
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Allow authenticated users to view their own conversations
CREATE POLICY "users_can_view_own_conversations"
ON public.chat_conversations
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Fix chat_messages policies
DROP POLICY IF EXISTS "Anonymous users can insert chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can see messages in their conversations" ON public.chat_messages;

-- Allow both anonymous and authenticated to insert messages if the conversation exists
CREATE POLICY "users_can_insert_messages"
ON public.chat_messages
FOR INSERT
TO authenticated, anon
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_conversations
    WHERE id = chat_messages.conversation_id
    AND (user_id IS NULL OR user_id = auth.uid())
  )
);

-- Allow authenticated users to view messages in their conversations
CREATE POLICY "users_can_view_own_messages"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (
  conversation_id IN (
    SELECT id FROM public.chat_conversations
    WHERE user_id = auth.uid()
  )
);

-- Ensure chat_user_info policies are correct
DROP POLICY IF EXISTS "Anonymous users can insert chat_user_info" ON public.chat_user_info;

CREATE POLICY "users_can_insert_chat_info"
ON public.chat_user_info
FOR INSERT
TO authenticated, anon
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_conversations
    WHERE id = chat_user_info.conversation_id
    AND (user_id IS NULL OR user_id = auth.uid())
  )
);