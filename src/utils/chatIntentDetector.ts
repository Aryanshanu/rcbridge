
/**
 * Utility functions to detect user intent in chatbot conversations
 */

// Detect if message indicates lead potential
export function detectLeadPotential(message: string): boolean {
  const leadIndicators = [
    // Contact information
    /email|phone|call me|contact|reach me/i,
    // Interest in property
    /interested|looking for|searching for|want to buy|selling my/i,
    // Specific requirements
    /bedroom|bathroom|square feet|location|school district/i,
    // Timeline indicators
    /moving|relocate|timeline|soon|next month|this year/i,
    // Price indicators
    /budget|afford|price range|financing|mortgage|pre-approved/i
  ];
  
  return leadIndicators.some(pattern => pattern.test(message));
}

// Categorize the type of real estate inquiry
export function categorizeInquiry(message: string): string {
  const normalized = message.toLowerCase();
  
  if (/buy|looking for|purchase|buying|invest/i.test(normalized)) {
    return 'buying';
  } else if (/sell|selling|value|worth|market price/i.test(normalized)) {
    return 'selling';
  } else if (/rent|renting|lease|tenant|landlord/i.test(normalized)) {
    return 'renting';
  } else if (/loan|mortgage|finance|down payment|interest rate/i.test(normalized)) {
    return 'financing';
  } else if (/area|location|neighborhood|community|schools/i.test(normalized)) {
    return 'location';
  } else if (/price|cost|budget|afford/i.test(normalized)) {
    return 'pricing';
  } else {
    return 'general';
  }
}

// Extract location mentions from message
export function extractLocations(message: string): string[] {
  const hyderabadLocations = [
    'banjara hills', 'jubilee hills', 'hitec city', 'gachibowli', 
    'manikonda', 'kondapur', 'madhapur', 'kukatpally', 'miyapur',
    'secunderabad', 'begumpet', 'somajiguda', 'ameerpet', 'panjagutta',
    'financial district', 'kokapet', 'tellapur', 'nanakramguda',
    'shankarpally', 'ameenpur', 'gandipet'
  ];
  
  const normalizedMessage = message.toLowerCase();
  return hyderabadLocations.filter(location => normalizedMessage.includes(location));
}

// Extract property type mentions from message
export function extractPropertyTypes(message: string): string[] {
  const propertyTypes = [
    'apartment', 'flat', 'villa', 'house', 'duplex', 'penthouse',
    'plot', 'land', 'commercial', 'office', 'shop', 'retail',
    'warehouse', 'industrial', 'agricultural'
  ];
  
  const normalizedMessage = message.toLowerCase();
  return propertyTypes.filter(type => normalizedMessage.includes(type));
}

// Extract price range mentions from message
export function extractPriceRange(message: string): { min?: number, max?: number } {
  // Look for patterns like "under 50 lakhs", "50 lakhs to 1 crore", "budget of 2 crores"
  const result: { min?: number, max?: number } = {};
  
  const normalizedMessage = message.toLowerCase();
  
  // Check for maximum price mentions
  const maxPatterns = [
    /under (\d+\.?\d*) (lakh|lakhs|crore|crores)/i,
    /less than (\d+\.?\d*) (lakh|lakhs|crore|crores)/i,
    /maximum (\d+\.?\d*) (lakh|lakhs|crore|crores)/i,
    /up to (\d+\.?\d*) (lakh|lakhs|crore|crores)/i,
    /upto (\d+\.?\d*) (lakh|lakhs|crore|crores)/i,
    /budget (?:of|is) (\d+\.?\d*) (lakh|lakhs|crore|crores)/i
  ];
  
  // Check for range mentions
  const rangePatterns = [
    /(\d+\.?\d*) to (\d+\.?\d*) (lakh|lakhs|crore|crores)/i,
    /between (\d+\.?\d*) and (\d+\.?\d*) (lakh|lakhs|crore|crores)/i
  ];
  
  for (const pattern of maxPatterns) {
    const match = normalizedMessage.match(pattern);
    if (match) {
      const amount = parseFloat(match[1]);
      const unit = match[2].toLowerCase();
      
      // Convert to value in lakhs
      if (unit === 'crore' || unit === 'crores') {
        result.max = amount * 100; // 1 crore = 100 lakhs
      } else {
        result.max = amount;
      }
      break;
    }
  }
  
  for (const pattern of rangePatterns) {
    const match = normalizedMessage.match(pattern);
    if (match) {
      const min = parseFloat(match[1]);
      const max = parseFloat(match[2]);
      const unit = match[3].toLowerCase();
      
      // Convert to value in lakhs
      if (unit === 'crore' || unit === 'crores') {
        result.min = min * 100; // 1 crore = 100 lakhs
        result.max = max * 100;
      } else {
        result.min = min;
        result.max = max;
      }
      break;
    }
  }
  
  return result;
}
