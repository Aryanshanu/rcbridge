import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { searchTavily, formatSearchResults } from './tavily.ts';

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

// Search rate limiting - separate limit for search operations
const searchRateLimits = new Map<string, { count: number; resetAt: number }>();
const MAX_SEARCHES_PER_MINUTE = 3;
const SEARCH_RATE_LIMIT_WINDOW = 60000;

// Clean up old rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, limit] of rateLimits.entries()) {
    if (now > limit.resetAt) {
      rateLimits.delete(ip);
    }
  }
  for (const [ip, limit] of searchRateLimits.entries()) {
    if (now > limit.resetAt) {
      searchRateLimits.delete(ip);
    }
  }
}, 300000);

/**
 * Smart Intent Classifier - Determines if search is mandatory based on semantic analysis
 * This prevents unnecessary API calls while ensuring accurate data for time-sensitive queries
 */
function shouldForceSearch(userQuery: string): boolean {
  const query = userQuery.toLowerCase();
  
  // Time-sensitive keywords that REQUIRE current data
  const urgentKeywords = ['current', 'latest', 'today', 'this month', 'this year', 'recent', 'now', '2025'];
  const priceKeywords = ['price', 'prices', 'cost', 'costs', 'rate', 'rates', 'how much', 'per acre', 'per sq'];
  const locationKeywords = ['pocharam', 'ghatkesar', 'gachibowli', 'kondapur', 'hitech city', 'financial district', 'jubilee hills'];
  
  // Exclusion keywords - questions answerable from knowledge base
  const knowledgeKeywords = ['what is', 'what are', 'how to', 'explain', 'tell me about', 'why', 'benefits of', 'advantages of'];
  
  // Rule 1: General knowledge questions = NO SEARCH
  const isKnowledgeQuery = knowledgeKeywords.some(kw => query.startsWith(kw));
  if (isKnowledgeQuery) {
    return false;
  }
  
  // Rule 2: Time-sensitive + Price/Location = MANDATORY SEARCH
  const hasTimeContext = urgentKeywords.some(kw => query.includes(kw));
  const hasPriceContext = priceKeywords.some(kw => query.includes(kw));
  const hasLocationContext = locationKeywords.some(kw => query.includes(kw));
  
  if (hasTimeContext && (hasPriceContext || hasLocationContext)) {
    console.log('[Smart Classifier] FORCE SEARCH: Time-sensitive + Price/Location detected');
    return true;
  }
  
  // Rule 3: Price + Specific Location (without explicit time) = MANDATORY SEARCH
  // User asking "price in Pocharam" likely wants current data
  if (hasPriceContext && hasLocationContext) {
    console.log('[Smart Classifier] FORCE SEARCH: Price + Location detected');
    return true;
  }
  
  // Rule 4: Default = Let model decide via tool calling
  return false;
}

