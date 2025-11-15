/**
 * Data Normalization Utilities
 * Standardizes property data formats for consistency
 */

export interface NormalizedData {
  data: any;
  warnings: string[];
  errors: string[];
}

/**
 * Normalize phone number to E.164 format
 * Adds +91 for Indian numbers, removes non-numeric characters
 */
export function normalizePhone(phone: string | null | undefined): NormalizedData {
  const warnings: string[] = [];
  const errors: string[] = [];

  if (!phone) {
    return { data: null, warnings, errors };
  }

  // Remove all non-numeric characters
  let cleaned = phone.replace(/[^\d+]/g, '');

  // If starts with 0, remove it (Indian mobile numbers don't start with 0)
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  // Add +91 if not present and number looks Indian (10 digits)
  if (!cleaned.startsWith('+') && cleaned.length === 10) {
    cleaned = '+91' + cleaned;
  }

  // Validate length
  if (cleaned.length < 10 || cleaned.length > 15) {
    warnings.push(`Phone number length unusual: ${cleaned.length} digits`);
  }

  return { data: cleaned, warnings, errors };
}

/**
 * Normalize price to integer rupees
 * Converts: "1.5 Cr", "75 L", "₹10000000" → 15000000, 7500000, 10000000
 */
export function normalizePrice(priceStr: string | number): NormalizedData {
  const warnings: string[] = [];
  const errors: string[] = [];

  if (typeof priceStr === 'number') {
    if (priceStr <= 0) {
      errors.push('Price must be positive');
      return { data: null, warnings, errors };
    }
    return { data: Math.round(priceStr), warnings, errors };
  }

  if (!priceStr) {
    errors.push('Price is required');
    return { data: null, warnings, errors };
  }

  // Remove currency symbols and extra spaces
  let cleaned = priceStr.replace(/[₹$,\s]/g, '').toLowerCase();

  // Handle Crore (Cr)
  if (cleaned.includes('cr')) {
    const num = parseFloat(cleaned.replace(/[^\d.]/g, ''));
    if (isNaN(num)) {
      errors.push(`Invalid price format: ${priceStr}`);
      return { data: null, warnings, errors };
    }
    return { data: Math.round(num * 10000000), warnings, errors };
  }

  // Handle Lakh (L)
  if (cleaned.includes('l')) {
    const num = parseFloat(cleaned.replace(/[^\d.]/g, ''));
    if (isNaN(num)) {
      errors.push(`Invalid price format: ${priceStr}`);
      return { data: null, warnings, errors };
    }
    return { data: Math.round(num * 100000), warnings, errors };
  }

  // Handle thousand (K)
  if (cleaned.includes('k')) {
    const num = parseFloat(cleaned.replace(/[^\d.]/g, ''));
    if (isNaN(num)) {
      errors.push(`Invalid price format: ${priceStr}`);
      return { data: null, warnings, errors };
    }
    return { data: Math.round(num * 1000), warnings, errors };
  }

  // Direct number
  const num = parseFloat(cleaned.replace(/[^\d.]/g, ''));
  if (isNaN(num)) {
    errors.push(`Invalid price format: ${priceStr}`);
    return { data: null, warnings, errors };
  }

  return { data: Math.round(num), warnings, errors };
}

/**
 * Normalize location to "Area, City" format
 * Maps common abbreviations to full names
 */
export function normalizeLocation(location: string | null | undefined): NormalizedData {
  const warnings: string[] = [];
  const errors: string[] = [];

  if (!location || location.trim() === '') {
    errors.push('Location is required');
    return { data: null, warnings, errors };
  }

  let normalized = location.trim();

  // Location synonym mapping (Hyderabad-specific, can be extended)
  const locationMap: Record<string, string> = {
    'gachi': 'Gachibowli',
    'gachibowli': 'Gachibowli',
    'hitech': 'Hi-Tech City',
    'hitechcity': 'Hi-Tech City',
    'hi-techcity': 'Hi-Tech City',
    'kondapur': 'Kondapur',
    'madhapur': 'Madhapur',
    'banjara': 'Banjara Hills',
    'banjarahills': 'Banjara Hills',
    'jubilee': 'Jubilee Hills',
    'jubileehills': 'Jubilee Hills',
    'financial': 'Financial District',
    'financialdistrict': 'Financial District',
    'nanakramguda': 'Nanakramguda',
    'kukatpally': 'Kukatpally',
    'miyapur': 'Miyapur',
    'begumpet': 'Begumpet',
    'secunderabad': 'Secunderabad',
  };

  // Convert to lowercase for matching
  const lowerLocation = normalized.toLowerCase().replace(/\s+/g, '');
  
  // Check if location is in map
  for (const [key, value] of Object.entries(locationMap)) {
    if (lowerLocation.includes(key)) {
      normalized = value;
      break;
    }
  }

  // Capitalize words
  normalized = normalized
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // Add city if not present (assume Hyderabad for now)
  if (!normalized.toLowerCase().includes('hyderabad') && !normalized.includes(',')) {
    normalized = `${normalized}, Hyderabad`;
  }

  return { data: normalized, warnings, errors };
}

