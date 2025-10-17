// DuckDuckGo search utility for Deno edge functions
// Uses HTML interface to fetch search results

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface CachedResults {
  results: SearchResult[];
  timestamp: number;
}

// In-memory cache for search results (1 hour TTL)
const searchCache = new Map<string, CachedResults>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds
const SEARCH_TIMEOUT = 5000; // 5 seconds

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
 * Parse DuckDuckGo HTML response to extract search results
 */
function parseSearchResults(html: string): SearchResult[] {
  const results: SearchResult[] = [];
  
  try {
    // DuckDuckGo HTML structure uses specific classes for results
    // Pattern: <div class="result__body">...</div>
    const resultPattern = /<div class="result__body">[\s\S]*?<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;
    
    let match;
    while ((match = resultPattern.exec(html)) !== null && results.length < 5) {
      const url = match[1];
      const title = match[2].replace(/<[^>]*>/g, '').trim();
      const snippet = match[3].replace(/<[^>]*>/g, '').trim();
      
      if (url && title && snippet) {
        results.push({
          title: decodeHTMLEntities(title),
          url: decodeHTMLEntities(url),
          snippet: decodeHTMLEntities(snippet)
        });
      }
    }
    
    // Fallback pattern if first one doesn't work
    if (results.length === 0) {
      const altPattern = /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g;
      while ((match = altPattern.exec(html)) !== null && results.length < 5) {
        const url = match[1];
        const title = match[2].replace(/<[^>]*>/g, '').trim();
        
        if (url && title && !url.includes('duckduckgo.com')) {
          results.push({
            title: decodeHTMLEntities(title),
            url: decodeHTMLEntities(url),
            snippet: ''
          });
        }
      }
    }
  } catch (error) {
    console.error('Error parsing search results:', error);
  }
  
  return results;
}

/**
 * Decode common HTML entities
 */
function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
  };
  
  return text.replace(/&[a-z]+;|&#\d+;/g, (match) => entities[match] || match);
}

/**
 * Search DuckDuckGo and return results
 */
export async function searchDuckDuckGo(query: string): Promise<SearchResult[]> {
  const normalizedQuery = normalizeQuery(query);
  
  // Check cache first
  const cached = searchCache.get(normalizedQuery);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    console.log(`[DuckDuckGo] Cache hit for query: ${query}`);
    return cached.results;
  }
  
  console.log(`[DuckDuckGo] Searching for: ${query}`);
  
  try {
    // Use DuckDuckGo HTML interface
    const encodedQuery = encodeURIComponent(query);
    const url = `https://html.duckduckgo.com/html/?q=${encodedQuery}`;
    
    // Add timeout to search request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SEARCH_TIMEOUT);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RCBridge-Bot/1.0; +https://rcbridge.app)',
        'Accept': 'text/html',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`[DuckDuckGo] HTTP error: ${response.status}`);
      return [];
    }
    
    const html = await response.text();
    const results = parseSearchResults(html);
    
    console.log(`[DuckDuckGo] Found ${results.length} results for: ${query}`);
    
    // Cache the results
    searchCache.set(normalizedQuery, {
      results,
      timestamp: Date.now(),
    });
    
    return results;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('[DuckDuckGo] Search timeout');
      } else {
        console.error('[DuckDuckGo] Search error:', error.message);
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
    return `Search for "${query}" returned no results. Please answer using your existing knowledge.`;
  }
  
  const formattedResults = results.map((result, index) => {
    const parts = [`${index + 1}. ${result.title}`];
    if (result.snippet) {
      parts.push(`   ${result.snippet}`);
    }
    parts.push(`   Source: ${result.url}`);
    return parts.join('\n');
  }).join('\n\n');
  
  return `Search Results for "${query}":

${formattedResults}

Use these results to provide current, accurate information. Cite sources when relevant.`;
}
