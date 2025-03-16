
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Calculator, Building, Home, TrendingUp, Heart } from "lucide-react";
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
    {
      id: "prop-4",
      title: "Spacious Bungalow with Garden",
      location: "Gachibowli, Hyderabad",
      price: "₹3.2Cr",
      bedrooms: 5,
      bathrooms: 5,
      area: "5500 sq.ft",
    },
    {
      id: "prop-5",
      title: "Retail Space in Shopping Mall",
      location: "Kukatpally, Hyderabad",
      price: "₹1.2Cr",
      bedrooms: 0,
      bathrooms: 2,
      area: "1800 sq.ft",
    },
    {
      id: "prop-6",
      title: "Cozy 2BHK Near Metro Station",
      location: "Miyapur, Hyderabad",
      price: "₹65L",
      bedrooms: 2,
      bathrooms: 2,
      area: "1200 sq.ft",
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
    {
      id: "rec-4",
      title: "Family Home with Backyard",
      location: "Kondapur, Hyderabad",
      price: "₹1.4Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "2400 sq.ft",
    },
    {
      id: "rec-5",
      title: "Budget Apartment for First-time Buyers",
      location: "Uppal, Hyderabad",
      price: "₹38L",
      bedrooms: 2,
      bathrooms: 1,
      area: "950 sq.ft",
    },
    {
      id: "rec-6",
      title: "Investment Property with Good Rental Yield",
      location: "Manikonda, Hyderabad",
      price: "₹55L",
      bedrooms: 2,
      bathrooms: 2,
      area: "1100 sq.ft",
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
    {
      id: "trend-4",
      title: "Heritage Property with Modern Amenities",
      location: "Old City, Hyderabad",
      price: "₹2.8Cr",
      bedrooms: 4,
      bathrooms: 4,
      area: "3800 sq.ft",
    },
    {
      id: "trend-5",
      title: "Premium Office Space with Lake View",
      location: "Hitech City, Hyderabad",
      price: "₹2.2Cr",
      bedrooms: 0,
      bathrooms: 3,
      area: "2600 sq.ft",
    },
    {
      id: "trend-6",
      title: "Modern Minimalist Apartment",
      location: "Financial District, Hyderabad",
      price: "₹1.1Cr",
      bedrooms: 2,
      bathrooms: 2,
      area: "1750 sq.ft",
    },
  ];

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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featuredProperties.map((property) => (
            <TextPropertyCard key={property.id} property={property} />
          ))}
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
        <Button className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-8 py-3 rounded-md font-medium text-lg shadow-md">
          View All Properties
        </Button>
      </div>
    </section>
  );
};
