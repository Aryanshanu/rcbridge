// Tavily Search API utility for Deno edge functions
// Provides AI-optimized search results with structured JSON responses

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  score?: number;
}

interface CachedResults {
  results: SearchResult[];
  timestamp: number;
}

// In-memory cache for search results (1 hour TTL)
const searchCache = new Map<string, CachedResults>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds
const SEARCH_TIMEOUT = 8000; // 8 seconds (Tavily can be slower but more thorough)

// Clean up old cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, cached] of searchCache.entries()) {
    if (now - cached.timestamp > CACHE_TTL) {
      searchCache.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

/**
 * Normalize search query for caching
 */
function normalizeQuery(query: string): string {
  return query.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Search using Tavily API and return results
 */
export async function searchTavily(query: string): Promise<SearchResult[]> {
  const normalizedQuery = normalizeQuery(query);
  
  // Check cache first
  const cached = searchCache.get(normalizedQuery);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    console.log(`[Tavily] Cache hit for query: ${query}`);
    return cached.results;
  }
  
  console.log(`[Tavily] Searching for: ${query}`);
  
  const TAVILY_API_KEY = Deno.env.get('TAVILY_API_KEY');
  if (!TAVILY_API_KEY) {
    console.error('[Tavily] API key not configured');
    return [];
  }
  
  try {
    // Add timeout to search request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SEARCH_TIMEOUT);
    
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: query,
        search_depth: 'basic', // 'basic' is faster, 'advanced' is more thorough
        include_answer: false, // We want raw results, not AI summary
        max_results: 5,
        include_domains: [], // Optional: restrict to specific domains
        exclude_domains: [], // Optional: exclude specific domains
      }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Tavily] HTTP error: ${response.status} - ${errorText}`);
      return [];
    }
    
    const data = await response.json();
    
    // Parse Tavily response
    const results: SearchResult[] = [];
    if (data.results && Array.isArray(data.results)) {
      for (const result of data.results) {
        if (result.url && result.title) {
          results.push({
            title: result.title,
            url: result.url,
            snippet: result.content || result.raw_content || '',
            score: result.score || 0,
          });
        }
      }
    }
    
    console.log(`[Tavily] Found ${results.length} results for: ${query}`);
    console.log(`[Tavily] Response time: ${data.response_time || 'unknown'}s`);
    
    // Cache the results
    searchCache.set(normalizedQuery, {
      results,
      timestamp: Date.now(),
    });
    
    return results;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('[Tavily] Search timeout after 8 seconds');
      } else {
        console.error('[Tavily] Search error:', error.message);
      }
    }
    return [];
  }
}

/**
 * Format search results for LLM consumption
 */
export function formatSearchResults(query: string, results: SearchResult[]): string {
  if (results.length === 0) {
    return `Search for "${query}" returned no results. Please use your existing knowledge and recommend contacting RC Bridge directly for the most current information at aryan@rcbridge.co.`;
  }
  
  const formattedResults = results.map((result, index) => {
    const parts = [`${index + 1}. ${result.title}`];
    if (result.snippet) {
      // Limit snippet to 200 characters for conciseness
      const snippet = result.snippet.length > 200 
        ? result.snippet.slice(0, 200) + '...' 
        : result.snippet;
      parts.push(`   ${snippet}`);
    }
    if (result.score !== undefined) {
      parts.push(`   Relevance: ${(result.score * 100).toFixed(0)}%`);
    }
    parts.push(`   Source: ${result.url}`);
    return parts.join('\n');
  }).join('\n\n');
  
  return `Search Results for "${query}":

${formattedResults}

Use these results to provide current, accurate information. Cite sources when relevant (e.g., "According to recent data from [source]..."). Integrate the information naturally into your response.`;
}
