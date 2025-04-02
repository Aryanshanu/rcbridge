
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const HUGGINGFACE_API_KEY = Deno.env.get('HUGGINGFACE_API_KEY');

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_input } = await req.json();

    // Basic response logic until HuggingFace integration
    let bot_response = "I'm your real estate assistant. How can I help you today?";
    
    // Simple pattern matching for demo purposes
    if (user_input.toLowerCase().includes('property')) {
      bot_response = "I can help you find the perfect property. What's your budget and preferred location?";
    } else if (user_input.toLowerCase().includes('price') || user_input.toLowerCase().includes('cost')) {
      bot_response = "Our properties range from ₹40 lakhs to ₹5 crores depending on the location, size, and amenities.";
    } else if (user_input.toLowerCase().includes('location') || user_input.toLowerCase().includes('area')) {
      bot_response = "We have properties across Hyderabad including Banjara Hills, Jubilee Hills, HITEC City, and Gachibowli.";
    }

    // Store conversation in the database
    const { error } = await supabase.from('conversations').insert({
      user_input,
      bot_response,
      sentiment: "Neutral"
    });

    if (error) {
      console.error("Error inserting conversation:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ bot_response }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error in chatbot function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
