
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/SEO";
import { CallToAction } from "@/components/sections/CallToAction";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { PropertiesTab } from "@/components/tabs/PropertiesTab";
import { Home, Building, Filter, Search, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Properties = () => {
  const location = useLocation();
  const selectedPropertyId = location.state?.selectedPropertyId;
  
  useEffect(() => {
    if (selectedPropertyId) {
      console.log("Selected property ID:", selectedPropertyId);
      
      const propertiesSection = document.getElementById('properties-section');
      if (propertiesSection) {
        propertiesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [selectedPropertyId]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white w-full max-w-full">
      <SEO title="Properties | RC Bridge" description="Explore our selection of premium properties" />
      <Navbar />
      
      {/* Hero Header with Background */}
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
            
            {/* Search bar */}
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl shadow-lg border border-white/20 max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input 
                    type="text" 
                    placeholder="Search by location, type, amenities..." 
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-primary-700 text-gray-800"
                  />
                </div>
                <Button className="bg-primary-700 hover:bg-primary-800 text-white py-3 px-6">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" fill="#ffffff" preserveAspectRatio="none">
            <path d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
          </svg>
        </div>
      </div>
      
      <main className="w-full max-w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="w-full max-w-screen-2xl mx-auto">
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
          
          {/* Quick filter chips */}
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="text-sm font-medium text-gray-600 self-center">Quick filters:</span>
            <Button variant="outline" size="sm" className="rounded-full bg-gray-50 border border-gray-300 hover:bg-gray-100">
              <MapPin className="h-4 w-4 mr-1 text-primary" />
              Hyderabad
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-gray-50 border border-gray-300 hover:bg-gray-100">
              <Building className="h-4 w-4 mr-1 text-primary" />
              Apartments
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-gray-50 border border-gray-300 hover:bg-gray-100">
              Price: ₹50L - ₹1Cr
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-gray-50 border border-gray-300 hover:bg-gray-100">
              3+ Bedrooms
            </Button>
            <Button variant="outline" size="sm" className="rounded-full text-primary bg-primary/5 border border-primary/20 hover:bg-primary/10">
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
              </div>
              
              <div className="mt-4 md:mt-0 flex gap-3">
                <Button variant="outline" className="flex items-center gap-2 border-gray-300">
                  <ArrowRight className="h-4 w-4" />
                  <span>Newest First</span>
                </Button>
                <Button className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90">
                  <Filter className="h-4 w-4" />
                  <span>All Filters</span>
                </Button>
              </div>
            </div>
            
            <PropertiesTab selectedPropertyId={selectedPropertyId} />
          </section>
          
          <section className="mb-16 w-full">
            <CallToAction />
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Properties;
