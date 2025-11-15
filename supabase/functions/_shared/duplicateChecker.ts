/**
 * Duplicate Detection System
 * Uses exact matching and fuzzy string matching to detect duplicate properties
 */

import { distance } from 'https://deno.land/x/fastest_levenshtein/mod.ts';

/**
 * Convert Levenshtein distance to similarity percentage
 */
function calculateSimilarity(str1: string, str2: string): number {
  const editDistance = distance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 100;
  return (1 - editDistance / maxLength) * 100;
}

export interface DuplicateMatch {
  id: string;
  confidence: number;
  reason: string;
  matchedField?: string;
  existingProperty?: {
    title: string;
    location: string;
    price: number;
    area?: number;
  };
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  matches: DuplicateMatch[];
  highestConfidence: number;
}

/**
 * Check for duplicate properties using multiple strategies
 */
export async function checkDuplicates(
  property: {
    source_url?: string;
    location: string;
    price: number;
    area?: number;
    source_contact_phone?: string;
    source_contact_email?: string;
    title?: string;
  },
  supabaseClient: any
): Promise<DuplicateCheckResult> {
  const matches: DuplicateMatch[] = [];

  // Strategy 1: Exact URL match (100% confidence)
  if (property.source_url) {
    const { data: urlMatch } = await supabaseClient
      .from('properties')
      .select('id, title, location, price, area')
      .eq('source_url', property.source_url)
      .limit(1)
      .single();

    if (urlMatch) {
      matches.push({
        id: urlMatch.id,
        confidence: 1.0,
        reason: 'Exact source URL match',
        matchedField: 'source_url',
        existingProperty: urlMatch,
      });
      return {
        isDuplicate: true,
        matches,
        highestConfidence: 1.0,
      };
    }
  }

  // Strategy 2: Exact phone number match (90% confidence)
  if (property.source_contact_phone) {
    const { data: phoneMatches } = await supabaseClient
      .from('properties')
      .select('id, title, location, price, area, source_contact_phone')
      .eq('source_contact_phone', property.source_contact_phone)
      .limit(5);

    if (phoneMatches && phoneMatches.length > 0) {
      for (const match of phoneMatches) {
        // Also check if location is similar (0-100%)
        const locationSimilarity = calculateSimilarity(
          property.location.toLowerCase(),
          match.location.toLowerCase()
        );

        // Same phone + similar location = very likely duplicate
        if (locationSimilarity > 70) {
          matches.push({
            id: match.id,
            confidence: 0.95,
            reason: 'Same phone number and similar location',
            matchedField: 'source_contact_phone',
            existingProperty: match,
          });
        } else {
          matches.push({
            id: match.id,
            confidence: 0.75,
            reason: 'Same phone number, different location',
            matchedField: 'source_contact_phone',
            existingProperty: match,
          });
        }
      }
    }
  }

  // Strategy 3: Exact email match (85% confidence)
  if (property.source_contact_email) {
    const { data: emailMatches } = await supabaseClient
      .from('properties')
      .select('id, title, location, price, area')
      .eq('source_contact_email', property.source_contact_email)
      .limit(5);

    if (emailMatches && emailMatches.length > 0) {
      for (const match of emailMatches) {
        matches.push({
          id: match.id,
          confidence: 0.85,
          reason: 'Same email address',
          matchedField: 'source_contact_email',
          existingProperty: match,
        });
      }
    }
  }

  // Strategy 4: Fuzzy location + price match
  // Get recent properties with similar price range (±10%)
  const priceMin = property.price * 0.9;
  const priceMax = property.price * 1.1;

  const { data: priceMatches } = await supabaseClient
    .from('properties')
    .select('id, title, location, price, area')
    .gte('price', priceMin)
    .lte('price', priceMax)
    .limit(50);

  if (priceMatches && priceMatches.length > 0) {
    for (const match of priceMatches) {
      // Calculate location similarity using fuzzy matching (0-100%)
      const locationSimilarity = calculateSimilarity(
        property.location.toLowerCase(),
        match.location.toLowerCase()
      );

      // Calculate price similarity (as percentage)
      const priceDiff = Math.abs(match.price - property.price) / property.price;
      const priceSimilarity = (1 - priceDiff) * 100;

      // Calculate area similarity if both have area
      let areaSimilarity = 0;
      if (property.area && match.area) {
        const areaDiff = Math.abs(match.area - property.area) / property.area;
        areaSimilarity = (1 - areaDiff) * 100;
      }

      // High location similarity + similar price = likely duplicate
      if (locationSimilarity > 85) {
        let confidence = 0.7;
        
        // Boost confidence if area also matches
        if (areaSimilarity > 90) {
          confidence = 0.9;
        } else if (areaSimilarity > 80) {
          confidence = 0.85;
        }

        // Check if already matched by phone/email
        const alreadyMatched = matches.some(m => m.id === match.id);
        if (!alreadyMatched) {
          matches.push({
            id: match.id,
            confidence,
            reason: `Similar location (${locationSimilarity.toFixed(0)}%), price (${priceSimilarity.toFixed(0)}%)${areaSimilarity > 0 ? `, area (${areaSimilarity.toFixed(0)}%)` : ''}`,
            matchedField: 'location_price',
            existingProperty: match,
          });
        }
      } else if (locationSimilarity > 70 && areaSimilarity > 85) {
        // Moderate location match but very similar area/price
        const alreadyMatched = matches.some(m => m.id === match.id);
        if (!alreadyMatched) {
          matches.push({
            id: match.id,
            confidence: 0.75,
            reason: `Similar location (${locationSimilarity.toFixed(0)}%), area (${areaSimilarity.toFixed(0)}%), price (${priceSimilarity.toFixed(0)}%)`,
            matchedField: 'location_area_price',
            existingProperty: match,
          });
        }
      }
    }
  }

  // Sort matches by confidence (highest first)
  matches.sort((a, b) => b.confidence - a.confidence);

  // Remove duplicates (keep highest confidence match per property ID)
  const uniqueMatches: DuplicateMatch[] = [];
  const seenIds = new Set<string>();
  for (const match of matches) {
    if (!seenIds.has(match.id)) {
      uniqueMatches.push(match);
      seenIds.add(match.id);
    }
  }

  const highestConfidence = uniqueMatches.length > 0 ? uniqueMatches[0].confidence : 0;

  return {
    isDuplicate: highestConfidence >= 0.85, // Consider duplicate if confidence >= 85%
    matches: uniqueMatches.slice(0, 5), // Return top 5 matches
    highestConfidence,
  };
}

/**
 * Batch check duplicates for multiple properties
 */
export async function batchCheckDuplicates(
  properties: any[],
  supabaseClient: any
): Promise<DuplicateCheckResult[]> {
  const results: DuplicateCheckResult[] = [];

  for (const property of properties) {
    const result = await checkDuplicates(property, supabaseClient);
    results.push(result);
  }

  return results;
}
