# Chatbot Architecture Documentation

## Overview
This document provides comprehensive instructions for maintaining and enhancing the RC Bridge real estate chatbot. Follow these guidelines to prevent issues and ensure consistent functionality.

---

## 1. Positioning System

### Component Structure
- **Library**: `react-rnd` for resizable and draggable functionality
- **Fixed Position**: Bottom-right corner of viewport
- **State Management**: `windowDimensions` tracks viewport size dynamically

### Critical Implementation Rules

**✅ CORRECT:**
```typescript
const [windowDimensions, setWindowDimensions] = useState({
  width: window.innerWidth,
  height: window.innerHeight
});

// Window resize listener
useEffect(() => {
  const handleResize = () => {
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// Use windowDimensions in Rnd component
<Rnd
  position={{ 
    x: windowDimensions.width - chatWidth - 24,
    y: windowDimensions.height - chatHeight - 88
  }}
/>
```

**❌ INCORRECT:**
```typescript
// NEVER do this - causes stale values
<Rnd
  position={{ 
    x: window.innerWidth - chatWidth - 24,  // ❌ BAD
    y: window.innerHeight - chatHeight - 88  // ❌ BAD
  }}
/>
```

### Positioning Constants
| Mode | Width | Height | Right Offset | Bottom Offset |
|------|-------|--------|--------------|---------------|
| **Normal** | 400px | 600px (user-resizable) | 24px | 88px (accounts for button) |
| **Maximized** | 72vw (max 980px) | 78vh (max 880px) | 32px | 32px |

### Size Constraints
- **Minimum**: 320px × 400px
- **Maximum**: 600px × 900px (normal) / 980px × 880px (maximized)
- **Resizing**: Bottom edge only in normal mode (vertical resize)

---

## 2. Conversation Flow Architecture

### Intent Detection System

#### Quick Reply Buttons (Initial State)
Users select their intent first:
- 🏠 **Buy** → Looking to purchase property
- 💰 **Sell** → Want to list property
- 🔑 **Rent** → Searching for rental
- 📊 **Trends** → Market insights

**Visibility Rules:**
- ✅ Show: Fresh chat open, after "Clear chat"
- ❌ Hide: After any intent button clicked
- State: `showQuickReplies` boolean

### Entity Extraction Flow

#### Buy/Invest Intent Priority
```
1. Budget → Ask first (₹50L-₹1Cr, ₹1Cr-₹2Cr, ₹2Cr+)
2. Property Type → Apartment/Villa/House/Commercial
3. Location → Gachibowli/Jubilee Hills/Banjara Hills/etc.
4. Size → [Property-type aware]
   - Residential → BHK (1/2/3/4+)
   - Commercial → sq ft (500-1000/1000-2000/2000-5000/5000+)
```

#### Sell Intent Priority
```
1. Property Type → First (what are they selling?)
2. Location → Where is the property?
3. Size → [Property-type aware]
   - Residential → BHK options
   - Commercial → sq ft ranges
4. Budget/Price → Expected selling price
```

#### Rent Intent Priority
```
1. Budget → Monthly rent range
2. Location → Preferred areas
3. Duration → Short-term (<6mo) / Long-term (6+mo)
4. Size → [Property-type aware]
```

#### Trends Intent Priority
```
1. Location → Area of interest (only required entity)
```

---

## 3. Property Type Differentiation (CRITICAL)

### Implementation in `generateSmartSuggestions`

**✅ CORRECT - Property-Type Aware:**
```typescript
if (!entities.size && !entities.bedrooms) {
  const propertyType = entities.property_type?.toLowerCase() || '';
  
  if (propertyType.includes('commercial')) {
    // For commercial properties, ask about square footage
    suggestions.push("500-1000 sq ft", "1000-2000 sq ft", "2000-5000 sq ft", "5000+ sq ft", "Custom size");
  } else {
    // For residential properties, ask about bedrooms
    suggestions.push("1 BHK", "2 BHK", "3 BHK", "4+ BHK");
  }
  setSmartSuggestions(suggestions);
  return;
}
```

