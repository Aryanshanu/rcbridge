import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting for expensive image generation
const rateLimits = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3; // requests per minute (stricter for expensive Stable Diffusion)
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
      console.log(`Rate limit exceeded for IP: ${clientIP} on generate-image-stable`);
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please wait before generating another image.' 
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
    const { prompt, propertyId } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
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

    console.log(`Generating image with Stability AI for prompt: ${prompt}`);

    // Call Hugging Face Inference API for Stable Diffusion XL
    const response = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingfaceApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: 'blurry, low quality, distorted, ugly',
            num_inference_steps: 30,
            guidance_scale: 7.5,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Stability AI error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate image', details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Convert response to base64
    const imageBlob = await response.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const imageUrl = `data:image/png;base64,${base64}`;

    console.log(`Image generated successfully for property: ${propertyId || 'N/A'}`);

    // Log activity if propertyId provided
    if (propertyId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase.from('customer_activity_history').insert({
        activity_type: 'property_inquiry',
        activity_details: {
          action: 'ai_image_generated',
          property_id: propertyId,
          prompt: prompt,
          model: 'stabilityai/stable-diffusion-xl-base-1.0',
        },
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        image: imageUrl,
        prompt: prompt,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Image generation error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
