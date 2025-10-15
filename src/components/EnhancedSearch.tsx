
import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Building, X, Sliders } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { searchQuerySchema } from "@/utils/validation/schemas";
import { z } from "zod";

// Common locations in Hyderabad
const popularLocations = [
  "Hitech City", 
  "Gachibowli", 
  "Madhapur",
  "Banjara Hills", 
  "Jubilee Hills",
  "Kondapur",
  "Financial District",
  "Kukatpally",
  "Miyapur",
  "Manikonda"
];

// Popular property types
const propertyTypes = [
  "Apartment",
  "Villa",
  "Plot",
  "Commercial Space",
  "Office Space",
  "Land"
];

interface EnhancedSearchProps {
  className?: string;
  onSearch?: (query: string, filters: any) => void;
  variant?: "hero" | "standard";
  showFilters?: boolean;
}

export const EnhancedSearch = ({ 
  className, 
  onSearch, 
  variant = "standard",
  showFilters = false
}: EnhancedSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([500000, 10000000]); // 5L to 1Cr
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter suggestions based on input
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const locationMatches = popularLocations
      .filter(location => location.toLowerCase().includes(query))
      .map(location => `Property in ${location}`);
      
    const typeMatches = propertyTypes
      .filter(type => type.toLowerCase().includes(query))
      .map(type => `${type} for sale`);
      
    const combinedMatches = [...locationMatches, ...typeMatches];
    setSuggestions(combinedMatches.slice(0, 5)); // Limit to 5 suggestions
  }, [searchQuery]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    try {
      // SECURITY FIX: Validate and sanitize search query before saving
      if (user) {
        try {
          const searchData = {
            query: searchQuery,
            user_id: user.id,
            location: searchQuery.includes("in") ? searchQuery.split("in")[1]?.trim() : null,
            property_type: 
              searchQuery.toLowerCase().includes("apartment") ? "residential" as const :
              searchQuery.toLowerCase().includes("commercial") ? "commercial" as const :
              searchQuery.toLowerCase().includes("land") ? "undeveloped" as const : null
          };
          
          searchQuerySchema.parse(searchData);
          
          await supabase.from("search_queries").insert(searchData);
        } catch (validationError) {
          if (validationError instanceof z.ZodError) {
            console.error("Validation error:", validationError.errors);
            toast({
              title: "Invalid Search",
              description: validationError.errors[0]?.message || "Search query is invalid",
              variant: "destructive",
            });
            return;
          }
          throw validationError;
        }
      }

      // Build query parameters
      const searchParams = new URLSearchParams();
      searchParams.append('q', searchQuery);
      
      if (propertyTypeFilter) {
        searchParams.append('type', propertyTypeFilter);
      }
      
      if (showAdvancedFilters) {
        searchParams.append('minPrice', priceRange[0].toString());
        searchParams.append('maxPrice', priceRange[1].toString());
      }
      
      // Navigate to properties page with search query and filters
      navigate({
        pathname: '/properties',
        search: searchParams.toString()
      });
      
      if (onSearch) {
        onSearch(searchQuery, {
          propertyType: propertyTypeFilter,
          priceRange,
        });
      }
      
      toast({
        title: "Search",
        description: `Searching for: ${searchQuery}`,
      });
    } catch (error) {
      console.error("Error saving search query:", error);
      // Still navigate to search results even if saving fails
      navigate({
        pathname: '/properties',
        search: `?q=${encodeURIComponent(searchQuery)}`
      });
      
      toast({
        title: "Search",
        description: `Searching for: ${searchQuery}`,
      });
    } finally {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const clearSearch = () => {
    setSearchQuery("");
    setPropertyTypeFilter(null);
    setPriceRange([500000, 10000000]);
  };

  return (
    <div 
      ref={searchRef} 
      className={cn(
        "relative w-full max-w-3xl mx-auto",
        variant === "hero" ? "animate-fade-in delay-300" : "",
        className
      )}
    >
      <form 
        onSubmit={handleSearch} 
        className={cn(
          "flex items-center bg-white rounded-lg shadow-lg border border-gray-200", 
          variant === "hero" ? "backdrop-blur-md p-2" : "p-1",
          showAdvancedFilters ? "rounded-b-none" : ""
        )}
        role="search"
      >
        <div className="relative flex-1 flex items-center">
          <Search className="h-5 w-5 text-gray-400 ml-2" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search by location, property type, or keywords..."
            className="flex-1 p-2 outline-none text-gray-600 bg-transparent w-full"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            aria-label="Search properties"
          />
          {searchQuery && (
            <button 
              type="button" 
              className="p-1 hover:bg-gray-100 rounded-full"
              onClick={clearSearch}
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
        
        {showFilters && (
          <button 
            type="button"
            className="p-2 text-gray-500 hover:text-primary border-l border-gray-200"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            aria-expanded={showAdvancedFilters}
            aria-label="Toggle advanced filters"
          >
            <Sliders className="h-5 w-5" />
          </button>
        )}
        
        <button 
          type="submit"
          className={cn(
            "text-white px-6 py-2 rounded-md transition-colors shadow-lg hover:shadow-primary/20",
            variant === "hero" 
              ? "bg-accent hover:bg-accent/90 btn-hover-effect" 
              : "bg-primary hover:bg-primary/90"
          )}
          aria-label="Search properties"
        >
          Search
        </button>
      </form>
      
      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 bg-white rounded-b-lg shadow-lg border-t-0 border border-gray-200 mt-0">
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li key={index}>
                <button
                  type="button"
                  className="flex w-full items-center px-4 py-2 text-left hover:bg-gray-50 text-gray-700"
                  onClick={() => selectSuggestion(suggestion)}
                >
                  {suggestion.includes("in") ? (
                    <MapPin className="h-4 w-4 text-primary mr-2" />
                  ) : (
                    <Building className="h-4 w-4 text-primary mr-2" />
                  )}
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Advanced filters dropdown */}
      {showAdvancedFilters && showFilters && (
        <div className="absolute z-40 top-full left-0 right-0 bg-white rounded-b-lg shadow-lg border-t-0 border border-gray-200 p-4 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <div className="flex flex-wrap gap-2">
                {["Residential", "Commercial", "Land"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={cn(
                      "px-3 py-1 text-xs rounded-full border",
                      propertyTypeFilter === type.toLowerCase()
                        ? "bg-primary text-white border-primary"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    )}
                    onClick={() => {
                      setPropertyTypeFilter(
                        propertyTypeFilter === type.toLowerCase() ? null : type.toLowerCase()
                      );
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </label>
              <div className="px-2">
                <div className="h-2 bg-gray-200 rounded-full mt-2 relative">
                  <div
                    className="absolute h-2 bg-primary rounded-full"
                    style={{
                      left: `${(priceRange[0] / 10000000) * 100}%`,
                      right: `${100 - (priceRange[1] / 10000000) * 100}%`
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>₹5L</span>
                  <span>₹1Cr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