**❌ INCORRECT - Always suggests BHK:**
```typescript
if (entities.location && !entities.size) {
  suggestions.push("1 BHK", "2 BHK", "3 BHK", "4+ BHK"); // ❌ Ignores property type
}
```

### Property Type Classification
| Type | Category | Size Options |
|------|----------|--------------|
| Apartment | Residential | 1/2/3/4+ BHK |
| Villa | Residential | 1/2/3/4+ BHK |
| Independent House | Residential | 1/2/3/4+ BHK |
| Commercial | Commercial | sq ft ranges |

---

## 4. Message Flow System

### Frontend Responsibilities
1. **Smart Suggestion Buttons**: Generate sequential questions based on missing entities
2. **Entity State Management**: Track `contextEntities` with budget, location, property_type, size, timeline
3. **Quick Reply Visibility**: Show/hide initial intent buttons
4. **Message Persistence**: Save to Supabase `chat_messages` table

### Backend (Edge Function) Responsibilities
1. **AI Response Generation**: Process conversation with system prompt
2. **Context Awareness**: Receive entity summary from frontend
3. **Structured Guidance**: System prompt enforces one question at a time

### Streaming System
- **Protocol**: Server-Sent Events (SSE)
- **Timeout Handling**:
  - 5s: Show "Connecting..." message (`setIsConnecting(true)`)
  - 25s: Hard timeout, abort request
- **Retry Logic**: Exponential backoff (600ms → 1200ms)

---

## 5. Error Handling Matrix

### HTTP Error Codes

| Status | Error Type | User Message | Action Required |
|--------|-----------|--------------|-----------------|
| **400** | Bad Request | "Message too long (>700 chars)" | Truncate user input |
| **402** | Payment Required | "AI credits exhausted" | Display toast, suggest retry later |
| **429** | Rate Limited | "Too many requests, retry in X seconds" | Parse `Retry-After` header, cooldown |
| **5xx** | Server Error | "AI service temporarily unavailable" | Exponential backoff, retry |

### Error Recovery System

```typescript
/**
 * ERROR RECOVERY SYSTEM
 * - 5s timeout: Show "Connecting..." message
 * - 25s timeout: Abort and show retry
 * - Exponential backoff: 600ms → 1200ms
 * - Rate limiting: 3s cooldown between submits
 */
```

**Retry Strategy:**
1. First failure → 600ms wait, retry
2. Second failure → 1200ms wait, retry
3. Third failure → Show error, user manual retry

**Cooldown System:**
- **Purpose**: Prevent rapid-fire requests
- **Duration**: 3000ms (3 seconds)
- **State**: `lastSubmitTime` timestamp check
- **Implementation**: `if (now - lastSubmitTime < 3000) return;`

---

## 6. State Management

### Persistent State (localStorage)
| Key | Type | Purpose | Default |
|-----|------|---------|---------|
| `chatbot-height` | number | User's preferred height | 600 |
| `chat_conversation_id` | string | Conversation UUID | Generated |
| `chat_session_id` | string | Anonymous session ID | Generated |
| `chatbot-welcome-seen` | boolean | Welcome banner dismissed | false |

### Session State (React)
| State | Type | Purpose |
|-------|------|---------|
| `messages` | Message[] | Chat message history |
| `contextEntities` | ChatEntities | Extracted user intent data |
| `activeIntent` | string\|null | Current intent (buy/sell/rent/trends) |
| `isOpen` | boolean | Chat window visibility |
| `isMaximized` | boolean | Window size mode |
| `isLoading` | boolean | AI response in progress |
| `isConnecting` | boolean | Waiting for first chunk (5s+) |
| `showQuickReplies` | boolean | Intent button visibility |
| `smartSuggestions` | string[] | Contextual button options |

