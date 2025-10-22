/**
 * Chatbot utilities for RC Bridge real estate assistant
 * Clean implementation using AI edge function
 */

import { supabase } from "@/integrations/supabase/client";

// User conversation tracking
let conversationContext: Array<{ role: string; content: string }> = [];
let userProfileInfo: Record<string, any> = {};

export interface ChatEntities {
  budget?: string;
  location?: string;
  size?: string;
  bedrooms?: string;
  timeline?: string;
  property_type?: string;
  intent?: string;
  name?: string;
  email?: string;
  phone?: string;
}

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
 * Extract property type from user message
 */
export function extractPropertyType(message: string): string | null {
  const normalizedMessage = message.toLowerCase();
  
  const propertyTypes = [
    { keywords: ['plot', 'land', 'acre', 'sq yard', 'open plot'], type: 'plot' },
    { keywords: ['apartment', 'flat', 'bhk', '2bhk', '3bhk'], type: 'apartment' },
    { keywords: ['villa', 'independent house', 'bungalow'], type: 'villa' },
    { keywords: ['commercial', 'office', 'shop', 'retail'], type: 'commercial' },
    { keywords: ['agricultural', 'farm land', 'farming'], type: 'agricultural' }
  ];
  
  for (const { keywords, type } of propertyTypes) {
    if (keywords.some(kw => normalizedMessage.includes(kw))) {
      return type;
    }
  }
  
  return null;
}

/**
 * Extract size information from user message
 */
export function extractSize(message: string): string | null {
  const sizeRegex = /(\d+(\.\d+)?)\s*(sq\s*(?:yard|yards|ft|feet|meter|metres?|m)|square\s*(?:yard|yards|feet|foot|meter|metres?)|yard|yards)/i;
  const match = message.match(sizeRegex);
  
  if (match) {
    return match[0];
  }
  
  return null;
}

/**
 * Extract intent from user message (buying, selling, investing)
 */
export function extractIntent(message: string): string | null {
  const normalizedMessage = message.toLowerCase();
  
  const intents = [
    { keywords: ['buy', 'buying', 'purchase', 'looking for'], intent: 'buying' },
    { keywords: ['sell', 'selling', 'list my property'], intent: 'selling' },
    { keywords: ['invest', 'investing', 'investment', 'roi'], intent: 'investing' },
    { keywords: ['rent', 'renting', 'lease', 'tenant'], intent: 'renting' }
  ];
  
  for (const { keywords, intent } of intents) {
    if (keywords.some(kw => normalizedMessage.includes(kw))) {
      return intent;
    }
  }
  
  return null;
}

/**
 * Extract contact information from user message
 */
export function extractContactInfo(message: string): { email?: string; phone?: string; name?: string } {
  const result: { email?: string; phone?: string; name?: string } = {};
  
  // Email extraction
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const emailMatch = message.match(emailRegex);
  if (emailMatch) {
    result.email = emailMatch[0];
  }
  
  // Phone extraction (Indian format)
  const phoneRegex = /(\+91|91)?[\s-]?[6-9]\d{9}/;
  const phoneMatch = message.match(phoneRegex);
  if (phoneMatch) {
    result.phone = phoneMatch[0].replace(/[\s-]/g, '');
  }
  
  return result;
}

/**
 * Extract all entities from a message
 */
export function extractAllEntities(message: string): Partial<ChatEntities> {
  const contactInfo = extractContactInfo(message);
  return {
    budget: extractBudget(message) || undefined,
    location: extractLocations(message)[0] || undefined,
    size: extractSize(message) || undefined,
    timeline: extractTimeline(message) || undefined,
    property_type: extractPropertyType(message) || undefined,
    intent: extractIntent(message) || undefined,
    email: contactInfo.email,
    phone: contactInfo.phone,
    name: contactInfo.name
  };
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

/**
 * Persist conversation context to database
 */
export async function persistContextToDatabase(
  conversationId: string,
  entities: Partial<ChatEntities>,
  lastAction?: string
): Promise<void> {
  try {
    const { data: existing } = await supabase
      .from('chat_context')
      .select('entities')
      .eq('conversation_id', conversationId)
      .maybeSingle();
    
    const existingEntities = (existing?.entities || {}) as Record<string, any>;
    const newEntities = Object.fromEntries(
      Object.entries(entities).filter(([_, v]) => v !== undefined && v !== null)
    );
    const mergedEntities = { ...existingEntities, ...newEntities };
    
    await supabase
      .from('chat_context')
      .upsert({
        conversation_id: conversationId,
        entities: mergedEntities,
        last_action: lastAction
      });
  } catch (error) {
    console.error('Error persisting context:', error);
  }
}

/**
 * Load context entities from database
 */
export async function loadContextEntities(conversationId: string): Promise<ChatEntities> {
  try {
    const { data } = await supabase
      .from('chat_context')
      .select('entities')
      .eq('conversation_id', conversationId)
      .maybeSingle();
    
    return (data?.entities as ChatEntities) || {};
  } catch (error) {
    console.error('Error loading context:', error);
    return {};
  }
}

/**
 * Update context with new message
 */
export async function updateContextWithMessage(
  conversationId: string,
  message: string,
  role: 'user' | 'assistant'
): Promise<void> {
  if (role === 'user') {
    const entities = extractAllEntities(message);
    if (Object.keys(entities).length > 0) {
      await persistContextToDatabase(conversationId, entities);
    }
  }
}
