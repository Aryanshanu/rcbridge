
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Market data approximations (would ideally come from a real database)
const MARKET_DATA = {
  hyderabad: {
    residential: { appreciation: 8.5, rsi: 62, ma: 'above' },
    commercial: { appreciation: 7.2, rsi: 55, ma: 'below' },
    agricultural: { appreciation: 4.5, rsi: 48, ma: 'below' },
    undeveloped: { appreciation: 6.8, rsi: 72, ma: 'above' },
  },
  bangalore: {
    residential: { appreciation: 9.8, rsi: 78, ma: 'above' },
    commercial: { appreciation: 8.5, rsi: 65, ma: 'above' },
    agricultural: { appreciation: 5.2, rsi: 45, ma: 'below' },
    undeveloped: { appreciation: 7.5, rsi: 68, ma: 'above' },
  },
  mumbai: {
    residential: { appreciation: 10.2, rsi: 75, ma: 'above' },
    commercial: { appreciation: 9.8, rsi: 80, ma: 'above' },
    agricultural: { appreciation: 4.0, rsi: 42, ma: 'below' },
    undeveloped: { appreciation: 8.5, rsi: 70, ma: 'above' },
  },
  delhi: {
    residential: { appreciation: 7.5, rsi: 60, ma: 'above' },
    commercial: { appreciation: 8.0, rsi: 68, ma: 'above' },
    agricultural: { appreciation: 5.5, rsi: 50, ma: 'neutral' },
    undeveloped: { appreciation: 6.0, rsi: 58, ma: 'below' },
  },
  chennai: {
    residential: { appreciation: 7.2, rsi: 65, ma: 'above' },
    commercial: { appreciation: 6.8, rsi: 62, ma: 'above' },
    agricultural: { appreciation: 4.8, rsi: 45, ma: 'below' },
    undeveloped: { appreciation: 5.5, rsi: 52, ma: 'below' },
  },
};

// Time frame multipliers
const TIME_FRAME_MULTIPLIERS: Record<string, number> = {
  "1year": 1,
  "3years": 0.9, // Slightly reduced annual rate for longer time frames
  "5years": 0.85,
  "10years": 0.8,
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

    // Apply some "market intelligence" based on property price
    // Expensive properties might appreciate differently than affordable ones
    let priceAppreciation = adjustedAppreciation;
    if (propertyPrice > 10000000) { // More than 1 crore
      priceAppreciation *= 0.9; // High-end properties might appreciate more slowly
    } else if (propertyPrice < 2500000) { // Less than 25 lakh
      priceAppreciation *= 1.1; // Affordable properties might appreciate faster
    }

    // Return the calculated metrics
    return new Response(
      JSON.stringify({
        priceAppreciation,
        rsi: marketData.rsi,
        maStatus: marketData.ma
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
