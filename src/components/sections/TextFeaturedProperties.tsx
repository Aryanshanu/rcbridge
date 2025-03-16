
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Calculator, Building } from "lucide-react";
import { InvestmentCalculator } from "@/components/InvestmentCalculator";
import { AdvancedSearch } from "@/components/AdvancedSearch";
import { TextPropertyCard } from "@/components/TextPropertyCard";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const TextFeaturedProperties = () => {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  
  const featuredProperties = [
    {
      id: "prop-1",
      title: "Luxury Villa in Banjara Hills",
      location: "Banjara Hills, Hyderabad",
      price: "₹2.5Cr",
      bedrooms: 4,
      bathrooms: 4,
      area: "4500 sq.ft",
    },
    {
      id: "prop-2",
      title: "Modern Office Space in HITEC City",
      location: "HITEC City, Hyderabad",
      price: "₹1.8Cr",
      bedrooms: 0,
      bathrooms: 4,
      area: "3000 sq.ft",
    },
    {
      id: "prop-3",
      title: "Premium Apartment in Jubilee Hills",
      location: "Jubilee Hills, Hyderabad",
      price: "₹95L",
      bedrooms: 3,
      bathrooms: 3,
      area: "2200 sq.ft",
    },
  ];

  const recommendedProperties = [
    {
      id: "rec-1",
      title: "Modern Apartment with Garden View",
      location: "Financial District, Hyderabad",
      price: "₹85L",
      bedrooms: 2,
      bathrooms: 2,
      area: "1850 sq.ft",
    },
    {
      id: "rec-2",
      title: "Spacious Penthouse with Rooftop",
      location: "Gachibowli, Hyderabad",
      price: "₹2.1Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "3200 sq.ft",
    },
    {
      id: "rec-3",
      title: "Cozy Studio Apartment near Tech Hub",
      location: "HITEC City, Hyderabad",
      price: "₹45L",
      bedrooms: 1,
      bathrooms: 1,
      area: "650 sq.ft",
    },
  ];

  const trendingProperties = [
    {
      id: "trend-1",
      title: "Waterfront Villa with Private Beach",
      location: "Gandipet Lake, Hyderabad",
      price: "₹5.2Cr",
      bedrooms: 5,
      bathrooms: 6,
      area: "7500 sq.ft",
    },
    {
      id: "trend-2",
      title: "Luxury Apartment with City Views",
      location: "Madhapur, Hyderabad",
      price: "₹1.7Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "2800 sq.ft",
    },
    {
      id: "trend-3",
      title: "Smart Home with Home Office",
      location: "Kondapur, Hyderabad",
      price: "₹1.2Cr",
      bedrooms: 3,
      bathrooms: 2,
      area: "2100 sq.ft",
    },
  ];

  return (
    <section className="mb-12 sm:mb-16">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Properties</h2>
        <p className="mt-2 text-base sm:text-lg text-gray-600">
          Discover our hand-picked premium listings
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          >
            {showAdvancedSearch ? 'Hide' : 'Show'} Advanced Search
            {showAdvancedSearch ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {showAdvancedSearch && <AdvancedSearch />}
      
      {/* Always visible Investment Calculator */}
      <div className="mb-8">
        <Card className="p-4 sm:p-6 bg-gray-50">
          <div className="flex items-center mb-4">
            <Calculator className="h-5 w-5 mr-2 text-primary" />
            <h3 className="text-xl font-bold">Investment Calculator</h3>
          </div>
          <InvestmentCalculator />
        </Card>
      </div>
      
      {/* Featured Properties */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {featuredProperties.map((property) => (
          <TextPropertyCard key={property.id} property={property} />
        ))}
      </div>
      
      {/* Discover More Properties Section */}
      <div className="mt-12">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Building className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold text-center">Discover More Properties</h3>
        </div>
        
        <Tabs defaultValue="recommended" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="recommended">Recommended For You</TabsTrigger>
            <TabsTrigger value="trending">Trending Now</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommended" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recommendedProperties.map((property) => (
                <TextPropertyCard key={property.id} property={property} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="trending" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {trendingProperties.map((property) => (
                <TextPropertyCard key={property.id} property={property} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="text-center mt-8">
        <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium">
          View All Properties
        </Button>
      </div>
    </section>
  );
};
