
import { Search } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AbstractCitySkyline } from "./3D/AbstractCitySkyline";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

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
      // Save search query to Supabase
      await supabase.from("search_queries").insert({
        query: searchQuery,
        user_id: user?.id || null,
        location: searchQuery.includes("in") ? searchQuery.split("in")[1]?.trim() : null,
        property_type: 
          searchQuery.toLowerCase().includes("apartment") ? "residential" :
          searchQuery.toLowerCase().includes("commercial") ? "commercial" :
          searchQuery.toLowerCase().includes("land") ? "undeveloped" : null
      });

      toast({
        title: "Search",
        description: `Searching for: ${searchQuery}`,
      });
    } catch (error) {
      console.error("Error saving search query:", error);
      // Still show search toast even if saving fails
      toast({
        title: "Search",
        description: `Searching for: ${searchQuery}`,
      });
    }
  };

  return (
    <section className="relative bg-primary py-20 md:py-28 lg:py-32 overflow-hidden" role="banner">
      {/* Background with overlay and 3D cityscape */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70">
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:20px_20px]" aria-hidden="true" />
        {/* Abstract 3D Visualization */}
        <div className="absolute inset-0 opacity-40">
          <AbstractCitySkyline />
        </div>
      </div>
      
      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block bg-accent/90 text-white text-sm font-medium px-3 py-1 rounded-full mb-4 animate-fade-in shadow-md backdrop-blur-sm">
            Excellence in Real Estate 🏡
          </span>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl max-w-5xl mx-auto leading-tight animate-fade-in backdrop-blur-[1px]" tabIndex={0}>
            Revolutionizing Real Estate & <span className="text-accent animate-pulse">Community Building</span> in India
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-200 sm:text-xl md:mt-5 md:max-w-3xl animate-fade-in delay-150 backdrop-blur-[1px]" tabIndex={0}>
            Direct connections, transparent transactions, and a vibrant ecosystem of property owners, buyers, and startups in Hyderabad.
          </p>
          
          {/* Search Bar */}
          <div className="mt-10 max-w-xl mx-auto animate-fade-in delay-300">
            <form onSubmit={handleSearch} className="flex items-center bg-white/95 backdrop-blur-md rounded-lg shadow-2xl p-2 border border-white/30" role="search">
              <Search className="h-5 w-5 text-gray-400 ml-2" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search by location, property type, or keywords..."
                className="flex-1 p-2 outline-none text-gray-600 bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search properties"
              />
              <button 
                type="submit"
                className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-md transition-colors btn-hover-effect shadow-lg hover:shadow-accent/20"
                aria-label="Search properties"
              >
                Search
              </button>
            </form>
          </div>
          
          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in delay-450">
            <button 
              className="bg-white text-primary px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-white/20"
              onClick={() => document.getElementById('property-form')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="List your property"
            >
              List Your Property
            </button>
            <button 
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-white/10"
              onClick={() => document.getElementById('property-form')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="Join startup community"
            >
              Join Our Community
            </button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16 animate-fade-in delay-600">
            <div className="flex flex-col items-center text-white bg-white/10 px-6 py-4 rounded-lg backdrop-blur-sm shadow-lg">
              <span className="font-display font-bold text-3xl md:text-4xl">10+</span>
              <span className="text-gray-200 text-sm md:text-base">Years of Service</span>
            </div>
            <div className="flex flex-col items-center text-white bg-white/10 px-6 py-4 rounded-lg backdrop-blur-sm shadow-lg">
              <span className="font-display font-bold text-3xl md:text-4xl">₹200Cr+</span>
              <span className="text-gray-200 text-sm md:text-base">Transactions</span>
            </div>
            <div className="flex flex-col items-center text-white bg-white/10 px-6 py-4 rounded-lg backdrop-blur-sm shadow-lg">
              <span className="font-display font-bold text-3xl md:text-4xl">180+</span>
              <span className="text-gray-200 text-sm md:text-base">Successful Deals</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
