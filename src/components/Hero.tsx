
import { Search } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AbstractCitySkyline } from "./3D/AbstractCitySkyline";

export const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Search",
      description: `Searching for: ${searchQuery}`,
    });
  };

  return (
    <section className="relative py-20 md:py-28 lg:py-32 overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6]" role="banner">
      {/* Background with overlay and 3D cityscape */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70">
        <div className="absolute inset-0 bg-grid-white/[0.15] bg-[size:20px_20px]" aria-hidden="true" />
        {/* Abstract 3D Visualization */}
        <div className="absolute inset-0 opacity-60">
          <AbstractCitySkyline />
        </div>
        {/* Colorful gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#8B5CF6]/20 via-transparent to-[#EC4899]/20 mix-blend-overlay"></div>
        {/* Animated particles or shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white/10 backdrop-blur-sm animate-pulse-slow"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 5 + 3}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block bg-gradient-to-r from-[#9b87f5] to-[#c4b8fa] text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6 animate-fade-in shadow-lg backdrop-blur-sm">
            Excellence in Real Estate 🏡
          </span>
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl max-w-5xl mx-auto leading-tight animate-fade-in text-gradient mb-2" tabIndex={0}>
            Revolutionizing Real Estate & <span className="text-gradient-accent">Community Building</span> in India
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-100 sm:text-xl md:mt-5 md:max-w-3xl animate-fade-in delay-150 bg-black/10 backdrop-blur-sm py-2 px-4 rounded-lg inline-block" tabIndex={0}>
            Direct connections, transparent transactions, and a vibrant ecosystem of property owners, buyers, and startups in Hyderabad.
          </p>
          
          {/* Search Bar */}
          <div className="mt-10 max-w-xl mx-auto animate-fade-in delay-300">
            <form onSubmit={handleSearch} className="flex items-center bg-white/95 backdrop-blur-md rounded-lg shadow-xl p-2 border border-white/20" role="search">
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
                className="bg-gradient-to-r from-[#9b87f5] to-[#7a63f5] hover:from-[#8875f0] hover:to-[#6a53f0] text-white px-6 py-2 rounded-md transition-colors btn-hover-effect"
                aria-label="Search properties"
              >
                Search
              </button>
            </form>
          </div>
          
          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in delay-450">
            <button 
              className="bg-white text-primary px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg border border-white/20"
              onClick={() => document.getElementById('property-form')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="List your property"
            >
              List Your Property
            </button>
            <button 
              className="bg-transparent border-2 border-white/70 text-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              onClick={() => document.getElementById('property-form')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="Join startup community"
            >
              Join Our Community
            </button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16 animate-fade-in delay-600">
            <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="font-heading font-bold text-3xl md:text-4xl text-white">10+</span>
              <span className="text-gray-200 text-sm md:text-base">Years of Service</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="font-heading font-bold text-3xl md:text-4xl text-white">₹200Cr+</span>
              <span className="text-gray-200 text-sm md:text-base">Transactions</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="font-heading font-bold text-3xl md:text-4xl text-white">180+</span>
              <span className="text-gray-200 text-sm md:text-base">Successful Deals</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
