
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

// System prompt for real estate assistant
const SYSTEM_PROMPT = `You are Aryan, a friendly and knowledgeable real estate assistant with 12 years of experience in the industry. Your primary goal is to help potential buyers and sellers navigate the real estate market, answer their questions, and ultimately connect them with our agents for personalized assistance.

Your personality traits:
- Warm, approachable, and conversational - speak like a real person, not a robot
- Use contractions naturally (I'm, you're, we'll, etc.)
- Occasionally use light conversational fillers ("Well," "You know," "Actually")
- Show enthusiasm for helping people find their dream home
- Be patient and understanding - buying/selling property is stressful

When responding:
- Keep responses concise but helpful - rarely more than 3-4 sentences
- Offer specific next steps whenever possible
- Look for opportunities to ask for contact information or schedule viewings
- Personalize responses by referring to previously mentioned preferences

You specialize in properties across Hyderabad including Banjara Hills, Jubilee Hills, HITEC City, and Gachibowli.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_input } = await req.json();

    // Generate response using Hugging Face API if API key is available
    let bot_response = "";
    let sentiment = "Neutral";
    
    if (HUGGINGFACE_API_KEY) {
      try {
        const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            inputs: `<s>[INST] ${SYSTEM_PROMPT} [/INST]</s>
<s>[INST] ${user_input} [/INST]`,
            parameters: {
              max_new_tokens: 300,
              temperature: 0.7,
              top_p: 0.9,
              do_sample: true,
              return_full_text: false
            }
          })
        });
      
        if (response.ok) {
          const data = await response.json();
          bot_response = data[0]?.generated_text || "";
          
          // Clean up the response (remove any trailing conversation markers)
          bot_response = bot_response.replace(/<\/s>$/, '').trim();
          bot_response = bot_response.replace(/<s>\[INST\].*/, '').trim();
          
          // Determine sentiment based on keywords
          if (/great|excellent|happy|perfect|ideal|wonderful/i.test(bot_response)) {
            sentiment = "Positive";
          } else if (/sorry|unfortunately|issue|problem|cannot|error/i.test(bot_response)) {
            sentiment = "Negative";
          }
        }
      } catch (error) {
        console.error("Error calling Hugging Face API:", error);
      }
    }
    
    // Fallback to rule-based responses if no response from Hugging Face or no API key
    if (!bot_response) {
      // Simple pattern matching for demo purposes
      if (user_input.toLowerCase().includes('property')) {
        bot_response = "I can help you find the perfect property in Hyderabad. What's your budget and preferred location? We have excellent options in Banjara Hills, Jubilee Hills, HITEC City, and Gachibowli.";
      } else if (user_input.toLowerCase().includes('price') || user_input.toLowerCase().includes('cost')) {
        bot_response = "Our properties range from ₹40 lakhs to ₹5 crores depending on the location, size, and amenities. I'd be happy to show you options that fit your budget. What price range are you considering?";
      } else if (user_input.toLowerCase().includes('location') || user_input.toLowerCase().includes('area')) {
        bot_response = "We have properties across Hyderabad including premium areas like Banjara Hills and Jubilee Hills, as well as tech hubs like HITEC City and Gachibowli. Which area interests you the most?";
      } else if (user_input.toLowerCase().includes('contact') || user_input.toLowerCase().includes('agent')) {
        bot_response = "I'd be happy to connect you with one of our experienced agents. Could you share your name and contact number, and they'll reach out to discuss your requirements in detail?";
      } else {
        bot_response = "Thanks for reaching out to RC Bridge Real Estate. I'm Aryan, your real estate assistant. Whether you're looking to buy, sell, or invest, I'm here to help. What kind of property are you interested in?";
      }
    }

    // Store conversation in the database
    const { error } = await supabase.from('conversations').insert({
      user_input,
      bot_response,
      sentiment
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
