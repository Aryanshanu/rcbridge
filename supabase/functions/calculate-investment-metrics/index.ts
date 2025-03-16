
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Updated market data based on actual Hyderabad and Indian city trends
const MARKET_DATA = {
  hyderabad: {
    residential: { appreciation: 9.2, rsi: 68 },
    commercial: { appreciation: 7.8, rsi: 62 },
    agricultural: { appreciation: 5.3, rsi: 55 },
    undeveloped: { appreciation: 11.5, rsi: 72 },
  },
  bangalore: {
    residential: { appreciation: 8.6, rsi: 65 },
    commercial: { appreciation: 8.2, rsi: 63 },
    agricultural: { appreciation: 4.8, rsi: 50 },
    undeveloped: { appreciation: 7.9, rsi: 68 },
  },
  mumbai: {
    residential: { appreciation: 6.5, rsi: 60 },
    commercial: { appreciation: 7.2, rsi: 65 },
    agricultural: { appreciation: 3.8, rsi: 45 },
    undeveloped: { appreciation: 5.4, rsi: 58 },
  },
  delhi: {
    residential: { appreciation: 5.8, rsi: 55 },
    commercial: { appreciation: 6.3, rsi: 60 },
    agricultural: { appreciation: 4.2, rsi: 48 },
    undeveloped: { appreciation: 5.1, rsi: 52 },
  },
  chennai: {
    residential: { appreciation: 6.2, rsi: 58 },
    commercial: { appreciation: 5.8, rsi: 56 },
    agricultural: { appreciation: 4.5, rsi: 50 },
    undeveloped: { appreciation: 5.3, rsi: 54 },
  },
};

// Time frame multipliers
const TIME_FRAME_MULTIPLIERS: Record<string, number> = {
  "1year": 1,
  "3years": 0.95, // Slightly reduced annual rate for longer time frames
  "5years": 0.9,
  "10years": 0.85,
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { propertyPrice, location, propertyType, timeframe } = await req.json();
    
    // Validate required parameters
    if (!location || !propertyType) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Get market data for the specified location and property type
    const marketData = MARKET_DATA[location]?.[propertyType];
    if (!marketData) {
      return new Response(
        JSON.stringify({ error: "Location or property type not supported" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Calculate price appreciation based on time frame
    const baseAppreciation = marketData.appreciation;
    const multiplier = TIME_FRAME_MULTIPLIERS[timeframe] || 1;
    const adjustedAppreciation = baseAppreciation * multiplier;

    // Apply location-specific factors - Hyderabad areas
    let priceAppreciation = adjustedAppreciation;
    
    // Area-specific adjustments for Hyderabad (assuming we would extract area from the request in a real app)
    if (location === 'hyderabad') {
      if (propertyPrice > 50000000) { // 5 crore+ (Jubilee Hills, Banjara Hills)
        priceAppreciation *= 1.1; // Premium areas appreciate faster
      } else if (propertyPrice > 20000000) { // 2 crore+ (Gachibowli, Financial District) 
        priceAppreciation *= 1.05; // Growing tech areas appreciate well
      } else if (propertyPrice < 5000000) { // Less than 50 lakh (Outer areas)
        priceAppreciation *= 0.9; // More affordable areas might appreciate slower
      }
    }
    
    // Apply property type specific modifiers for current market conditions
    if (propertyType === 'commercial' && location === 'hyderabad') {
      // Commercial property in IT corridors performing very well
      priceAppreciation *= 1.15;
    }

    // Return the calculated metrics
    return new Response(
      JSON.stringify({
        priceAppreciation,
        rsi: marketData.rsi
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
