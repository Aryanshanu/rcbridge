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
 * Store user inquiry - removed localStorage PII storage for security
 * Data should be stored in Supabase with proper RLS instead
 */
export function storeUserInquiry(
  message: string,
  context?: Array<{ role: string; content: string }>
): void {
  // Legacy function - no longer stores PII in localStorage
  // All user data should be stored in Supabase with proper RLS
  console.log('User inquiry processing - using database storage');
}

/**
 * Get conversation context for sending to AI
 */
export function getConversationContext(): Array<{ role: string; content: string }> {
  return conversationContext;
}

/**
 * Add message to conversation context (in-memory only for session)
 */
export function addToConversationContext(role: 'user' | 'assistant', content: string): void {
  conversationContext.push({ role, content });
  
  // Keep only last 15 messages to manage token usage
  if (conversationContext.length > 15) {
    conversationContext = conversationContext.slice(-15);
  }
  
  // No longer save to localStorage - use in-memory only for better security
}

/**
 * Load conversation context (no-op now, context is in-memory only)
 */
export function loadConversationContext(): void {
  // No longer load from localStorage - context is session-only
  conversationContext = [];
}

/**
 * Clear conversation context
 */
export function clearConversationContext(): void {
  conversationContext = [];
}

/**
 * Update user profile information - removed localStorage PII storage
 * Should be stored in Supabase profiles table instead
 */
export function updateUserProfile(profileData: Record<string, any>): void {
  userProfileInfo = { ...userProfileInfo, ...profileData };
  // No longer store PII in localStorage - use Supabase profiles table
  console.log('User profile updated in memory only');
}

/**
 * Get user profile information (in-memory only)
 */
export function getUserProfile(): Record<string, any> {
  return userProfileInfo;
}
