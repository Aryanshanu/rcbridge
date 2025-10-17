# Testing Guide for RC Bridge

## Running Tests

To run the test suite, add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest --run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

Then run:
```bash
npm test
```

## Test Suites

### 1. Unit Tests (`tests/chatbotUtils.test.ts`)
Tests core chatbot utility functions:
- Budget extraction from user messages
- Timeline extraction
- Location detection
- Conversation context management

### 2. RLS Policy Tests (`tests/chat.rls.test.ts`)
Tests database security policies:
- Anonymous user conversation creation
- Anonymous user message insertion
- Proper RLS restrictions on SELECT operations

### 3. Edge Function Smoke Tests (`tests/chatAssistant.smoke.test.ts`)
Tests the chat assistant edge function:
- Health check endpoint
- Streaming response validation

## What's Been Fixed

✅ **Positioning**: Notification button bottom-left (z-40), Chat assistant bottom-right (z-50)  
✅ **No Duplicate Conversations**: Using `upsert` instead of `insert` prevents "duplicate key" errors  
✅ **Health Check Pre-warming**: Edge function is pre-warmed on app load to reduce initial latency  
✅ **Optimized Message History**: Reduced from 15 to 12 messages to decrease request size  
✅ **Preconnect to HuggingFace**: DNS/TLS handshake optimization via `<link rel="preconnect">`  
✅ **Ephemeral Mode Fallback**: Chat continues in-memory if database upsert fails  
✅ **Test Coverage**: Unit, RLS, and edge function smoke tests implemented  

## Architecture Improvements

1. **Conversation ID Generation**: Now client-side with `crypto.randomUUID()` for both anonymous and authenticated users
2. **Upsert Strategy**: All conversation creation uses `upsert` with `onConflict: 'id'` to prevent duplicates
3. **Graceful Degradation**: If database operations fail, chat continues in ephemeral mode
4. **Rate Limiting**: Edge function has proper IP-based rate limiting
5. **Health Endpoint**: GET `/chat-assistant?health=1` for pre-warming and monitoring
