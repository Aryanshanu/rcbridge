import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting for expensive AI reasoning
const rateLimits = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // requests per minute
const RATE_WINDOW = 60000; // 1 minute in ms

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, limit] of rateLimits.entries()) {
    if (now > limit.resetTime) {
      rateLimits.delete(ip);
    }
  }
}, RATE_WINDOW);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting check
  const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  const userLimit = rateLimits.get(clientIP);

  if (userLimit && now < userLimit.resetTime) {
    if (userLimit.count >= RATE_LIMIT) {
      console.log(`Rate limit exceeded for IP: ${clientIP} on ai-reasoning-k2`);
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please wait before making another reasoning request.' 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    userLimit.count++;
  } else {
    rateLimits.set(clientIP, { count: 1, resetTime: now + RATE_WINDOW });
  }

  try {
    const { query, context } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const huggingfaceApiKey = Deno.env.get('HUGGINGFACE_API_KEY');
    if (!huggingfaceApiKey) {
      return new Response(
        JSON.stringify({ error: 'Hugging Face API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`K2-Think reasoning for query: ${query}`);

    // Call Hugging Face Inference API for K2-Think model
    const response = await fetch(
      'https://api-inference.huggingface.co/models/LLM360/K2-Think',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingfaceApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `${context ? `Context: ${JSON.stringify(context)}\n\n` : ''}Question: ${query}\n\nProvide detailed reasoning and analysis:`,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.95,
            do_sample: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('K2-Think error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate reasoning', details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    const reasoning = result[0]?.generated_text || 'No reasoning generated';

    console.log('K2-Think reasoning completed successfully');

    // Log activity
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from('customer_activity_history').insert({
      activity_type: 'property_inquiry',
      activity_details: {
        action: 'ai_reasoning_generated',
        query: query,
        model: 'LLM360/K2-Think',
        reasoning_preview: reasoning.substring(0, 200),
      },
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        reasoning: reasoning,
        query: query,
        model: 'LLM360/K2-Think',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('AI reasoning error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