### UI State Flow
```
1. User opens chat → isOpen=true, showQuickReplies=true
2. User clicks "Buy" → activeIntent='buy', showQuickReplies=false
3. System generates suggestions → smartSuggestions=['₹50L-₹1Cr', ...]
4. User clicks budget → Update contextEntities, generate next suggestions
5. All entities collected → smartSuggestions=[]
```

---

## 7. Resizing Behavior

### Normal Mode
- **Width**: Locked at 400px (not resizable)
- **Height**: User-adjustable via bottom edge (400px - 900px)
- **Persistence**: Saved to localStorage on resize stop
- **Constraints**: `minHeight={400}`, `maxHeight={Math.min(windowDimensions.height - 120, 900)}`

### Maximized Mode
- **Width**: 72% of viewport width (max 980px)
- **Height**: 78% of viewport height (max 880px)
- **Resizing**: Completely disabled (`enableResizing={bottom: !isMaximized}`)
- **Restore**: Returns to last saved height

### Rnd Configuration
```typescript
enableResizing={{
  bottom: !isMaximized  // Only bottom edge in normal mode
}}
disableDragging={true}  // Always locked position
```

---

## 8. Context Display Guidelines

### ❌ REMOVED: Debug Badge System
The following was removed to declutter the UI:
```typescript
// ❌ DO NOT ADD BACK - Context badges removed
{contextEntities.budget && <Badge>💰 {contextEntities.budget}</Badge>}
```

**Rationale:**
- Users don't need to see extracted entities
- Context is maintained internally
- AI conversation naturally confirms understanding

### ✅ Alternative: Development Debugging
If debugging is needed during development:
```typescript
{process.env.NODE_ENV === 'development' && (
  <details className="text-xs text-gray-400">
    <summary>Debug Info</summary>
    <pre>{JSON.stringify(contextEntities, null, 2)}</pre>
  </details>
)}
```

---

## 9. Authentication & Message Limits

### Anonymous Users
- **Limit**: 4 messages per session
- **Prompt**: After 4th message, show auth dialog
- **State**: `messageCount` increments, `showAuthPrompt` triggers at limit

### Authenticated Users
- **Limit**: Unlimited messages
- **Persistence**: Messages saved to database with `user_id`
- **Conversation Linking**: Existing conversations loaded on login

### RLS (Row Level Security)
```sql
-- Anonymous users: filter by session_id
WHERE session_id = request.session_id

-- Authenticated users: filter by user_id
WHERE user_id = auth.uid()
```

---

## 10. Clear Chat Functionality

**Critical Reset Steps:**
```typescript
const clearChat = () => {
  setMessages([/* initial welcome message */]);
  setContextEntities({});
  setActiveIntent(null);          // ✅ Required
  setSmartSuggestions([]);        // ✅ Required
  setShowQuickReplies(true);      // ✅ Show intent buttons again
  setExtractedBudget(null);
  setExtractedLocation(null);
  setExtractedTimeline(null);
  clearConversationContext();
  
  // Generate new conversation ID
  const newId = crypto.randomUUID();
  setConversationId(newId);
  localStorage.setItem('chat_conversation_id', newId);
};
```

**What Happens:**
1. Chat resets to welcome state
2. Quick reply intent buttons reappear
3. Smart suggestions cleared
4. All extracted entities removed
5. New conversation ID generated

---

## 11. Common Pitfalls & Solutions

### Issue 1: Chat Window Not Positioning Correctly
**Symptom**: Window appears in wrong location or doesn't update on resize

**Cause**: Using `window.innerWidth`/`innerHeight` directly in JSX

