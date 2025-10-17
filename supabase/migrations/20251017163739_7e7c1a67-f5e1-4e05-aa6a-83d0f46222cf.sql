-- Create chat_context table for persistent conversation state
CREATE TABLE IF NOT EXISTS public.chat_context (
  conversation_id UUID PRIMARY KEY REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  entities JSONB DEFAULT '{}',
  last_action TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.chat_context ENABLE ROW LEVEL SECURITY;

-- Policies for chat_context
CREATE POLICY "Users can view their own chat context"
  ON public.chat_context
  FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM public.chat_conversations
      WHERE (user_id IS NULL OR user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert their own chat context"
  ON public.chat_context
  FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM public.chat_conversations
      WHERE (user_id IS NULL OR user_id = auth.uid())
    )
  );

CREATE POLICY "Users can update their own chat context"
  ON public.chat_context
  FOR UPDATE
  USING (
    conversation_id IN (
      SELECT id FROM public.chat_conversations
      WHERE (user_id IS NULL OR user_id = auth.uid())
    )
  );

CREATE POLICY "Admins can manage all chat context"
  ON public.chat_context
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_chat_context_conversation ON public.chat_context(conversation_id);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_chat_context_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chat_context_timestamp
  BEFORE UPDATE ON public.chat_context
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_context_updated_at();