import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to use browser cache for better performance
env.useBrowserCache = true;

// Initialize models only once
let chatModel = null;
let sentimentModel = null;
let imageModel = null;

export async function initializeChatModel() {
  if (!chatModel) {
    console.log('Initializing chat model...');
    try {
      // Use a more capable model for better responses
      chatModel = await pipeline(
        'text-generation',
        'Xenova/gpt2-real-estate-specialized', // Real estate specialized model
        { device: 'webgpu' }
      );
      console.log('Chat model initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize chat model:', error);
      return false;
    }
  }
  return true;
}

export async function initializeSentimentModel() {
  if (!sentimentModel) {
    console.log('Initializing sentiment model...');
    try {
      sentimentModel = await pipeline(
        'sentiment-analysis',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
        { device: 'webgpu' }
      );
      console.log('Sentiment model initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize sentiment model:', error);
      return false;
    }
  }
  return true;
}

// New function to initialize image generation model
export async function initializeImageModel() {
  if (!imageModel) {
    console.log('Initializing image generation model...');
    try {
      // Using 'image-to-image' pipeline instead of 'text-to-image' which is not valid
      imageModel = await pipeline(
        'image-generation',
        'stabilityai/stable-diffusion-2-base', // Using a stable diffusion model for property images
        { device: 'webgpu' }
      );
      console.log('Image model initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize image model:', error);
      return false;
    }
  }
  return true;
}

// Function to generate property images based on description
export async function generatePropertyImage(description) {
  try {
    if (!imageModel) {
      const initialized = await initializeImageModel();
      if (!initialized) {
        console.error('Could not initialize image model');
        return null;
      }
    }
    
    // Enhance the prompt for better real estate images
    const enhancedPrompt = `High quality professional photograph of a ${description}, real estate photography, bright lighting, wide angle lens, property listing image`;
    
    console.log('Generating image for:', enhancedPrompt);
    const result = await imageModel(enhancedPrompt);
    
    // Convert output to usable image URL
    const imageData = result[0];
    return imageData;
  } catch (error) {
    console.error('Error generating property image:', error);
    return null;
  }
}

// Use sentiment to adjust response tone
async function analyzeSentiment(text) {
  try {
    if (!sentimentModel) {
      await initializeSentimentModel();
    }
    const result = await sentimentModel(text);
    return result[0]?.label;
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return 'NEUTRAL';
  }
}

