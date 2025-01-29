import { Search } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
    // TODO: Implement search functionality
    toast({
      title: "Search",
      description: `Searching for: ${searchQuery}`,
    });
  };

  return (
    <section className="relative bg-primary py-20 overflow-hidden" role="banner">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70">
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:20px_20px]" aria-hidden="true" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl" tabIndex={0}>
            Connecting Property Owners with the Right Community
          </h1>
          <p className="mt-3 max-w-md mx-auto text-lg text-gray-200 sm:text-xl md:mt-5 md:max-w-3xl" tabIndex={0}>
            Find your perfect space in Hyderabad while being part of a thriving startup ecosystem. Direct connections, transparent transactions.
          </p>
          <div className="mt-10 max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="flex items-center bg-white rounded-lg shadow-lg p-2" role="search">
              <Search className="h-5 w-5 text-gray-400 ml-2" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search by location, property type, or keywords..."
                className="flex-1 p-2 outline-none text-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search properties"
              />
              <button 
                type="submit"
                className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-md transition-colors"
                aria-label="Search properties"
              >
                Search
              </button>
            </form>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              className="bg-white text-primary px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
              onClick={() => document.getElementById('property-form')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="List your property"
            >
              List Your Property
            </button>
            <button 
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors"
              onClick={() => document.getElementById('property-form')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="Join startup community"
            >
              Join Startup Community
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};