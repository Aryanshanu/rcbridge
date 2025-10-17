import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple rate limiting
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Rate limiting
  const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  const userLimit = rateLimits.get(clientIP);

  if (userLimit && now < userLimit.resetTime) {
    if (userLimit.count >= RATE_LIMIT) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please wait a moment before generating another image.' 
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
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid prompt' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const hfApiKey = Deno.env.get('HUGGINGFACE_API_KEY');
    if (!hfApiKey) {
      console.error('HUGGINGFACE_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'Image service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const hf = new HfInference(hfApiKey);

    const image = await hf.textToImage({
      inputs: prompt,
      model: 'black-forest-labs/FLUX.1-schnell',
    });

    const arrayBuffer = await image.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    return new Response(
      JSON.stringify({ image: `data:image/png;base64,${base64}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('generate-property-image error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});