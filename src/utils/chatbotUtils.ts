
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to use browser cache for better performance
env.useBrowserCache = true;

// Initialize models only once
let chatModel = null;
let sentimentModel = null;

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

// Real estate specific knowledge base
const realEstateKnowledge = {
  greeting: "Hello! I'm your RC Bridge real estate assistant. How can I help you today?",
  propertyTypes: "We handle various property types including residential (apartments, houses, villas), commercial (office spaces, retail), industrial properties, and land/plots.",
  investmentAdvice: "When considering real estate investments, focus on location, potential ROI, market trends, property condition, and future development plans in the area.",
  mortgageInfo: "Mortgage rates currently range from 3.5% to 5.2% depending on your credit score, down payment, and loan term. I recommend comparing offers from multiple lenders.",
  marketTrends: "The current market shows increasing demand in suburban areas, with urban property prices stabilizing after the pandemic shift. Rental yields are particularly strong in developing neighborhoods with good transport links.",
  sellingTips: "To maximize your property's selling price: 1) Make essential repairs, 2) Improve curb appeal, 3) Stage your home professionally, 4) Price competitively based on recent comparable sales, 5) Consider professional photography."
};

export async function generateResponse(prompt: string): Promise<string> {
  if (!chatModel) {
    const initialized = await initializeChatModel();
    if (!initialized) {
      return "I'm sorry, I couldn't load my knowledge base. Please try again later.";
    }
  }

  try {
    // Check for keywords to provide faster, more accurate responses from knowledge base
    const promptLower = prompt.toLowerCase();
    
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
    const realEstateContext = "As a real estate assistant, I provide helpful information about properties, investments, and market trends. ";
    const sentimentContext = sentiment === "POSITIVE" 
      ? "The user seems happy, so respond enthusiastically. " 
      : sentiment === "NEGATIVE" 
        ? "The user might be concerned, so respond reassuringly. "
        : "Respond in a balanced, informative way. ";
    
    console.log(`Generating response with sentiment: ${sentiment}`);
    
    // Generate a response with the model
    const result = await chatModel(realEstateContext + sentimentContext + prompt, {
      max_new_tokens: 150,
      temperature: 0.7,
      do_sample: true,
      top_k: 50,
      top_p: 0.95,
    });

    // Clean up the response
    let response = result[0]?.generated_text || "";
    response = response.replace(realEstateContext + sentimentContext + prompt, "").trim();
    
    return response || "I'm here to help with your real estate questions. Could you please provide more details?";
  } catch (error) {
    console.error('Error generating response:', error);
    return "I'm having trouble processing your question. Please try a different question or contact our support team for assistance.";
  }
}
