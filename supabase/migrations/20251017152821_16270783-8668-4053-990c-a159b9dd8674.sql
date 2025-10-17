-- Fix RLS policies for chat_conversations to allow anonymous users

-- Drop existing policies
DROP POLICY IF EXISTS "anon_can_create_conversation" ON public.chat_conversations;
DROP POLICY IF EXISTS "users_can_create_conversation" ON public.chat_conversations;
DROP POLICY IF EXISTS "users_can_view_own_conversations" ON public.chat_conversations;

-- Allow anyone (including anonymous) to upsert conversations
CREATE POLICY "anyone_can_upsert_conversations" 
ON public.chat_conversations
FOR ALL
USING (true)
WITH CHECK (true);

-- Fix RLS policies for chat_messages to allow anonymous users  

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "users_can_insert_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "users_can_view_own_messages" ON public.chat_messages;

-- Allow anyone (including anonymous) to insert messages
CREATE POLICY "anyone_can_insert_messages"
ON public.chat_messages  
FOR INSERT
WITH CHECK (true);

-- Allow viewing messages for conversations the user has access to
CREATE POLICY "anyone_can_view_messages"
ON public.chat_messages
FOR SELECT
USING (true);