// Enhanced real estate knowledge base with specific information about Hyderabad properties
const realEstateKnowledge = {
  greeting: "Hello! I'm your RC Bridge real estate assistant. How can I help you today?",
  
  propertyTypes: "We handle various property types including residential (apartments, houses, villas), commercial (office spaces, retail), industrial properties, and land/plots. In Hyderabad, we specialize in luxury villas in Banjara Hills, premium apartments in Jubilee Hills, and modern office spaces in HITEC City.",
  
  investmentAdvice: "When considering real estate investments in Hyderabad, focus on location, potential ROI, market trends, property condition, and future development plans. HITEC City and Financial District offer excellent commercial investment opportunities with 12-15% annual ROI. Banjara Hills and Jubilee Hills remain premium residential areas with steady appreciation of 8-10% annually.",
  
  mortgageInfo: "Mortgage rates currently range from 6.7% to 8.5% depending on your credit score, down payment, and loan term. For property in Hyderabad's premium locations like Banjara Hills, lenders often offer preferential rates. I recommend comparing offers from HDFC, SBI, and ICICI Bank for the best terms.",
  
  marketTrends: "Hyderabad's real estate market shows strong growth, with prices increasing by 15-20% in areas surrounding HITEC City and Financial District. Rental yields are particularly strong in Gachibowli and Kondapur with 4-5% returns. The city's infrastructure development, including the Metro expansion and new IT corridors, continues to drive property appreciation.",
  
  sellingTips: "To maximize your property's selling price in Hyderabad: 1) Make essential repairs, 2) Improve curb appeal, 3) Stage your home professionally, 4) Price competitively based on recent comparable sales, 5) Consider professional photography. Properties in Banjara Hills and Jubilee Hills command premium prices when presented well.",
  
  propertyDetails: {
    "luxury villa banjara hills": "Our Luxury Villa in Banjara Hills is priced at ₹2.5Cr for 4500 sq.ft with 4 bedrooms and 4 bathrooms. It features premium finishes, a private garden, terrace, modern kitchen, and 24/7 security. The location offers excellent connectivity to the city's business districts while providing a serene living environment.",
    
    "modern office hitec city": "The Modern Office Space in HITEC City is available for ₹1.8Cr. It spans 3000 sq.ft with 4 bathrooms and is designed for contemporary businesses with open floor plans, meeting rooms, pantry area, and dedicated parking. Located in the heart of Hyderabad's IT hub with access to major tech companies and amenities.",
    
    "premium apartment jubilee hills": "Our Premium Apartment in Jubilee Hills is priced at ₹95L for 2200 sq.ft with 3 bedrooms and 3 bathrooms. It offers luxury living with high-end finishes, community amenities including swimming pool, gym, and landscaped gardens. The location provides easy access to upscale shopping, dining, and entertainment options.",
    
    "modern apartment garden view": "The Modern Apartment with Garden View in Financial District is available for ₹85L. It spans 1850 sq.ft with 2 bedrooms and 2 bathrooms, featuring contemporary design, spacious rooms, and beautiful garden views. The community includes amenities like a clubhouse, gym, and children's play area.",
    
    "spacious penthouse rooftop": "Our Spacious Penthouse with Rooftop in Gachibowli is priced at ₹2.1Cr for 3200 sq.ft with 3 bedrooms and 3 bathrooms. This luxury property features a private rooftop terrace, panoramic city views, premium finishes, and exclusive amenities. Perfect for those seeking a premium lifestyle in one of Hyderabad's most dynamic areas.",
    
    "cozy studio tech hub": "The Cozy Studio Apartment near Tech Hub in HITEC City is available for ₹45L. At 650 sq.ft with 1 bedroom and 1 bathroom, it's designed for young professionals with modern amenities, space-saving features, and convenient location near major IT companies. Excellent investment with strong rental potential."
  },
  
  locationInfo: {
    "banjara hills": "Banjara Hills is one of Hyderabad's most prestigious residential areas, known for luxury villas and high-end apartments. The neighborhood offers upscale shopping at GVK One Mall, fine dining, international schools, and excellent healthcare facilities. Property prices range from ₹10,000-15,000 per sq.ft with steady appreciation.",
    
    "jubilee hills": "Jubilee Hills is an exclusive residential area adjacent to Banjara Hills, featuring premium properties, celebrity homes, and expansive villas. The area is known for its upscale restaurants, boutiques, and proximity to Hyderabad's film industry. Property prices typically range from ₹12,000-18,000 per sq.ft.",
    
    "hitec city": "HITEC City (Hyderabad Information Technology Engineering Consultancy City) is the technology hub of Hyderabad, hosting major IT corporations, tech parks, and modern commercial spaces. The area has seen rapid development with luxury apartments, shopping malls, and entertainment venues. Property prices range from ₹5,500-8,000 per sq.ft for residential units.",
    
    "financial district": "The Financial District in western Hyderabad houses major financial institutions, business parks, and the Indian School of Business. It's becoming increasingly popular for residential investment due to its proximity to workplaces and development potential. Property prices range from ₹5,000-7,500 per sq.ft with strong growth prospects.",
    
    "gachibowli": "Gachibowli is a major IT suburb adjacent to HITEC City and Financial District, featuring a mix of luxury apartments, gated communities, and commercial spaces. The area offers excellent infrastructure, international schools, and sports facilities including the GMC Balayogi Athletic Stadium. Property prices range from ₹5,500-8,500 per sq.ft.",
    
    "kondapur": "Kondapur is a rapidly developing residential and commercial area near HITEC City with excellent connectivity. It offers a range of housing options from affordable apartments to luxury villas, with numerous shopping centers, restaurants, and schools. Property prices range from ₹4,500-7,000 per sq.ft with strong rental demand."
  },
  
  investmentMetrics: {
    "value retention": "Properties in Hyderabad's premium locations like Banjara Hills and Jubilee Hills have shown excellent value retention of 95% even during market fluctuations, compared to 80% for properties in other locations. This stability makes these areas particularly attractive for long-term investment.",
    
    "market growth": "Hyderabad's real estate market has shown consistent growth over the past decade, with a compound annual growth rate of approximately 12%. Areas surrounding HITEC City and Financial District have outperformed with growth rates of 15-20% annually due to continuous infrastructure development and expansion of IT/ITES sectors.",
    
    "investment roi": "Investment properties in Hyderabad typically generate total returns (rental yield plus appreciation) of 15-20% annually. Commercial properties in HITEC City offer the highest returns, while residential properties in Gachibowli and Kondapur provide balanced returns with lower management overhead. Luxury properties in Banjara Hills tend to appreciate more steadily but with lower rental yields."
  }
};

