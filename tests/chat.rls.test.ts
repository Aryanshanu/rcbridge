import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hchtekfbtcbfsfxkjyfi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjaHRla2ZidGNiZnNmeGtqeWZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3OTA3NzMsImV4cCI6MjA1MzM2Njc3M30.mO4rVWSuf9q25dkFTxqa1Gml-Glp0gKcQZUKqCaM714';

describe('Chat RLS Policies - Anonymous Users', () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  it('should allow anonymous users to upsert conversations with null user_id', async () => {
    const testConvId = crypto.randomUUID();
    
    const { error } = await supabase
      .from('chat_conversations')
      .upsert([{ id: testConvId, user_id: null }], {
        onConflict: 'id',
        ignoreDuplicates: false,
      });

    expect(error).toBeNull();
  });

  it('should allow anonymous users to insert messages', async () => {
    const testConvId = crypto.randomUUID();
    
    // First create conversation
    await supabase
      .from('chat_conversations')
      .upsert([{ id: testConvId, user_id: null }], {
        onConflict: 'id',
      });

    // Then insert message
    const { error } = await supabase
      .from('chat_messages')
      .insert([{
        conversation_id: testConvId,
        sender_type: 'user',
        content: 'Test message',
      }]);

    expect(error).toBeNull();
  });

  it('should NOT allow anonymous users to SELECT conversations', async () => {
    const { error } = await supabase
      .from('chat_conversations')
      .select('*')
      .limit(1);

    // Anonymous users should not be able to view conversations
    expect(error).not.toBeNull();
  });
});
