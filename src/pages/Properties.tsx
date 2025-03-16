
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/SEO";
import { CallToAction } from "@/components/sections/CallToAction";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { PropertiesTab } from "@/components/tabs/PropertiesTab";
import { Home, Building, Filter, Search, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Properties = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPropertyId = location.state?.selectedPropertyId;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  
  const quickFilters = [
    { id: "location", label: "Hyderabad", icon: <MapPin className="h-4 w-4 mr-1 text-primary" />, value: "hyderabad" },
    { id: "type", label: "Apartments", icon: <Building className="h-4 w-4 mr-1 text-primary" />, value: "apartment" },
    { id: "price", label: "₹50L - ₹1Cr", value: "50L-1Cr" },
    { id: "bedrooms", label: "3+ Bedrooms", value: "3+" },
  ];

  useEffect(() => {
    if (selectedPropertyId) {
      console.log("Selected property ID:", selectedPropertyId);
      
      const propertiesSection = document.getElementById('properties-section');
      if (propertiesSection) {
        propertiesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }

    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchQuery(query);
      applySearch(query);
    }
  }, [selectedPropertyId, location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applySearch(searchQuery);
  };

  const applySearch = (query: string) => {
    if (!query.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    navigate({
      pathname: '/properties',
      search: `?q=${encodeURIComponent(query)}`
    });

    const newFilters = { ...activeFilters, searchQuery: query };
    setActiveFilters(newFilters);
    
    toast.success(`Searching for "${query}"`);
    console.log("Applying search filter:", newFilters);
  };

  const toggleQuickFilter = (filter: typeof quickFilters[0]) => {
    const newFilters = { ...activeFilters };
    
    if (newFilters[filter.id] === filter.value) {
      delete newFilters[filter.id];
      toast.info(`Removed filter: ${filter.label}`);
    } else {
      newFilters[filter.id] = filter.value;
      toast.success(`Applied filter: ${filter.label}`);
    }
    
    setActiveFilters(newFilters);
    console.log("Updated filters:", newFilters);
  };

  const applyAllFilters = () => {
    toast.success("All filters applied");
    console.log("Applying all filters:", activeFilters);
  };

  const isFilterActive = (filterId: string, value: string) => {
    return activeFilters[filterId] === value;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white w-full max-w-full">
      <SEO title="Properties | RC Bridge" description="Explore our selection of premium properties" />
      <Navbar />
      
      <div className="bg-gradient-to-r from-primary-700 to-primary/90 text-white py-16 lg:py-24 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white opacity-10"></div>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-gradient">
              Discover Your Perfect Property
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-8">
              Browse through our exclusive collection of premium properties in Hyderabad
            </p>
            
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl shadow-lg border border-white/20 max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input 
                    type="text" 
                    placeholder="Search by location, type, amenities..." 
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-primary-700 text-gray-800"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" className="bg-primary-700 hover:bg-primary-800 text-white py-3 px-6">
                  Search
                </Button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" fill="#ffffff" preserveAspectRatio="none">
            <path d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
          </svg>
        </div>
      </div>
      
      <main className="w-full max-w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-8 sm:py-12">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center hover:text-primary">
                <Home className="h-4 w-4 mr-1" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center font-medium">
                <Building className="h-4 w-4 mr-1 text-primary" />
                Properties
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex flex-wrap gap-3 mb-8">
          <span className="text-sm font-medium text-gray-600 self-center">Quick filters:</span>
          {quickFilters.map((filter) => (
            <Button 
              key={filter.id}
              variant="outline" 
              size="sm" 
              className={`rounded-full ${
                isFilterActive(filter.id, filter.value) 
                  ? "bg-primary text-white border-primary hover:bg-primary/90" 
                  : "bg-gray-50 border border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => toggleQuickFilter(filter)}
            >
              {filter.icon}
              {filter.label}
            </Button>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full text-primary bg-primary/5 border border-primary/20 hover:bg-primary/10"
            onClick={applyAllFilters}
          >
            <Filter className="h-4 w-4 mr-1" />
            More Filters
          </Button>
        </div>
        
        <section id="properties-section" className="mb-16 w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-semibold text-gray-900 mb-2">
                Our Properties
              </h2>
              <p className="text-gray-600">
                Find your dream property from our carefully curated selection
              </p>
              {Object.keys(activeFilters).length > 0 && (
                <div className="mt-2 text-sm text-primary">
                  Active filters: {Object.entries(activeFilters).map(([key, value]) => (
                    <span key={key} className="inline-flex items-center bg-primary/10 text-primary rounded-full px-2 py-1 text-xs mr-2">
                      {key}: {value}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <PropertiesTab selectedPropertyId={selectedPropertyId} filters={activeFilters} />
        </section>
      </main>
      
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Properties;
