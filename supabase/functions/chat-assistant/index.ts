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
  })).min(1, 'At least one message required').max(20, 'Too many messages (max 20)')
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

CONVERSATION GUIDELINES:
- Be conversational and empathetic, like a knowledgeable friend
- Remember what was discussed in previous messages
- Don't repeat yourself or provide the same information twice
- Ask natural clarifying questions to understand user needs better
- Use the user's mentioned details (budget, location, timeline) in your responses
- Keep responses concise (2-3 short paragraphs max)
- When users show interest, guide them toward the inquiry form or property viewing

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

KEY LOCATIONS & PROPERTIES:
**Pocharam**: Excellent connectivity to IT hubs, affordable 2-3 BHK apartments (₹72 lakhs) and independent houses (₹1.2 Cr)
**Gachibowli**: Premium IT hub location, luxury apartments (₹1.45 Cr), close to Financial District
**Jubilee Hills**: Most prestigious area, luxury villas (₹4.85 Cr+) with premium amenities
**Banjara Hills**: Elite residential area, premium apartments (₹2.45 Cr) in gated communities
**HITEC City**: Commercial hub, modern office spaces (₹16.8 Cr), excellent connectivity
**Financial District**: New business hub, high rental demand, strong appreciation potential
**Kokapet & Tellapur**: Emerging high-potential investment zones

PRICING RANGES:
- Apartments in developing areas: ₹80 lakhs+
- Premium apartments in established areas: ₹1.5-2.5 Cr
- Independent houses: ₹1-2 Cr
- Luxury villas: ₹4.5 Cr+
- Commercial properties: ₹2 Cr+
- Agricultural land: ₹1.2 Cr per acre

FINANCING:
- Partner with leading banks offering home loans starting at 7.2% interest
- Investment properties can be financed up to 70% loan-to-value ratio
- Mortgage advisors available for structuring financing to optimize tax benefits

ZERO-BROKERAGE MODEL:
- No brokerage charges for buyers or sellers
- Only minimal subscription or service fees for advanced features/priority access
- Direct connection between buyers and sellers for transparency
- No public listings to preserve property value and exclusivity

EXAMPLE CONVERSATION FLOWS:

User: "Market trends"
You: "Hyderabad is one of India's fastest-growing real estate markets! Areas like Gachibowli, Financial District, and Kokapet show strong appreciation potential of 8-12% annually. The IT sector continues to drive demand. Are you looking to buy, sell, or invest?"

User: "buying a property"
You: "Excellent! I'd love to help you find the perfect property. To match you with the best options, could you share your budget range and which areas of Hyderabad interest you?"

User: "80 lakhs in 1 month"
You: "Perfect! Looking for properties around ₹80 lakhs with quick possession. Which area are you interested in - Pocharam, Miyapur, Gachibowli, or somewhere else in Hyderabad?"

User: "pocharam"
You: "Great choice! Pocharam has excellent connectivity to IT parks and good appreciation potential. In your budget range, we have:

1. Modern 2 BHK Apartment - ₹72 Lakhs (Gated community with amenities)
2. Independent 3 BHK House - ₹1.2 Cr (With garden space, close to IT hubs)

Would you like more details on either of these options?"

User: "Tell me more about the apartment"
You: "The 2 BHK apartment in Pocharam offers great value at ₹72 Lakhs. It's in a gated community with amenities like swimming pool, gym, and children's play area. The location provides easy access to major IT parks and has good schools and hospitals nearby.

Given your timeline of 1 month, this property can be moved into quickly. Would you like to schedule a viewing or speak with our property consultant for more details?"

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

    // Rate limiting based on IP address
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
               req.headers.get('x-real-ip') || 
               'unknown';
    
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
    
    const { messages } = validation.data;
    const recentMessages = messages.slice(-20);
    const HF_API_KEY = Deno.env.get('HUGGINGFACE_API_KEY');
    
    if (!HF_API_KEY) {
      console.error('HUGGINGFACE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Calling Hugging Face API with', messages.length, 'messages');

    // Retry logic with exponential backoff
    let retries = 3;
    let delay = 1000; // Start with 1 second delay
    let response: Response | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Call Hugging Face Router API with Llama 3.3 70B (OpenAI-compatible endpoint)
        response = await fetch(
          "https://router.huggingface.co/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${HF_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "meta-llama/Llama-3.3-70B-Instruct",
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...recentMessages
              ],
              max_tokens: 500,
              temperature: 0.7,
              stream: true,
            }),
          }
        );

        if (response.ok) {
          break; // Success, exit retry loop
        }

        const errorText = await response.text();
        console.error(`Hugging Face API error (attempt ${attempt}/${retries}):`, response.status, errorText);
        
        // Handle specific errors
        if (response.status === 429) {
          console.log(`Rate limit hit, retrying in ${delay}ms...`);
          if (attempt < retries) {
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
            continue;
          }
          return new Response(
            JSON.stringify({ 
              error: 'Our AI assistant is currently at capacity. Please try again in a few moments.',
              retryAfter: 60 
            }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        if (response.status === 401 || response.status === 403) {
          console.error('Authentication error with Hugging Face API');
          return new Response(
            JSON.stringify({ 
              error: 'AI service configuration error. Please contact support.',
              code: 'AUTH_ERROR'
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (response.status === 503) {
          console.log(`Model loading (attempt ${attempt}/${retries}), retrying in ${delay}ms...`);
          if (attempt < retries) {
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
            continue;
          }
          return new Response(
            JSON.stringify({ 
              error: 'AI model is currently loading. Please try again in 20-30 seconds.',
              code: 'MODEL_LOADING'
            }),
            { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Generic error after retries exhausted
        if (attempt === retries) {
          return new Response(
            JSON.stringify({ 
              error: 'AI service temporarily unavailable. Please try again later.',
              code: 'SERVICE_ERROR'
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

      } catch (fetchError) {
        console.error(`Network error (attempt ${attempt}/${retries}):`, fetchError);
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }
        throw fetchError;
      }
    }

    if (!response || !response.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to connect to AI service' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return streaming response
    return new Response(response.body, {
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
