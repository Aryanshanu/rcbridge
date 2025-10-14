/**
 * Chatbot utilities for RC Bridge real estate assistant
 * Clean implementation using AI edge function
 */

// User conversation tracking
let conversationContext: Array<{ role: string; content: string }> = [];
let userProfileInfo: Record<string, any> = {};

/**
 * Initializes the chat model - simplified for reliability
 */
export async function initializeChatModel(): Promise<boolean> {
  try {
    console.log('Initializing chat capabilities...');
    return true;
  } catch (error) {
    console.error('Error initializing chat capabilities:', error);
    return false;
  }
}

/**
 * Initializes the image generation capability
 */
export async function initializeImageModel(): Promise<boolean> {
  try {
    console.log('Initializing image generation capabilities...');
    return true;
  } catch (error) {
    console.error('Failed to initialize image generation:', error);
    return false;
  }
}

/**
 * Extract location mentions from user message
 */
export function extractLocations(message: string): string[] {
  const locations: string[] = [];
  const normalizedMessage = message.toLowerCase();
  
  const commonLocations = [
    "pocharam", "gachibowli", "jubilee hills", "banjara hills", "hitech city", "hitec city",
    "kondapur", "madhapur", "kukatpally", "miyapur", "manikonda", "secunderabad",
    "financial district", "uppal", "nallagandla", "chandanagar", "kokapet", "tellapur"
  ];
  
  for (const location of commonLocations) {
    if (normalizedMessage.includes(location) && !locations.includes(location)) {
      locations.push(location);
    }
  }
  
  return locations;
}

/**
 * Extract budget information from user message
 */
export function extractBudget(message: string): string | null {
  const budgetRegex = /(\d+(\.\d+)?)\s*(lakhs|lakh|crores|crore|cr|l)/i;
  const match = message.match(budgetRegex);
  
  if (match) {
    return match[0];
  }
  
  return null;
}

/**
 * Extract timeline information from user message
 */
export function extractTimeline(message: string): string | null {
  const timelineRegex = /(\d+)\s*(days|day|weeks|week|months|month|years|year)|urgent|asap|immediately/i;
  const match = message.match(timelineRegex);
  
  if (match) {
    return match[0];
  }
  
  return null;
}

/**
 * Generate a property image based on description and context
 */
export async function generatePropertyImage(
  description: string,
  location?: string
): Promise<string | null> {
  try {
    console.log('Generating property image for:', description, location);
    
    // This would call an actual image generation API
    // For now, return a placeholder
    return null;
  } catch (error) {
    console.error('Error generating property image:', error);
    return null;
  }
}

/**
 * Store user inquiry in conversation context for analytics (legacy compatibility)
 */
export function storeUserInquiry(
  message: string,
  context?: Array<{ role: string; content: string }>
): void {
  try {
    const inquiries = JSON.parse(localStorage.getItem('user_inquiries') || '[]');
    inquiries.push({
      message,
      timestamp: new Date().toISOString(),
      conversationContext: context || conversationContext.slice(-5)
    });
    localStorage.setItem('user_inquiries', JSON.stringify(inquiries));
    console.log('User inquiry stored successfully');
  } catch (error) {
    console.error('Error storing user inquiry:', error);
  }
}

/**
 * Get conversation context for sending to AI
 */
export function getConversationContext(): Array<{ role: string; content: string }> {
  return conversationContext;
}

/**
 * Add message to conversation context
 */
export function addToConversationContext(role: 'user' | 'assistant', content: string): void {
  conversationContext.push({ role, content });
  
  // Keep only last 15 messages to manage token usage
  if (conversationContext.length > 15) {
    conversationContext = conversationContext.slice(-15);
  }
  
  // Save to localStorage
  try {
    localStorage.setItem('conversation_context', JSON.stringify(conversationContext));
  } catch (error) {
    console.error('Error saving conversation context:', error);
  }
}

/**
 * Load conversation context from localStorage
 */
export function loadConversationContext(): void {
  try {
    const saved = localStorage.getItem('conversation_context');
    if (saved) {
      conversationContext = JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading conversation context:', error);
  }
}

/**
 * Clear conversation context
 */
export function clearConversationContext(): void {
  conversationContext = [];
  try {
    localStorage.removeItem('conversation_context');
  } catch (error) {
    console.error('Error clearing conversation context:', error);
  }
}

/**
 * Update user profile information
 */
export function updateUserProfile(profileData: Record<string, any>): void {
  userProfileInfo = { ...userProfileInfo, ...profileData };
  
  try {
    localStorage.setItem('user_profile', JSON.stringify(userProfileInfo));
    console.log('User profile updated:', userProfileInfo);
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
}

/**
 * Get user profile information
 */
export function getUserProfile(): Record<string, any> {
  if (Object.keys(userProfileInfo).length === 0) {
    try {
      const saved = localStorage.getItem('user_profile');
      if (saved) {
        userProfileInfo = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }
  return userProfileInfo;
}
