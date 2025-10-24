import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to always download models
env.allowLocalModels = false;
env.useBrowserCache = true;

let extractorPipeline: any = null;
let isInitializing = false;

/**
 * Initialize the NLP extractor pipeline (lazy loading)
 */
export const initNLPExtractor = async () => {
  if (extractorPipeline) return extractorPipeline;
  
  if (isInitializing) {
    // Wait for initialization to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    return initNLPExtractor();
  }
  
  try {
    isInitializing = true;
    console.log('Initializing NLP extractor...');
    
    // Use a lightweight NER model for entity extraction
    extractorPipeline = await pipeline(
      'token-classification',
      'Xenova/bert-base-NER',
      { device: 'wasm' } // Use WASM for better browser compatibility
    );
    
    console.log('NLP extractor ready');
    return extractorPipeline;
  } catch (error) {
    console.error('Failed to initialize NLP extractor:', error);
    return null;
  } finally {
    isInitializing = false;
  }
};

/**
 * Clean and merge contiguous NER entities
 */
const mergeContiguousEntities = (entities: any[], text: string, targetType = 'LOC'): string | null => {
  const filtered = entities.filter((e: any) => 
    e.entity.includes(targetType) && e.score > 0.7
  ).sort((a: any, b: any) => a.start - b.start);
  
  if (filtered.length === 0) return null;
  
  const merged: Array<{start: number; end: number}> = [];
  let current = { start: filtered[0].start, end: filtered[0].end };
  
  for (let i = 1; i < filtered.length; i++) {
    if (filtered[i].start <= current.end + 1) {
      current.end = Math.max(current.end, filtered[i].end);
    } else {
      merged.push(current);
      current = { start: filtered[i].start, end: filtered[i].end };
    }
  }
  merged.push(current);
  
  // Extract and clean the first merged span
  if (merged.length > 0) {
    let phrase = text.substring(merged[0].start, merged[0].end);
    // Remove subword artifacts (##) and clean spacing
    phrase = phrase.replace(/##/g, '').replace(/\s+/g, ' ').trim();
    // Title case
    phrase = phrase.split(' ').map(w => 
      w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    ).join(' ');
    return phrase.length >= 3 ? phrase : null;
  }
  
  return null;
};

/**
 * Extract entities from text using NLP model
 */
export const extractEntitiesWithNLP = async (text: string): Promise<{
  budget?: string;
  location?: string;
  timeline?: string;
  propertyType?: string;
  bedrooms?: string;
}> => {
  const extracted: any = {};
  
  try {
    // Budget extraction (enhanced regex + NLP)
    const budgetPatterns = [
      /(\d+(?:\.\d+)?)\s*(lakh|lakhs|l|cr|crore|crores)/gi,
      /₹\s*(\d+(?:\.\d+)?)\s*(lakh|lakhs|l|cr|crore|crores)?/gi,
      /(?:budget|price|cost|amount)\s*(?:is|of|around|approximately)?\s*(?:₹)?\s*(\d+(?:\.\d+)?)\s*(lakh|lakhs|l|cr|crore|crores)?/gi
    ];
    
    for (const pattern of budgetPatterns) {
      const match = text.match(pattern);
      if (match) {
        // Normalize spacing and ensure single rupee symbol
        let budgetStr = match[0].replace(/₹/g, '').trim();
        budgetStr = budgetStr.replace(/\s+/g, ' ');
        extracted.budget = `₹${budgetStr}`;
        break;
      }
    }
    
    // Location extraction (Hyderabad-specific)
    const hyderabadLocations = [
      'gachibowli', 'hitech city', 'hitec city', 'financial district', 'madhapur',
      'jubilee hills', 'banjara hills', 'kondapur', 'kokapet', 'tellapur',
      'pocharam', 'ghatkesar', 'uppal', 'lb nagar', 'kukatpally',
      'miyapur', 'nizampet', 'shamshabad', 'manikonda', 'narsingi'
    ];
    
    const lowerText = text.toLowerCase();
    for (const location of hyderabadLocations) {
      if (lowerText.includes(location)) {
        extracted.location = location.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        break;
      }
    }
    
    // Timeline extraction
    const timelinePatterns = [
      /(?:within|in|by)\s*(\d+)\s*(day|days|week|weeks|month|months)/gi,
      /(urgent|immediately|asap|soon)/gi,
      /(?:next|coming)\s*(\d+)?\s*(week|month|year)/gi
    ];
    
    for (const pattern of timelinePatterns) {
      const match = text.match(pattern);
      if (match) {
        extracted.timeline = match[0].replace(/\s+/g, ' ').trim();
        break;
      }
    }
    
    // Property type extraction
    const propertyTypes = [
      { pattern: /\b(\d+)\s*bhk\b/gi, key: 'bedrooms' },
      { pattern: /\b(apartment|flat|villa|plot|land|commercial|office|agricultural)\b/gi, key: 'propertyType' }
    ];
    
    for (const { pattern, key } of propertyTypes) {
      const match = text.match(pattern);
      if (match) {
        if (key === 'bedrooms') {
          extracted[key] = match[0].toUpperCase();
        } else {
          extracted[key] = match[0].charAt(0).toUpperCase() + match[0].slice(1).toLowerCase();
        }
      }
    }
    
    // Try NLP extraction for locations (if pattern matching failed)
    if (!extracted.location) {
      const extractor = await initNLPExtractor();
      if (extractor) {
        try {
          const entities = await extractor(text);
          const mergedLocation = mergeContiguousEntities(entities, text, 'LOC');
          
          if (mergedLocation) {
            extracted.location = mergedLocation;
          }
        } catch (nlpError) {
          console.warn('NLP extraction failed, using regex fallback:', nlpError);
        }
      }
    }
    
  } catch (error) {
    console.error('Entity extraction error:', error);
  }
  
  return extracted;
};

/**
 * Pre-warm the NLP model (call on app init)
 */
export const prewarmNLP = () => {
  // Initialize in background without blocking
  setTimeout(() => {
    initNLPExtractor().catch(console.error);
  }, 2000);
};
