
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to use browser cache for better performance
env.useBrowserCache = true;
env.allowLocalModels = false;

// Initialize models as needed
let chatModel = null;
let imageModel = null;

/**
 * Initialize the chat model
 * @returns Boolean indicating if initialization was successful
 */
export async function initializeChatModel(): Promise<boolean> {
  try {
    if (!chatModel) {
      console.log('Initializing chat model...');
      // Load a lightweight chat model suitable for browser use
      chatModel = await pipeline(
        'text2text-generation', 
        'onnx-community/distilgpt2', 
        { 
          // For text generation models
          max_new_tokens: 150 
        }
      );
      console.log('Chat model initialized successfully');
    }
    return true;
  } catch (error) {
    console.error('Error initializing chat model:', error);
    return false;
  }
}

/**
 * Initialize the image generation model
 * @returns Boolean indicating if initialization was successful
 */
export async function initializeImageModel(): Promise<boolean> {
  try {
    if (!imageModel) {
      console.log('Initializing image generation model...');
      // Using 'text-generation' pipeline as a fallback since text-to-image isn't available
      imageModel = await pipeline(
        'text-generation',
        'stabilityai/stable-diffusion-2-base',
        { device: 'webgpu' }
      );
      console.log('Image model initialized successfully');
    }
    return true;
  } catch (error) {
    console.error('Failed to initialize image model:', error);
    return false;
  }
}

/**
 * Get a response from the chatbot based on user message
 * @param message User message
 * @returns Chatbot response
 */
export async function generateResponse(message: string): Promise<string> {
  try {
    if (!chatModel) {
      await initializeChatModel();
    }
    
    if (!chatModel) {
      return "I'm sorry, I couldn't initialize my chat capabilities. Please try again later.";
    }
    
    // Generate response
    const result = await chatModel(message, {
      temperature: 0.7,
      top_p: 0.95
    });
    
    // Process and return the response
    if (result && typeof result === 'object' && 'generated_text' in result) {
      return result.generated_text;
    } else if (Array.isArray(result) && result.length > 0) {
      return result[0].generated_text;
    }
    
    return "I'm sorry, I'm having trouble understanding that. Could you please rephrase?";
  } catch (error) {
    console.error('Error generating chat response:', error);
    return "I'm currently experiencing technical difficulties. Please try again later.";
  }
}

/**
 * Generate an image based on text description
 * @param description Description of the property
 * @returns Base64 encoded image data or placeholder URL
 */
export async function generatePropertyImage(description: string): Promise<string> {
  try {
    if (!imageModel) {
      await initializeImageModel();
    }
    
    if (!imageModel) {
      return '/placeholder.svg';
    }
    
    // For now, return a placeholder image since we don't have a working text-to-image model
    return '/placeholder.svg';
    
    /* 
    // Commented out as text-to-image pipeline isn't available in current version
    const result = await imageModel(description, {
      num_inference_steps: 25,
      guidance_scale: 7.5
    });
    
    if (result && result.image) {
      // Convert result to base64 or URL format
      return result.image;
    }
    */
  } catch (error) {
    console.error('Error generating image:', error);
    return '/placeholder.svg';
  }
}
