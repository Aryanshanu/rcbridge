import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Search properties database based on user criteria
 */
/**
 * Sanitize location input to prevent wildcard injection
 */
function sanitizeLocation(location: string): string {
  return location
    .replace(/[%_]/g, '') // Remove SQL wildcards
    .trim()
    .substring(0, 100); // Length limit
}

export async function searchPropertiesDatabase(args: {
  budget_min?: number;
  budget_max?: number;
  location?: string;
  property_type?: string;
  min_area?: number;
}): Promise<string> {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let query = supabase
      .from('properties')
      .select('title, price, location, area, bedrooms, bathrooms, property_type, listing_type, features')
      .eq('status', 'available');

    // Apply filters with sanitization
    if (args.budget_min) {
      query = query.gte('price', args.budget_min);
    }
    if (args.budget_max) {
      query = query.lte('price', args.budget_max);
    }
    if (args.location) {
      const safeLocation = sanitizeLocation(args.location);
      if (safeLocation.length > 0) {
        query = query.ilike('location', `%${safeLocation}%`);
      }
    }
    if (args.property_type) {
      query = query.eq('property_type', args.property_type);
    }
    if (args.min_area) {
      query = query.gte('area', args.min_area);
    }

    // Limit results
    query = query.limit(5);

    const { data: properties, error } = await query;

    if (error) {
      console.error('Database search error:', error);
      return `Unable to search database at this time. Error: ${error.message}`;
    }

    if (!properties || properties.length === 0) {
      return `No properties found matching your criteria. Try:
- Expanding your budget range
- Considering nearby areas
- Adjusting property type
I can help you refine your search or connect you with our team for personalized assistance.`;
    }

    // Format results
    const formattedResults = properties.map((p, index) => {
      const priceInLakhs = (p.price / 100000).toFixed(2);
      return `
${index + 1}. ${p.title}
   📍 Location: ${p.location}
   💰 Price: ₹${priceInLakhs} Lakhs
   ${p.area ? `📐 Area: ${p.area} sq ft` : ''}
   ${p.bedrooms ? `🛏️ ${p.bedrooms} BHK` : ''}
   ${p.listing_type ? `📋 ${p.listing_type === 'sale' ? 'For Sale' : 'For Rent'}` : ''}
   ${p.features && p.features.length > 0 ? `✨ Features: ${p.features.slice(0, 3).join(', ')}` : ''}
      `.trim();
    }).join('\n\n');

    return `Found ${properties.length} matching ${properties.length === 1 ? 'property' : 'properties'}:

${formattedResults}

Would you like more details on any of these properties? I can also help you schedule a viewing or connect you with our property consultant.`;

  } catch (error) {
    console.error('Property search error:', error);
    return 'Unable to search properties at this moment. Please try again or contact our team directly.';
  }
}
