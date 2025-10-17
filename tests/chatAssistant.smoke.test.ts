import { describe, it, expect } from 'vitest';

const EDGE_FUNCTION_URL = 'https://hchtekfbtcbfsfxkjyfi.functions.supabase.co/chat-assistant';

describe('Chat Assistant Edge Function', () => {
  it('should respond to health check', async () => {
    const response = await fetch(`${EDGE_FUNCTION_URL}?health=1`);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('ok');
  });

  it('should return streaming response for chat', async () => {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Hello' }
        ],
      }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/event-stream');
  }, 30000);
});
