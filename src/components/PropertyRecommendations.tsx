
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/PropertyCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

export const PropertyRecommendations = () => {
  const [recommendedProperties, setRecommendedProperties] = useState<any[]>([]);
  const [trendingProperties, setTrendingProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          console.log("Fetched properties for recommendations:", data);
          
          // Format the properties for display
          const formattedProperties = data.map(property => ({
            id: property.id,
            title: property.title || "Untitled Property",
            location: property.location || "Unknown Location",
            price: formatPrice(property.price, property.listing_type || 'sale'),
            bedrooms: property.bedrooms || 0,
            bathrooms: property.bathrooms || 0,
            area: property.area ? `${property.area} sq.ft` : "Area not specified",
            image: "/placeholder.svg", // Default image
          }));
          
          // Get recommended properties - random 3
          const shuffled = [...formattedProperties].sort(() => 0.5 - Math.random());
          setRecommendedProperties(shuffled.slice(0, 3));
          
          // Get trending properties - by price (highest)
          const trending = [...formattedProperties].sort((a, b) => {
            const priceA = extractPriceValue(a.price);
            const priceB = extractPriceValue(b.price);
            return priceB - priceA;
          });
          setTrendingProperties(trending.slice(0, 3));
        } else {
          console.log("No properties found for recommendations");
          // Set empty arrays if no data
          setRecommendedProperties([]);
          setTrendingProperties([]);
        }
      } catch (error) {
        console.error('Error fetching properties for recommendations:', error);
        toast({
          title: "Error",
          description: "Failed to load property recommendations. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, [toast]);
  
  const formatPrice = (price: number, listingType: string) => {
    if (!price) return "Price not available";
    
    if (listingType === 'rent') {
      return `₹${price.toLocaleString('en-IN')}/month`;
    }
    
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(0)}L`;
    } else {
      return `₹${price.toLocaleString('en-IN')}`;
    }
  };
  
  const extractPriceValue = (priceString: string) => {
    // Extract numeric value from price strings like "₹2.5Cr" or "₹25000/month"
    if (!priceString || priceString === "Price not available") return 0;
    const numericPart = priceString.replace(/[^\d.]/g, '');
    return parseFloat(numericPart) || 0;
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold text-center">Discover More Properties</h3>
      </div>
      
      <Tabs defaultValue="recommended" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="recommended">Recommended For You</TabsTrigger>
          <TabsTrigger value="trending">Trending Now</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recommended" className="mt-0">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 animate-pulse h-64 rounded-lg" />
              ))}
            </div>
          ) : recommendedProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {recommendedProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No recommended properties available at the moment.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="trending" className="mt-0">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 animate-pulse h-64 rounded-lg" />
              ))}
            </div>
          ) : trendingProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {trendingProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No trending properties available at the moment.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="text-center mt-6">
        <Link to="/properties">
          <Button 
            className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-6 py-2 rounded-md font-medium"
          >
            View All Properties
          </Button>
        </Link>
      </div>
    </div>
  );
};
