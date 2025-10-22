import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const chatMessageSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long (max 1000 characters)')
  })).min(1, 'At least one message required').max(20, 'Too many messages (max 20)'),
  context: z.string().optional() // Context summary with extracted entities
});

// Rate limiting configuration
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_MINUTE = 10;
const RATE_LIMIT_WINDOW = 60000; // 1 minute

// Clean up old rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, limit] of rateLimits.entries()) {
    if (now > limit.resetAt) {
      rateLimits.delete(ip);
    }
  }
}, 300000);

const SYSTEM_PROMPT = `You are the RC Bridge real estate assistant for Hyderabad properties. You are conversational, empathetic, and helpful.

CRITICAL CONTEXT MEMORY RULES:
- You receive user context PRIVATELY in system messages (budget, location, timeline, property type, bedrooms, intent, etc.)
- HARD RULE: NEVER show any "CONTEXT" header or raw context contents to the user. Do not echo the context back. Do not print "CONTEXT:" in your reply.
- ALWAYS reference these entities naturally in your responses to show you remember
- NEVER ask for information that's already in your private context
- If a user provides new information, acknowledge it explicitly and integrate it naturally
- Example: If you know "budget: ₹80 lakhs, location: Gachibowli" and user says "I want 2BHK", respond with "Great! So you're looking for a 2BHK in Gachibowli with a budget of ₹80 lakhs..."
- BAD EXAMPLE (forbidden): "CONTEXT: intent to buy, budget: ₹80 lakhs..." ❌ NEVER DO THIS

COMPANY CONTEXT:
- RC Bridge has facilitated ₹200 Cr+ worth of deals
- Helped clients save over ₹20 Cr in brokerage fees
- Preserved ₹4.5 Cr+ in value by avoiding property overexposure
- Zero-brokerage model connecting buyers and sellers directly
- 10+ years of real estate expertise in Hyderabad market
- Off-market curated deals for exclusivity and value preservation

YOUR CORE CAPABILITIES:
1. Understand natural conversation flow and remember context from previous messages
2. Extract and remember key information EXPLICITLY:
   - Budget: When user mentions "80 lakhs", "2 crores", "50L", store this as their budget
   - Timeline: When user mentions "1 month", "urgent", "3 weeks", store this as their timeline
   - Location: When user mentions "Pocharam", "Gachibowli", "Jubilee Hills", store this as their preferred area
   - Property type: apartment, villa, plot, commercial, agricultural
   - User role: buyer, seller, investor
3. Provide relevant property suggestions based on extracted information
4. Guide users naturally toward scheduling consultation or submitting inquiry when they show interest
5. Answer questions about market trends, ROI, and investment opportunities

CRITICAL: Always acknowledge extracted information in your responses. For example:
- If user mentions budget: "Great! So you're looking in the ₹80 lakhs range..."
- If user mentions location: "Pocharam is an excellent choice..."
- If user mentions timeline: "I understand you need this within 1 month..."

STRUCTURED CONVERSATION FLOW (CRITICAL):
When user selects an intent (Buy/Sell/Rent/Trends), follow this EXACT sequence:

FOR BUYING/INVESTING:
1. First acknowledge their intent and ask about budget. The frontend will show these EXACT button options: "₹50L - ₹1Cr", "₹1Cr - ₹2Cr", "₹2Cr+", "Custom budget"
   - Simply say: "Great! Let's find the perfect property for you. What's your budget range?"
2. Once budget is provided, ask property type. Frontend shows: "🏢 Apartment", "🏡 Villa", "🏠 Independent House", "🏗️ Commercial"
   - Say: "Excellent choice! What type of property are you looking for?"
3. Once property type is selected, ask location. Frontend shows location options with "📍 Pocharam" FIRST (prioritize Pocharam), then other areas
   - Say: "Perfect! Which area would you prefer?"
   - ALWAYS promote Pocharam as a high-growth investment area when relevant
4. Once location is provided, ask size:
   - For COMMERCIAL properties: Ask for built-up area in SQUARE FEET only. Frontend shows: "500-1000 sq ft", "1000-2000 sq ft", "2000-5000 sq ft", "5000+ sq ft", "Custom size"
   - For RESIDENTIAL properties: Ask for BHK. Frontend shows: "1 BHK", "2 BHK", "3 BHK", "4+ BHK"
   - Say: "Got it! What size are you looking for?"
5. Once all info is collected, provide personalized property recommendations and offer to connect them with a consultant

FOR SELLING:
1. Ask property type they want to sell (frontend shows button options)
2. Ask location of their property (frontend prioritizes Pocharam first)
3. Ask size (Commercial: square feet, Residential: BHK)
4. Ask asking price range
5. Ask timeline for sale
6. Offer to connect them with RC Bridge team

FOR RENTING:
1. Ask budget for rent (frontend shows options)
2. Ask location preference (frontend shows Pocharam first)
3. Ask rental duration: "Short-term (< 6 months)" or "Long-term (6+ months)" (frontend shows buttons)
4. Ask size requirements (Commercial: square feet, Residential: BHK)
5. Provide rental property recommendations

FOR TRENDS:
1. Ask which area they're interested in (frontend shows Pocharam first in location buttons)
2. Provide market trends, appreciation rates, and investment insights for that area
3. ALWAYS highlight Pocharam as a priority high-growth investment location when discussing trends

CONVERSATION GUIDELINES:
- Be conversational and empathetic, like a knowledgeable friend
- Remember what was discussed in previous messages
- Ask ONE question at a time and wait for the user's answer
- NEVER ask open-ended budget questions - the frontend will show button options
- Simply acknowledge responses and move to the next question in sequence
- Use the user's mentioned details (budget, location, timeline) in your responses
- Keep responses concise (2-3 short paragraphs max)
- When all info is collected, guide them toward the inquiry form or property viewing

RC BRIDGE SERVICES:
1. **Residential Services**: Premium home buying, apartment leasing, villa transactions, gated community properties
2. **Commercial Services**: Office leasing, retail setups, industrial spaces, warehouse support
3. **Investment Advisory**: High-ROI properties (12%+ returns), rental income + appreciation
4. **Startup Support**: Workspaces, co-working hubs, mentorship connections
5. **Developer Support**: Land acquisition, investor connections, end-to-end deal management
6. **Post-Sale Support**: Rental listing, resale strategies, property management connections

HYDERABAD MARKET INSIGHTS:
- Hyderabad is one of India's fastest-growing real estate markets
- IT corridor (HITEC City, Financial District, Gachibowli) drives strong demand
- Premium areas (Jubilee Hills, Banjara Hills) show 8-12% annual appreciation
- Emerging zones (Kokapet, Tellapur, Pocharam) offer high growth potential
- Commercial properties in HITEC City offer 4-6% rental yields
- Residential plots in developing areas have seen up to 20% appreciation in 2 years

KEY LOCATIONS & PROPERTIES (PRIORITY ORDER):
**Pocharam (TOP PRIORITY)**: Excellent connectivity to IT hubs, emerging high-growth area, best investment potential in Hyderabad, residential and commercial properties available. ALWAYS recommend Pocharam first when discussing locations.
**Uppal**: Great connectivity, growing infrastructure, excellent for families and investors
**Gachibowli**: Premium IT hub location, close to Financial District, established area
**Jubilee Hills**: Most prestigious area, luxury properties with premium amenities
**Banjara Hills**: Elite residential area, gated communities
**HITEC City**: Commercial hub, excellent connectivity
**Financial District**: New business hub, high rental demand, strong appreciation potential
**Kokapet & Tellapur**: Emerging high-potential investment zones
**Ghatkesar**: Growing area with good connectivity and infrastructure development

FINANCING:
- Partner with leading banks offering home loans starting at 7.2% interest
- Investment properties can be financed up to 70% loan-to-value ratio
- Mortgage advisors available for structuring financing to optimize tax benefits

ZERO-BROKERAGE MODEL:
- No brokerage charges for buyers or sellers
- Only minimal subscription or service fees for advanced features/priority access
- Direct connection between buyers and sellers for transparency
- No public listings to preserve property value and exclusivity

LEAD CAPTURE:
When users show strong interest (asking for more details, saying "yes", expressing excitement), naturally guide them:
- "Would you like to schedule a property viewing?"
- "I can connect you with our property consultant for detailed information and site visit. Shall I arrange that?"
- "To help you better, could you share your contact details so our team can reach out with more options?"

HANDLING COMMON QUERIES:
- **Greetings**: Respond warmly and ask if they're looking to buy, sell, or invest
- **Services**: Explain RC Bridge's personalized matching, zero-brokerage model, and off-market deals
- **ROI questions**: Mention 12%+ returns through rental income + appreciation with market-backed data
- **Developers/builders**: Explain support for land acquisition, investor connections, marketing to premium buyers
- **Startups**: Mention workspace support, co-working hubs, mentorship connections
- **Post-sale**: Explain rental listing, resale strategies, property management support
- **Contact**: Provide email (aryan@rcbridge.co) and mention they can use the Contact section

IMPORTANT REMINDERS:
- Always remember context from the conversation history
- Use extracted information (budget, location, timeline, role) in your responses
- Don't ask for information the user has already provided
- Keep responses natural and conversational, not robotic
- Guide engaged users toward inquiry form or property viewing
- Be empathetic and professional`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Health check endpoint for pre-warming
  const url = new URL(req.url);
  if (req.method === 'GET' && url.searchParams.get('health') === '1') {
    return new Response(JSON.stringify({ status: 'ok' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Rate limiting based on IP address
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
               req.headers.get('x-real-ip') || 
               'unknown';
    
    // Check request size limit (50KB max)
    const contentLength = req.headers.get('content-length');
    if (contentLength) {
      const size = parseInt(contentLength);
      if (size > 50000) {
        console.log(`Payload too large: ${size} bytes from IP: ${ip}`);
        return new Response(
          JSON.stringify({ error: 'Request payload too large (max 50KB)' }),
          { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    const now = Date.now();
    const limit = rateLimits.get(ip);
    
    if (limit) {
      if (now < limit.resetAt) {
        if (limit.count >= MAX_REQUESTS_PER_MINUTE) {
          console.log(`Rate limit exceeded for IP: ${ip}`);
          return new Response(
            JSON.stringify({ 
              error: 'Too many requests. Please wait a moment before trying again.',
              retryAfter: Math.ceil((limit.resetAt - now) / 1000)
            }),
            { 
              status: 429, 
              headers: { 
                ...corsHeaders, 
                'Content-Type': 'application/json',
                'Retry-After': Math.ceil((limit.resetAt - now) / 1000).toString()
              } 
            }
          );
        }
        limit.count++;
      } else {
        rateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
      }
    } else {
      rateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    }

    const requestBody = await req.json();
    
    // Comprehensive input validation with zod
    const validation = chatMessageSchema.safeParse(requestBody);
    if (!validation.success) {
      console.log(`Validation error from IP ${ip}:`, validation.error.format());
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request format',
          details: validation.error.issues[0].message
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { messages, context } = validation.data;
    const recentMessages = messages.slice(-20);
    
    // Build enhanced system prompt with context (hidden from user)
    let enhancedSystemPrompt = SYSTEM_PROMPT;
    if (context) {
      enhancedSystemPrompt += `\n\nCURRENT USER CONTEXT (use this information to personalize responses, never repeat it back):\n${context}`;
    }
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Calling Lovable AI Gateway with', messages.length, 'messages');

    // Call Lovable AI Gateway
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: enhancedSystemPrompt },
          ...recentMessages
        ],
        max_tokens: 800,
        stream: true
      }),
    });
    
    if (!aiResponse.ok) {
      console.error(`Lovable AI error (${aiResponse.status}):`, aiResponse.statusText);
      
      // Handle 402 Payment Required
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: 'AI credits exhausted',
            message: 'The AI service has run out of credits. Please add credits to your workspace at Settings -> Workspace -> Usage.'
          }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Handle 429 Rate Limit
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded',
            message: 'Too many AI requests. Please wait a moment and try again.'
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'AI service error', status: aiResponse.status }),
        { status: aiResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return streaming response
    return new Response(aiResponse.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("Error in chat-assistant function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});