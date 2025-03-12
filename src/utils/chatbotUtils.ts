
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to use browser cache for better performance
env.useBrowserCache = true;

// Initialize the model only once
let chatModel: any = null;

export async function initializeChatModel() {
  if (!chatModel) {
    console.log('Initializing chat model...');
    try {
      // Load a lightweight model suitable for property/real estate Q&A
      chatModel = await pipeline(
        'text-generation',
        'Xenova/distilgpt2',
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

export async function generateResponse(prompt: string): Promise<string> {
  if (!chatModel) {
    const initialized = await initializeChatModel();
    if (!initialized) {
      return "I'm sorry, I couldn't load my knowledge base. Please try again later.";
    }
  }

  try {
    // Real estate specific context to help guide the model responses
    const realEstateContext = "As a real estate assistant, I can help with property information, investment advice, and market trends. ";
    
    // Generate a response with the model
    const result = await chatModel(realEstateContext + prompt, {
      max_new_tokens: 100,
      temperature: 0.7,
      do_sample: true,
    });

    // Clean up the response to make it more suitable for chat
    let response = result[0]?.generated_text || "";
    response = response.replace(realEstateContext + prompt, "").trim();
    
    // Ensure we return a reasonable response
    return response || "I'm here to help with your real estate questions.";
  } catch (error) {
    console.error('Error generating response:', error);
    return "I'm having trouble processing your question. Please try a different question.";
  }
}
