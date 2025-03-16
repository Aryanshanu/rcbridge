
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Calculator } from "lucide-react";
import { InvestmentCalculator } from "@/components/InvestmentCalculator";
import { AdvancedSearch } from "@/components/AdvancedSearch";
import { PropertyRecommendations } from "@/components/PropertyRecommendations";
import { TextFeaturedProperties } from "@/components/sections/TextFeaturedProperties";
import { Link } from "react-router-dom";

export const FeaturedProperties = () => {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showInvestmentCalculator, setShowInvestmentCalculator] = useState(false);

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
      
      <TextFeaturedProperties />
      
      <PropertyRecommendations />
      
      <div className="text-center mt-8">
        <Link to="/properties">
          <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium">
            View All Properties
          </Button>
        </Link>
      </div>
    </section>
  );
};
