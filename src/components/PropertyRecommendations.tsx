
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/PropertyCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";

export const PropertyRecommendations = () => {
  const [recommendedProperties, setRecommendedProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch for property recommendations
    const fetchRecommendations = async () => {
      setIsLoading(true);
      // In a real implementation, this would be a call to your recommendation API
      setTimeout(() => {
        const mockRecommendations = [
          {
            id: "rec-1",
            title: "Modern Apartment with Garden View",
            location: "Financial District, Hyderabad",
            price: "₹85L",
            bedrooms: 2,
            bathrooms: 2,
            area: "1850 sq.ft",
            image: "/placeholder.svg",
          },
          {
            id: "rec-2",
            title: "Spacious Penthouse with Rooftop",
            location: "Gachibowli, Hyderabad",
            price: "₹2.1Cr",
            bedrooms: 3,
            bathrooms: 3,
            area: "3200 sq.ft",
            image: "/placeholder.svg",
          },
          {
            id: "rec-3",
            title: "Cozy Studio Apartment near Tech Hub",
            location: "HITEC City, Hyderabad",
            price: "₹45L",
            bedrooms: 1,
            bathrooms: 1,
            area: "650 sq.ft",
            image: "/placeholder.svg",
          },
        ];
        setRecommendedProperties(mockRecommendations);
        setIsLoading(false);
      }, 1000);
    };

    fetchRecommendations();
  }, []);

  const trendingProperties = [
    {
      id: "trend-1",
      title: "Waterfront Villa with Private Beach",
      location: "Gandipet Lake, Hyderabad",
      price: "₹5.2Cr",
      bedrooms: 5,
      bathrooms: 6,
      area: "7500 sq.ft",
      image: "/placeholder.svg",
    },
    {
      id: "trend-2",
      title: "Luxury Apartment with City Views",
      location: "Madhapur, Hyderabad",
      price: "₹1.7Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "2800 sq.ft",
      image: "/placeholder.svg",
    },
    {
      id: "trend-3",
      title: "Smart Home with Home Office",
      location: "Kondapur, Hyderabad",
      price: "₹1.2Cr",
      bedrooms: 3,
      bathrooms: 2,
      area: "2100 sq.ft",
      image: "/placeholder.svg",
    },
  ];

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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {recommendedProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="trending" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {trendingProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