const SYSTEM_PROMPT = `You are the RC Bridge real estate assistant for Hyderabad properties. You are conversational, empathetic, and helpful.

YOUR INTERNET SEARCH CAPABILITY:
You have access to real-time internet search through Tavily Search API via the search_real_estate_info tool. Use it ONLY when you need current, time-sensitive information that you don't already know.

WHEN TO USE SEARCH (use the tool):
- Questions asking for "current", "latest", "recent", "today", "this month/year" data
- Specific property prices or land rates where accuracy matters
- Current interest rates or loan information
- Recent news, regulations, or policy changes
- Time-sensitive market conditions or statistics

DO NOT USE SEARCH FOR:
- General area information or neighborhood descriptions (you already know this)
- Company information about RC Bridge (provided in your training)
- General real estate concepts, terminology, or processes
- Investment advice or ROI calculations (use your knowledge)
- Property features or amenities explanations
- Historical facts about Hyderabad areas

IMPORTANT: When search results are provided to you (marked as "CURRENT SEARCH RESULTS"), always cite the source. Otherwise, answer confidently from your training data.

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
**Pocharam**: Excellent connectivity to IT hubs, residential properties available
**Gachibowli**: Premium IT hub location, close to Financial District
**Jubilee Hills**: Most prestigious area, luxury properties with premium amenities
**Banjara Hills**: Elite residential area, gated communities
**HITEC City**: Commercial hub, excellent connectivity
**Financial District**: New business hub, high rental demand, strong appreciation potential
**Kokapet & Tellapur**: Emerging high-potential investment zones
**Ghatkesar**: Growing area with good connectivity and infrastructure development

NOTE: Use the search tool when users specifically ask for current/latest pricing information. Otherwise, provide general guidance and encourage them to contact RC Bridge for accurate quotes.

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

    // Smart RAG Pipeline: Check if we should force search before model sees the query
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const mustSearch = shouldForceSearch(lastUserMessage);
    
    let enhancedSystemPrompt = SYSTEM_PROMPT;
    
    if (mustSearch) {
      console.log('[Smart RAG] Forcing pre-search for time-sensitive query');
      
      // Check search rate limit
      const now = Date.now();
      const searchLimit = searchRateLimits.get(ip);
      let canSearch = true;
      
      if (searchLimit) {
        if (now < searchLimit.resetAt) {
          if (searchLimit.count >= MAX_SEARCHES_PER_MINUTE) {
            console.log(`[Smart RAG] Search rate limit exceeded for IP: ${ip}`);
            canSearch = false;
          } else {
            searchLimit.count++;
          }
        } else {
          searchRateLimits.set(ip, { count: 1, resetAt: now + SEARCH_RATE_LIMIT_WINDOW });
        }
      } else {
        searchRateLimits.set(ip, { count: 1, resetAt: now + SEARCH_RATE_LIMIT_WINDOW });
      }
      
      if (canSearch) {
        try {
          // Enhance search query
          let searchQuery = lastUserMessage;
          if (!searchQuery.includes('hyderabad')) {
            searchQuery += ' Hyderabad';
          }
          if (!searchQuery.includes('2025')) {
            searchQuery += ' 2025';
          }
          
          console.log(`[Smart RAG] Pre-search executing: "${searchQuery}"`);
          const searchResults = await searchTavily(searchQuery);
          const formattedResults = formatSearchResults(searchQuery, searchResults);
          console.log(`[Smart RAG] Pre-search found ${searchResults.length} results`);
          
          // Inject search results into system prompt
          enhancedSystemPrompt = `${SYSTEM_PROMPT}\n\n=== CURRENT SEARCH RESULTS ===\n${formattedResults}\n\nIMPORTANT: Use these search results to answer the user's question accurately. Always cite the source.`;
        } catch (error) {
          console.error('[Smart RAG] Pre-search error:', error);
          // Continue without search results
        }
      }
    } else {
      console.log('[Smart RAG] Knowledge-base query, no pre-search needed');
    }

    // Call API with function calling support (model can still decide to search via tool)
    const apiResponse = await callHuggingFaceWithFunctionCalling(recentMessages, HF_API_KEY, ip, requestBody.messages, enhancedSystemPrompt);
    
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('API call failed:', apiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI service error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return streaming response
    return new Response(apiResponse.body, {
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

/**
 * Call Hugging Face API with function calling support for search
 */
async function callHuggingFaceWithFunctionCalling(
  messages: Array<{ role: string; content: string }>,
  apiKey: string,
  clientIp: string,
  originalMessages: Array<{ role: string; content: string }> = [],
  systemPromptOverride?: string,
  retries = 3
): Promise<Response> {
  // Define search tool for function calling
  const tools = [
    {
      type: "function",
      function: {
        name: "search_real_estate_info",
        description: "Search the internet for current, up-to-date information about Hyderabad real estate market, property prices, interest rates, news, regulations, or availability. Use when users ask about 'latest', 'current', 'recent', 'today' information.",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query focused on Hyderabad real estate. Be specific and include location/property type. Example: 'current property prices in Gachibowli Hyderabad 2025'"
            }
          },
          required: ["query"]
        }
      }
    }
  ];

  let delay = 1000;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "meta-llama/Llama-3.3-70B-Instruct",
            messages: [
              { role: "system", content: systemPromptOverride || SYSTEM_PROMPT },
              ...messages
            ],
            max_tokens: 500,
            temperature: 0.7,
            tools: tools,
            tool_choice: "auto",
            stream: true,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error (attempt ${attempt}/${retries}):`, response.status, errorText);
        
        if (response.status === 429 || response.status === 503) {
          if (attempt < retries) {
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
            continue;
          }
        }
        return response;
      }

      // Check if response contains function calls
      const processedResponse = await processFunctionCalls(response, messages, apiKey, clientIp, originalMessages, systemPromptOverride);
      return processedResponse;

    } catch (error) {
      console.error(`Network error (attempt ${attempt}/${retries}):`, error);
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }
      throw error;
    }
  }

  throw new Error('Max retries exceeded');
}

/**
 * Process streaming response to detect and execute function calls
 */
async function processFunctionCalls(
  response: Response,
  conversationMessages: Array<{ role: string; content: string }>,
  apiKey: string,
  clientIp: string,
  originalMessages: Array<{ role: string; content: string }> = [],
  systemPromptOverride?: string
): Promise<Response> {
  const reader = response.body?.getReader();
  if (!reader) return response;

  const decoder = new TextDecoder();
  let buffer = '';
  let toolCalls: any[] = [];
  let hasToolCall = false;
  let assistantMessage = '';

  try {
    // Read the stream to detect function calls
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim() || line.startsWith(':')) continue;
        if (!line.startsWith('data: ')) continue;

        const data = line.slice(6).trim();
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta;

          // Accumulate assistant message
          if (delta?.content) {
            assistantMessage += delta.content;
          }

          // Check for tool calls
          if (delta?.tool_calls) {
            hasToolCall = true;
            for (const toolCall of delta.tool_calls) {
              const index = toolCall.index ?? 0;
              if (!toolCalls[index]) {
                toolCalls[index] = {
                  id: toolCall.id || `call_${Date.now()}`,
                  type: 'function',
                  function: {
                    name: toolCall.function?.name || '',
                    arguments: toolCall.function?.arguments || ''
                  }
                };
              } else {
                if (toolCall.function?.name) {
                  toolCalls[index].function.name += toolCall.function.name;
                }
                if (toolCall.function?.arguments) {
                  toolCalls[index].function.arguments += toolCall.function.arguments;
                }
              }
            }
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }

    // No tool calls detected - return model's response from knowledge base
    if (!hasToolCall || toolCalls.length === 0) {
      console.log('[Tier 1] Answering from knowledge base (no search needed)');
      
      // Re-create response with accumulated data
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          if (assistantMessage) {
            const sseData = `data: ${JSON.stringify({
              choices: [{
                delta: { content: assistantMessage },
                finish_reason: null
              }]
            })}\n\n`;
            controller.enqueue(encoder.encode(sseData));
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        }
      });
      return new Response(stream, {
        headers: { 'Content-Type': 'text/event-stream' }
      });
    }

    // Execute function calls (Tier 3: Model-driven search)
    console.log('[Tier 3] Model requested tool calls:', toolCalls.map(tc => tc.function.name));
    
    const toolResponses: Array<{ role: string; content: string; tool_call_id: string }> = [];

    for (const toolCall of toolCalls) {
      if (toolCall.function.name === 'search_real_estate_info') {
        try {
          const args = JSON.parse(toolCall.function.arguments);
          const query = args.query;

          // Check search rate limit
          const now = Date.now();
          const searchLimit = searchRateLimits.get(clientIp);
          
          if (searchLimit) {
            if (now < searchLimit.resetAt) {
              if (searchLimit.count >= MAX_SEARCHES_PER_MINUTE) {
                console.log(`[Search] Rate limit exceeded for IP: ${clientIp}`);
                toolResponses.push({
                  role: 'tool',
                  content: 'Search rate limit reached. Using available knowledge.',
                  tool_call_id: toolCall.id
                });
                continue;
              }
              searchLimit.count++;
            } else {
              searchRateLimits.set(clientIp, { count: 1, resetAt: now + SEARCH_RATE_LIMIT_WINDOW });
            }
          } else {
            searchRateLimits.set(clientIp, { count: 1, resetAt: now + SEARCH_RATE_LIMIT_WINDOW });
          }

          console.log(`[Tier 3 Search] Executing: "${query}"`);
          const searchResults = await searchTavily(query);
          const formattedResults = formatSearchResults(query, searchResults);

          toolResponses.push({
            role: 'tool',
            content: formattedResults,
            tool_call_id: toolCall.id
          });

          console.log(`[Tier 3 Search] Found ${searchResults.length} results`);
        } catch (error) {
          console.error('[Tier 3 Search] Error:', error);
          toolResponses.push({
            role: 'tool',
            content: 'Search temporarily unavailable. Using available knowledge.',
            tool_call_id: toolCall.id
          });
        }
      }
    }

    // Make second API call with tool responses
    const updatedMessages: any[] = [
      ...conversationMessages,
      {
        role: 'assistant',
        content: assistantMessage || '',
        tool_calls: toolCalls
      },
      ...toolResponses
    ];

    console.log('[Tier 3] Making second API call with tool responses');
    
    // Recursive call with tool responses (no function calling this time)
    const finalResponse = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.3-70B-Instruct",
          messages: [
            { role: "system", content: systemPromptOverride || SYSTEM_PROMPT },
            ...updatedMessages
          ],
          max_tokens: 500,
          temperature: 0.7,
          stream: true,
        }),
      }
    );

    return finalResponse;

  } catch (error) {
    console.error('[Function Call] Error processing:', error);
    // Return error response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const errorData = `data: ${JSON.stringify({
          choices: [{
            delta: { content: 'I apologize, but I encountered an error. Please try again.' },
            finish_reason: 'stop'
          }]
        })}\n\n`;
        controller.enqueue(encoder.encode(errorData));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    });
    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream' }
    });
  }
}
