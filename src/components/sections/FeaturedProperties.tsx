
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyRecommendations } from "@/components/PropertyRecommendations";
import { AdvancedSearch } from "@/components/AdvancedSearch";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Calculator } from "lucide-react";
import { InvestmentCalculator } from "@/components/InvestmentCalculator";

export const FeaturedProperties = () => {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showInvestmentCalculator, setShowInvestmentCalculator] = useState(false);
  
  const featuredProperties = [
    {
      id: "prop-1",
      title: "Luxury Villa in Banjara Hills",
      location: "Banjara Hills, Hyderabad",
      price: "₹2.5Cr",
      bedrooms: 4,
      bathrooms: 4,
      area: "4500 sq.ft",
      image: "/placeholder.svg",
    },
    {
      id: "prop-2",
      title: "Modern Office Space in HITEC City",
      location: "HITEC City, Hyderabad",
      price: "₹1.8Cr",
      bedrooms: 0,
      bathrooms: 4,
      area: "3000 sq.ft",
      image: "/placeholder.svg",
    },
    {
      id: "prop-3",
      title: "Premium Apartment in Jubilee Hills",
      location: "Jubilee Hills, Hyderabad",
      price: "₹95L",
      bedrooms: 3,
      bathrooms: 3,
      area: "2200 sq.ft",
      image: "/placeholder.svg",
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
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setShowInvestmentCalculator(!showInvestmentCalculator)}
          >
            {showInvestmentCalculator ? 'Hide' : 'Show'} Investment Calculator
            <Calculator className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {showAdvancedSearch && <AdvancedSearch />}
      
      {showInvestmentCalculator && (
        <div className="mb-8">
          <InvestmentCalculator />
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {featuredProperties.map((property) => (
          <PropertyCard key={property.id} {...property} />
        ))}
      </div>
      
      <PropertyRecommendations />
      
      <div className="text-center mt-8">
        <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium">
          View All Properties
        </Button>
      </div>
    </section>
  );
};
