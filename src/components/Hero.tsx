import { Search } from "lucide-react";

export const Hero = () => {
  return (
    <div className="relative bg-primary py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70">
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:20px_20px]" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            Find Your Perfect Space in Hyderabad
          </h1>
          <p className="mt-3 max-w-md mx-auto text-lg text-gray-200 sm:text-xl md:mt-5 md:max-w-3xl">
            Connect with property owners and join a thriving startup community
          </p>
          <div className="mt-10 max-w-xl mx-auto">
            <div className="flex items-center bg-white rounded-lg shadow-lg p-2">
              <Search className="h-5 w-5 text-gray-400 ml-2" />
              <input
                type="text"
                placeholder="Search by location, property type, or keywords..."
                className="flex-1 p-2 outline-none text-gray-600"
              />
              <button className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-md">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};