
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AbstractCitySkyline } from "./3D/AbstractCitySkyline";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { EnhancedSearch } from "./EnhancedSearch";

export const Hero = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (query: string, filters: any) => {
    // This is now handled by the EnhancedSearch component
    console.log("Search handled by EnhancedSearch component", { query, filters });
  };

  return (
    <section className="relative bg-primary dark:bg-gray-900 py-20 md:py-28 lg:py-32 overflow-hidden" role="banner">
      {/* Background with overlay and 3D cityscape */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 dark:from-gray-900/95 dark:to-gray-800/90">
        <div className="absolute inset-0 bg-grid-white/[0.1] dark:bg-grid-white/[0.05] bg-[size:20px_20px]" aria-hidden="true" />
        {/* Abstract 3D Visualization */}
        <div className="absolute inset-0 opacity-40 dark:opacity-30">
          <AbstractCitySkyline />
        </div>
      </div>
      
      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block bg-accent/90 dark:bg-accent text-white text-sm font-medium px-3 py-1 rounded-full mb-4 animate-fade-in shadow-md backdrop-blur-sm">
            Excellence in Real Estate 🏡
          </span>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl max-w-5xl mx-auto leading-tight animate-fade-in backdrop-blur-[1px]" tabIndex={0}>
            Revolutionizing Real Estate & <span className="text-accent animate-pulse">Community Building</span> in India
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-200 dark:text-gray-100 sm:text-xl md:mt-5 md:max-w-3xl animate-fade-in delay-150 backdrop-blur-[1px]" tabIndex={0}>
            Direct connections, transparent transactions, and a vibrant ecosystem of property owners, buyers, and startups in Hyderabad.
          </p>
          
          {/* Search Bar - Now using Enhanced Search */}
          <div className="mt-10 max-w-xl mx-auto">
            <EnhancedSearch 
              variant="hero" 
              showFilters={false} 
              onSearch={handleSearch}
            />
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