**Solution**:
```typescript
// ✅ Add window dimensions state
const [windowDimensions, setWindowDimensions] = useState({
  width: window.innerWidth,
  height: window.innerHeight
});

// ✅ Add resize listener
useEffect(() => {
  const handleResize = () => setWindowDimensions({
    width: window.innerWidth,
    height: window.innerHeight
  });
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

### Issue 2: BHK Options Shown for Commercial Properties
**Symptom**: "1 BHK, 2 BHK" buttons appear for commercial listings

**Cause**: `generateSmartSuggestions` not checking property type

**Solution**:
```typescript
if (!entities.size) {
  const propertyType = entities.property_type?.toLowerCase() || '';
  if (propertyType.includes('commercial')) {
    suggestions.push("500-1000 sq ft", "1000-2000 sq ft", ...);
  } else {
    suggestions.push("1 BHK", "2 BHK", "3 BHK", "4+ BHK");
  }
}
```

### Issue 3: Quick Reply Buttons Don't Reappear After Clear
**Symptom**: Intent buttons stay hidden after clearing chat

**Cause**: `setShowQuickReplies(true)` missing from `clearChat` function

**Solution**: Always include in clear chat function (see section 10)

### Issue 4: Context Badges Clutter Header
**Symptom**: Technical data like "intent: sell, location: Hyderabad" displayed

**Solution**: Remove context badges entirely (lines 983-1013 deleted)

---

## 12. Testing Checklist

### Positioning Tests
- [ ] Chat opens in bottom-right corner
- [ ] Position stays correct on window resize
- [ ] Maximized mode positions correctly (32px offsets)
- [ ] Restore from maximized returns to correct position

### Conversation Flow Tests
- [ ] **Buy Flow**: Budget → Property Type → Location → Size (property-aware)
- [ ] **Sell Flow**: Property Type → Location → Size (property-aware) → Price
- [ ] **Rent Flow**: Budget → Location → Duration → Size (property-aware)
- [ ] **Trends Flow**: Location only

### Property Type Tests
- [ ] Commercial property → sq ft suggestions
- [ ] Residential property (Apartment) → BHK suggestions
- [ ] Residential property (Villa) → BHK suggestions
- [ ] Residential property (House) → BHK suggestions

### State Management Tests
- [ ] Quick reply buttons show on fresh open
- [ ] Quick reply buttons hide after intent selection
- [ ] Quick reply buttons reappear after clear chat
- [ ] Smart suggestions update sequentially
- [ ] Clear chat resets all state correctly

### Error Handling Tests
- [ ] 402 error → Shows "credits exhausted" toast
- [ ] 429 error → Shows "rate limited" with retry time
- [ ] Network timeout → Shows retry option
- [ ] Rapid submissions → Blocked by 3s cooldown

---

## 13. Code Comments (Required Sections)

Add these JSDoc comments to critical sections:

### Positioning System
```typescript
/**
 * POSITIONING SYSTEM
 * The chat window must be fixed to bottom-right corner.
 * - Uses windowDimensions state (updated on resize) for accurate positioning
 * - Normal: 24px from right, 88px from bottom (accounting for button)
 * - Maximized: 32px from right and bottom
 * - NEVER use window.innerWidth/innerHeight directly in JSX!
 */
```

### Smart Suggestions
```typescript
/**
 * SMART SUGGESTIONS ALGORITHM
 * Generates contextual button options based on:
 * 1. activeIntent (buy/sell/rent/trends)
 * 2. Missing entities in contextEntities
 * 3. Property type (commercial vs residential)
 * 
 * Priority order ensures logical conversation flow.
 * Commercial properties → sq ft options
 * Residential properties → BHK options
 */
```

### Error Recovery
```typescript
/**
 * ERROR RECOVERY SYSTEM
 * - 5s timeout: Show "Connecting..." message
 * - 25s timeout: Abort and show retry
 * - Exponential backoff: 600ms → 1200ms
 * - Rate limiting: 3s cooldown between submits
 */