/**
 * Normalize property type to enum value
 */
export function normalizePropertyType(
  type: string | null | undefined
): NormalizedData {
  const warnings: string[] = [];
  const errors: string[] = [];

  if (!type) {
    warnings.push('Property type not specified, defaulting to residential');
    return { data: 'residential', warnings, errors };
  }

  const typeMap: Record<string, string> = {
    'apartment': 'residential',
    'flat': 'residential',
    'house': 'residential',
    'villa': 'residential',
    'bhk': 'residential',
    'residential': 'residential',
    'office': 'commercial',
    'shop': 'commercial',
    'showroom': 'commercial',
    'warehouse': 'commercial',
    'commercial': 'commercial',
    'farm': 'agricultural',
    'farmland': 'agricultural',
    'agricultural': 'agricultural',
    'plot': 'undeveloped',
    'land': 'undeveloped',
    'undeveloped': 'undeveloped',
  };

  const lowerType = type.toLowerCase().trim();
  const normalized = typeMap[lowerType];

  if (!normalized) {
    warnings.push(`Unknown property type: ${type}, defaulting to residential`);
    return { data: 'residential', warnings, errors };
  }

  return { data: normalized, warnings, errors };
}

/**
 * Validate numeric bounds for property data
 */
export function validateBounds(data: {
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  land_size?: number;
}): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Price bounds: 100k to 1B (10 Crore)
  if (data.price !== undefined) {
    if (data.price < 100000) {
      warnings.push(`Price unusually low: ₹${data.price.toLocaleString()}`);
    }
    if (data.price > 1000000000) {
      warnings.push(`Price unusually high: ₹${data.price.toLocaleString()}`);
    }
    if (data.price <= 0) {
      errors.push('Price must be positive');
    }
  }

  // Bedrooms: 0-20
  if (data.bedrooms !== undefined) {
    if (data.bedrooms < 0) {
      errors.push('Bedrooms cannot be negative');
    }
    if (data.bedrooms > 20) {
      warnings.push(`Unusually high bedroom count: ${data.bedrooms}`);
    }
  }

  // Bathrooms: 0-20
  if (data.bathrooms !== undefined) {
    if (data.bathrooms < 0) {
      errors.push('Bathrooms cannot be negative');
    }
    if (data.bathrooms > 20) {
      warnings.push(`Unusually high bathroom count: ${data.bathrooms}`);
    }
  }

  // Area: 100 to 100,000 sq ft
  if (data.area !== undefined) {
    if (data.area < 100) {
      warnings.push(`Area unusually small: ${data.area} sq ft`);
    }
    if (data.area > 100000) {
      warnings.push(`Area unusually large: ${data.area} sq ft`);
    }
    if (data.area <= 0) {
      errors.push('Area must be positive');
    }
  }

  // Land size: similar to area
  if (data.land_size !== undefined) {
    if (data.land_size < 100) {
      warnings.push(`Land size unusually small: ${data.land_size} sq ft`);
    }
    if (data.land_size > 1000000) {
      warnings.push(`Land size unusually large: ${data.land_size} sq ft`);
    }
    if (data.land_size <= 0) {
      errors.push('Land size must be positive');
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Normalize full property object
 */
export function normalizeProperty(property: any): {
  normalized: any;
  warnings: string[];
  errors: string[];
} {
  const allWarnings: string[] = [];
  const allErrors: string[] = [];

  const normalized: any = { ...property };

  // Normalize price
  if (property.price) {
    const priceResult = normalizePrice(property.price);
    normalized.price = priceResult.data;
    allWarnings.push(...priceResult.warnings);
    allErrors.push(...priceResult.errors);
  }

  // Normalize phone
  if (property.source_contact_phone || property.contact_phone) {
    const phoneResult = normalizePhone(property.source_contact_phone || property.contact_phone);
    normalized.source_contact_phone = phoneResult.data;
    allWarnings.push(...phoneResult.warnings);
    allErrors.push(...phoneResult.errors);
  }

  // Normalize location
  if (property.location) {
    const locationResult = normalizeLocation(property.location);
    normalized.location = locationResult.data;
    allWarnings.push(...locationResult.warnings);
    allErrors.push(...locationResult.errors);
  }

  // Normalize property type
  if (property.property_type) {
    const typeResult = normalizePropertyType(property.property_type);
    normalized.property_type = typeResult.data;
    allWarnings.push(...typeResult.warnings);
    allErrors.push(...typeResult.errors);
  }

  // Validate bounds
  const boundsResult = validateBounds({
    price: normalized.price,
    bedrooms: normalized.bedrooms,
    bathrooms: normalized.bathrooms,
    area: normalized.area,
    land_size: normalized.land_size,
  });
  allWarnings.push(...boundsResult.warnings);
  allErrors.push(...boundsResult.errors);

  return {
    normalized,
    warnings: allWarnings,
    errors: allErrors,
  };
}
