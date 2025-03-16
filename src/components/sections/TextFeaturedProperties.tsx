
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Calculator, Building, Home, TrendingUp, Heart } from "lucide-react";
import { InvestmentCalculator } from "@/components/InvestmentCalculator";
import { AdvancedSearch } from "@/components/AdvancedSearch";
import { TextPropertyCard } from "@/components/TextPropertyCard";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const TextFeaturedProperties = () => {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showAllProperties, setShowAllProperties] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
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
        
        if (data) {
          // Format the properties for display
          const formattedProperties = data.map(property => ({
            id: property.id,
            title: property.title,
            location: property.location,
            price: formatPrice(property.price, property.listing_type),
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area: `${property.area} sq.ft`,
            description: property.description,
            propertyType: property.property_type,
            listingType: property.listing_type
          }));
          
          setProperties(formattedProperties);
          
          // Set featured properties (first 6)
          setFilteredProperties(formattedProperties.slice(0, showAllProperties ? formattedProperties.length : 6));
          
          // Set recommended (random selection of 6)
          const shuffled = [...formattedProperties].sort(() => 0.5 - Math.random());
          setRecommendedProperties(shuffled.slice(0, 6));
          
          // Set trending (sort by price descending, take 6)
          const trending = [...formattedProperties].sort((a, b) => {
            // Extract numeric part of price for sorting
            const priceA = extractPriceValue(a.price);
            const priceB = extractPriceValue(b.price);
            return priceB - priceA;
          });
          setTrendingProperties(trending.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast({
          title: "Error",
          description: "Failed to load properties. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, [toast]);
  
  const formatPrice = (price: number, listingType: string) => {
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
    const numericPart = priceString.replace(/[^\d.]/g, '');
    return parseFloat(numericPart);
  };
  
  const handleViewAllToggle = () => {
    setShowAllProperties(!showAllProperties);
    setFilteredProperties(properties.slice(0, showAllProperties ? 6 : properties.length));
  };

  return (
    <section className="mb-12 sm:mb-16 p-4 sm:p-6 bg-gray-50 rounded-lg shadow-sm">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Properties</h2>
        <p className="mt-2 text-base sm:text-lg text-gray-600">
          Discover our hand-picked premium listings - text-only for faster browsing
        </p>
      </div>
      
      {/* Always visible Investment Calculator */}
      <div className="mb-8">
        <Card className="p-4 sm:p-6 bg-white border border-gray-200">
          <div className="flex items-center mb-4">
            <Calculator className="h-5 w-5 mr-2 text-[#1e40af]" />
            <h3 className="text-xl font-bold">Investment Calculator</h3>
          </div>
          <InvestmentCalculator />
        </Card>
      </div>
      
      {/* Advanced Search Section - Toggleable */}
      <div className="mb-6">
        <div className="flex justify-center mb-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-[#1e40af] text-[#1e40af]"
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          >
            {showAdvancedSearch ? 'Hide' : 'Show'} Advanced Search
            {showAdvancedSearch ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        {showAdvancedSearch && <AdvancedSearch />}
      </div>
      
      {/* Featured Properties */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Building className="h-5 w-5 text-[#1e40af]" />
          <h3 className="text-xl font-semibold text-center">Featured Properties</h3>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProperties.map((property) => (
              <TextPropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
        
        <div className="mt-6 text-center">
          <Button 
            onClick={handleViewAllToggle} 
            variant="outline" 
            className="border-[#1e40af] text-[#1e40af]"
          >
            {showAllProperties ? "Show Fewer Properties" : "View All Properties"}
          </Button>
        </div>
      </div>
      
      {/* Discover More Properties Section */}
      <div className="mt-12">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Home className="h-5 w-5 text-[#1e40af]" />
          <h3 className="text-xl font-semibold text-center">Discover More Properties</h3>
        </div>
        
        <Tabs defaultValue="recommended" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger 
              value="recommended" 
              className="flex items-center justify-center gap-2 data-[state=active]:bg-[#1e40af] data-[state=active]:text-white"
            >
              <Heart className="h-4 w-4" /> Recommended For You
            </TabsTrigger>
            <TabsTrigger 
              value="trending" 
              className="flex items-center justify-center gap-2 data-[state=active]:bg-[#1e40af] data-[state=active]:text-white"
            >
              <TrendingUp className="h-4 w-4" /> Trending Now
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommended" className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {recommendedProperties.map((property) => (
                  <TextPropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="trending" className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {trendingProperties.map((property) => (
                  <TextPropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="text-center mt-8">
        <Button 
          onClick={handleViewAllToggle}
          className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-8 py-3 rounded-md font-medium text-lg shadow-md"
        >
          {showAllProperties ? "Show Fewer Properties" : "View All Properties"}
        </Button>
      </div>
    </section>
  );
};