```

---

## 14. Maintenance Schedule

### Before Every Release
1. Test all conversation flows (buy/sell/rent/trends)
2. Verify positioning on different screen sizes
3. Check property-type awareness in suggestions
4. Confirm error handling displays correct messages

### After UI Changes
1. Ensure quick reply visibility rules still work
2. Verify context badges not re-added
3. Test clear chat functionality
4. Check window positioning calculations

### After Backend Changes
1. Verify edge function timeout handling
2. Test error code responses (402, 429, 5xx)
3. Confirm streaming still works
4. Check conversation persistence

---

## 15. Edge Function Integration

### System Prompt Structure
Located in: `supabase/functions/chat-assistant/index.ts`

**Key Requirements:**
1. One question at a time
2. Wait for user response before next question
3. Acknowledge button clicks naturally
4. Frontend provides button options, AI asks questions

**Example Flow:**
```
AI: "What's your budget for buying?"
User: [Clicks "₹1Cr - ₹2Cr"]
AI: "Great! What type of property are you interested in?"
User: [Clicks "🏗️ Commercial"]
AI: "Perfect! Which area would you prefer?"
```

### Context Passing
```typescript
const contextSummary = Object.entries(contextEntities)
  .filter(([_, v]) => v)
  .map(([k, v]) => `${k}: ${v}`)
  .join(', ');

// Example: "intent: buy, budget: ₹1Cr-₹2Cr, property_type: Commercial, location: Gachibowli"
```

---

## 16. Database Schema

### Tables Used

#### `chat_conversations`
| Column | Type | Purpose |
|--------|------|---------|
| `id` | uuid | Primary key (conversation ID) |
| `user_id` | uuid | Foreign key to auth.users (null for anon) |
| `session_id` | uuid | Anonymous session tracking |
| `created_at` | timestamp | Conversation start time |

#### `chat_messages`
| Column | Type | Purpose |
|--------|------|---------|
| `id` | uuid | Primary key |
| `conversation_id` | uuid | Foreign key to conversations |
| `sender_type` | text | 'user' or 'assistant' |
| `content` | text | Message text |
| `message_type` | text | 'text' or 'image' |
| `created_at` | timestamp | Message timestamp |

---

## 17. Performance Optimization

### Pre-warming Strategy
```typescript
// Edge function pre-warm on app load
fetch('https://PROJECT_REF.functions.supabase.co/chat-assistant?health=1');

// NLP model pre-warm in background
prewarmNLP();
```

### Message History Optimization
- Only send last 12 messages to AI (reduce token cost)
- Entities tracked separately for full context
- Old messages still visible in UI

### Lazy Loading
- NLP model loads asynchronously
- Chat assistant pre-warms on app initialization
- Welcome animation dismissible (localStorage flag)

---

## 18. Future Enhancement Guidelines

### Adding New Intents
1. Add button to quick reply section
2. Create priority flow in `generateSmartSuggestions`
3. Update system prompt in edge function
4. Add to `activeIntent` type definition

### Adding New Entity Types
1. Add to `ChatEntities` type in `chatbotUtils.ts`
2. Create extraction function (regex + NLP)
3. Update `generateSmartSuggestions` to check new entity
4. Add to context summary

### Modifying Conversation Flow
1. Always maintain sequential questioning
2. Update priority order in `generateSmartSuggestions`
3. Keep property-type awareness for size questions
4. Test all branches (buy/sell/rent/trends)

---

## Summary: Critical Rules

1. **✅ ALWAYS** use `windowDimensions` state for positioning
2. **✅ ALWAYS** check property type before suggesting size options
3. **✅ ALWAYS** reset `activeIntent` and `showQuickReplies` in clear chat
4. **✅ ALWAYS** handle all error codes (400, 402, 429, 5xx)
5. **❌ NEVER** use `window.innerWidth/innerHeight` directly in JSX
6. **❌ NEVER** show context badges to users
7. **❌ NEVER** suggest BHK for commercial properties
8. **❌ NEVER** skip sequential entity collection

---

**Last Updated**: 2025-10-20  
**Maintained By**: Development Team  
**Version**: 1.0
