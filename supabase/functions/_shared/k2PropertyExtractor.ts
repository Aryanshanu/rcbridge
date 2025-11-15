/**
 * K2-Think Property Extractor
 * Uses LLM360/K2-Think model for advanced property data extraction from Instagram posts
 */

export interface ExtractedProperty {
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  land_size?: number;
  property_type: 'residential' | 'commercial' | 'agricultural' | 'undeveloped';
  listing_type: 'sale' | 'rent' | 'development_partnership';
  features?: string[];
  amenities?: Record<string, boolean>;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  rental_duration?: string;
  rental_terms?: string;
  roi_potential?: number;
}

export interface ExtractionResult {
  extracted: ExtractedProperty | null;
  confidence: number;
  warnings: string[];
  errors: string[];
  rawResponse?: string;
}

const PROPERTY_EXTRACTION_PROMPT = `You are a real estate data extraction expert. Extract structured property information from this Instagram post text.

CRITICAL RULES:
1. Convert ALL prices to rupees (₹) as integers:
   - 1 Crore = 10,000,000 (₹1Cr = 10000000)
   - 1 Lakh = 100,000 (₹75L = 7500000)
   - Remove currency symbols and convert to number

2. Normalize locations to "Area, City" format:
   - "Gachi" → "Gachibowli, Hyderabad"
   - "Kondapur" → "Kondapur, Hyderabad"
   - "Financial District" → "Financial District, Hyderabad"

3. Extract contact information:
   - Phone numbers (with +91 prefix if Indian)
   - Email addresses
   - Contact person name

4. Property type classification:
   - residential: apartments, villas, houses, flats, BHK properties
   - commercial: offices, shops, showrooms, warehouses
   - agricultural: farmland, agricultural plots
   - undeveloped: open plots, land parcels

5. Listing type classification:
   - sale: properties for purchase
   - rent: properties for lease/rental
   - development_partnership: joint ventures, development projects

6. Extract numeric values:
   - Bedrooms (BHK format: 2BHK = 2 bedrooms)
   - Bathrooms
   - Area in square feet (sq ft, sqft, sq.ft)
   - Land size (for plots/agricultural)

7. Extract features as array: ["Parking", "Lift", "Security", "Gym"]

8. Extract amenities as object: {"parking": true, "lift": true, "gym": false}

9. For rental properties, extract:
   - rental_duration (e.g., "Monthly", "Yearly")
   - rental_terms (deposit, agreement period)

10. If ROI or returns mentioned, extract as percentage number

POST TEXT:
{text}

RESPOND WITH VALID JSON ONLY (no markdown, no code blocks):
{
  "title": "Brief property title",
  "description": "Full description",
  "location": "Normalized location",
  "price": 10000000,
  "bedrooms": 3,
  "bathrooms": 2,
  "area": 1500,
  "property_type": "residential",
  "listing_type": "sale",
  "contact_phone": "+919876543210",
  "contact_email": "agent@example.com",
  "contact_name": "Agent Name",
  "features": ["Parking", "Security"],
  "amenities": {"parking": true, "security": true}
}

If any field is missing or unclear, omit it from the JSON. Only include fields with confident values.`;

/**
 * Call K2-Think model for property extraction
 */
export async function extractPropertyWithK2(
  postText: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<ExtractionResult> {
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    // Call ai-reasoning-k2 edge function
    const response = await fetch(`${supabaseUrl}/functions/v1/ai-reasoning-k2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        query: PROPERTY_EXTRACTION_PROMPT.replace('{text}', postText),
        context: {
          task: 'property_extraction',
          source: 'instagram',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      errors.push(`K2-Think API error: ${response.status} - ${errorText}`);
      return { extracted: null, confidence: 0, warnings, errors };
    }

    const data = await response.json();
    const reasoning = data.reasoning || '';

    // Parse JSON from K2-Think response
    // K2-Think might wrap JSON in markdown code blocks, so we need to extract it
    let jsonMatch = reasoning.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    let jsonStr = jsonMatch ? jsonMatch[1] : reasoning;

    // If still not valid JSON, try to find JSON object
    if (!jsonStr.includes('{')) {
      jsonMatch = reasoning.match(/(\{[\s\S]*\})/);
      jsonStr = jsonMatch ? jsonMatch[1] : reasoning;
    }

    let extracted: ExtractedProperty;
    try {
      extracted = JSON.parse(jsonStr);
    } catch (parseError) {
      errors.push(`Failed to parse K2-Think JSON response: ${parseError}`);
      return { extracted: null, confidence: 0, warnings, errors, rawResponse: reasoning };
    }

    // Validate required fields
    if (!extracted.price || extracted.price <= 0) {
      errors.push('Price is required and must be positive');
    }
    if (!extracted.location || extracted.location.trim() === '') {
      errors.push('Location is required');
    }
    if (!extracted.title || extracted.title.trim() === '') {
      warnings.push('Title is missing or empty');
    }

    // Validate property_type
    const validPropertyTypes = ['residential', 'commercial', 'agricultural', 'undeveloped'];
    if (!validPropertyTypes.includes(extracted.property_type)) {
      warnings.push(`Invalid property_type: ${extracted.property_type}, defaulting to residential`);
      extracted.property_type = 'residential';
    }

    // Validate listing_type
    const validListingTypes = ['sale', 'rent', 'development_partnership'];
    if (!validListingTypes.includes(extracted.listing_type)) {
      warnings.push(`Invalid listing_type: ${extracted.listing_type}, defaulting to sale`);
      extracted.listing_type = 'sale';
    }

    // Calculate confidence based on extracted fields
    let confidence = 0.5; // Base confidence
    if (extracted.price > 0) confidence += 0.2;
    if (extracted.location) confidence += 0.1;
    if (extracted.bedrooms) confidence += 0.05;
    if (extracted.area) confidence += 0.05;
    if (extracted.contact_phone) confidence += 0.1;

    return {
      extracted,
      confidence: Math.min(confidence, 1.0),
      warnings,
      errors,
      rawResponse: reasoning,
    };
  } catch (error) {
    errors.push(`K2-Think extraction failed: ${error instanceof Error ? error.message : String(error)}`);
    return { extracted: null, confidence: 0, warnings, errors };
  }
}

/**
 * Batch extract properties from multiple Instagram posts
 */
export async function batchExtractProperties(
  posts: Array<{ text: string; url?: string; handle?: string }>,
  supabaseUrl: string,
  supabaseKey: string
): Promise<ExtractionResult[]> {
  const results: ExtractionResult[] = [];

  // Process sequentially to respect rate limits (5 req/min for K2-Think)
  for (const post of posts) {
    const result = await extractPropertyWithK2(post.text, supabaseUrl, supabaseKey);
    
    // Add source metadata if extraction succeeded
    if (result.extracted) {
      result.extracted = {
        ...result.extracted,
        // Add source URL and handle to description if available
        description: result.extracted.description || post.text,
      };
    }

    results.push(result);

    // Rate limiting: wait 12 seconds between calls (5 calls per minute)
    if (posts.length > 1) {
      await new Promise(resolve => setTimeout(resolve, 12000));
    }
  }

  return results;
}
