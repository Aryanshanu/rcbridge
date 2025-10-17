import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema - require property-related keywords
const imagePromptSchema = z.object({
  prompt: z.string()
    .min(10, 'Prompt too short (min 10 characters)')
    .max(500, 'Prompt too long (max 500 characters)')
    .regex(
      /property|house|home|building|real estate|apartment|villa|residential|commercial|land|plot/i,
      'Prompt must be property-related (include words like property, house, apartment, etc.)'
    )
});

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
    // Check request size limit (10KB max for image generation)
    const contentLength = req.headers.get('content-length');
    if (contentLength) {
      const size = parseInt(contentLength);
      if (size > 10000) {
        console.log(`Payload too large: ${size} bytes from IP: ${clientIP}`);
        return new Response(
          JSON.stringify({ error: 'Request payload too large (max 10KB)' }),
          { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const requestBody = await req.json();
    
    // Comprehensive input validation with zod
    const validation = imagePromptSchema.safeParse(requestBody);
    if (!validation.success) {
      console.log(`Validation error from IP ${clientIP}:`, validation.error.format());
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request format',
          details: validation.error.issues[0].message
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { prompt } = validation.data;

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