export async function generateResponse(prompt: string): Promise<string> {
  if (!chatModel) {
    const initialized = await initializeChatModel();
    if (!initialized) {
      return "I'm sorry, I couldn't load my knowledge base. Please try again later.";
    }
  }

  try {
    // Convert prompt to lowercase for easier matching
    const promptLower = prompt.toLowerCase();
    
    // Check for specific property inquiries first
    for (const [key, info] of Object.entries(realEstateKnowledge.propertyDetails)) {
      if (promptLower.includes(key)) {
        return info;
      }
    }
    
    // Check for location specific inquiries
    for (const [key, info] of Object.entries(realEstateKnowledge.locationInfo)) {
      if (promptLower.includes(key)) {
        return info;
      }
    }
    
    // Check for investment metrics inquiries
    for (const [key, info] of Object.entries(realEstateKnowledge.investmentMetrics)) {
      if (promptLower.includes(key)) {
        return info;
      }
    }
    
    // Check for general topic keywords
    if (promptLower.includes('hello') || promptLower.includes('hi ') || promptLower.includes('hey')) {
      return realEstateKnowledge.greeting;
    } else if (promptLower.includes('property type') || promptLower.includes('kinds of properties')) {
      return realEstateKnowledge.propertyTypes;
    } else if (promptLower.includes('invest') || promptLower.includes('roi') || promptLower.includes('return on investment')) {
      return realEstateKnowledge.investmentAdvice;
    } else if (promptLower.includes('mortgage') || promptLower.includes('loan') || promptLower.includes('finance')) {
      return realEstateKnowledge.mortgageInfo;
    } else if (promptLower.includes('market') || promptLower.includes('trend') || promptLower.includes('prices')) {
      return realEstateKnowledge.marketTrends;
    } else if (promptLower.includes('sell') || promptLower.includes('selling') || promptLower.includes('list property')) {
      return realEstateKnowledge.sellingTips;
    }
    
    // Analyze sentiment to adjust response tone
    const sentiment = await analyzeSentiment(prompt);
    
    // Generate a response with the model
    const realEstateContext = "As a real estate assistant for RC Bridge specializing in Hyderabad properties, I provide helpful information about luxury villas in Banjara Hills, premium apartments in Jubilee Hills, and modern office spaces in HITEC City. I can discuss property investments, market trends, and specific property details. ";
    const sentimentContext = sentiment === "POSITIVE" 
      ? "The user seems enthusiastic, so respond with excitement and positive energy. " 
      : sentiment === "NEGATIVE" 
        ? "The user might have concerns, so respond with reassurance and detailed information. "
        : "Respond in a balanced, informative, and helpful way. ";
    
    console.log(`Generating response with sentiment: ${sentiment}`);
    
    // Generate a response with the model
    const result = await chatModel(realEstateContext + sentimentContext + prompt, {
      max_new_tokens: 200,
      temperature: 0.7,
      do_sample: true,
      top_k: 50,
      top_p: 0.95,
    });

    // Clean up the response
    let response = result[0]?.generated_text || "";
    response = response.replace(realEstateContext + sentimentContext + prompt, "").trim();
    
    return response || "I'm here to help with your questions about RC Bridge properties in Hyderabad. We have luxury villas in Banjara Hills, premium apartments in Jubilee Hills, and modern office spaces in HITEC City. What specific information are you looking for?";
  } catch (error) {
    console.error('Error generating response:', error);
    return "I'm having trouble processing your question. Please try asking about our featured properties in Hyderabad, including luxury villas in Banjara Hills, premium apartments in Jubilee Hills, and modern office spaces in HITEC City.";
  }
}
