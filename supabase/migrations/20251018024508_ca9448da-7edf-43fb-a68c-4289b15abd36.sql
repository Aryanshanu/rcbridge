-- Fix anonymous chat data exposure by adding session-based identification
-- Add session_id column to chat_conversations for anonymous user tracking
ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS session_id text;

-- Create index for session_id lookups
CREATE INDEX IF NOT EXISTS idx_chat_conversations_session_id ON chat_conversations(session_id) WHERE session_id IS NOT NULL;

-- Drop existing policies that allow unrestricted access to anonymous chats
DROP POLICY IF EXISTS "users_view_own_conversations" ON chat_conversations;
DROP POLICY IF EXISTS "users_can_update_own_conversations" ON chat_conversations;
DROP POLICY IF EXISTS "anyone_can_insert_conversations" ON chat_conversations;

-- Create new policies with proper session isolation
CREATE POLICY "users_view_own_conversations" ON chat_conversations
FOR SELECT USING (
  (user_id = auth.uid()) OR 
  (user_id IS NULL AND session_id = current_setting('request.jwt.claims', true)::json->>'session_id')
);

CREATE POLICY "users_can_update_own_conversations" ON chat_conversations
FOR UPDATE USING (
  (user_id = auth.uid()) OR 
  (user_id IS NULL AND session_id = current_setting('request.jwt.claims', true)::json->>'session_id')
);

CREATE POLICY "anyone_can_insert_conversations" ON chat_conversations
FOR INSERT WITH CHECK (
  (user_id = auth.uid()) OR 
  (user_id IS NULL AND session_id IS NOT NULL)
);

-- Update chat_messages policies to respect session isolation
DROP POLICY IF EXISTS "users_view_own_messages" ON chat_messages;

CREATE POLICY "users_view_own_messages" ON chat_messages
FOR SELECT USING (
  conversation_id IN (
    SELECT id FROM chat_conversations 
    WHERE (user_id = auth.uid()) OR 
          (user_id IS NULL AND session_id = current_setting('request.jwt.claims', true)::json->>'session_id')
  )
);

-- Update chat_context policies to respect session isolation
DROP POLICY IF EXISTS "Users can view their own chat context" ON chat_context;
DROP POLICY IF EXISTS "Users can insert their own chat context" ON chat_context;
DROP POLICY IF EXISTS "Users can update their own chat context" ON chat_context;

CREATE POLICY "Users can view their own chat context" ON chat_context
FOR SELECT USING (
  conversation_id IN (
    SELECT id FROM chat_conversations 
    WHERE (user_id = auth.uid()) OR 
          (user_id IS NULL AND session_id = current_setting('request.jwt.claims', true)::json->>'session_id')
  )
);

CREATE POLICY "Users can insert their own chat context" ON chat_context
FOR INSERT WITH CHECK (
  conversation_id IN (
    SELECT id FROM chat_conversations 
    WHERE (user_id = auth.uid()) OR 
          (user_id IS NULL AND session_id = current_setting('request.jwt.claims', true)::json->>'session_id')
  )
);

CREATE POLICY "Users can update their own chat context" ON chat_context
FOR UPDATE USING (
  conversation_id IN (
    SELECT id FROM chat_conversations 
    WHERE (user_id = auth.uid()) OR 
          (user_id IS NULL AND session_id = current_setting('request.jwt.claims', true)::json->>'session_id')
  )
);

-- Update chat_user_info policies
DROP POLICY IF EXISTS "users_can_insert_chat_info" ON chat_user_info;

CREATE POLICY "users_can_insert_chat_info" ON chat_user_info
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM chat_conversations 
    WHERE id = chat_user_info.conversation_id 
    AND ((user_id = auth.uid()) OR 
         (user_id IS NULL AND session_id = current_setting('request.jwt.claims', true)::json->>'session_id'))
  )
);

-- Add automatic cleanup for old anonymous conversations (30 days)
CREATE OR REPLACE FUNCTION cleanup_old_anonymous_chats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM chat_conversations
  WHERE user_id IS NULL 
  AND created_at < NOW() - INTERVAL '30 days';
END;
$$;