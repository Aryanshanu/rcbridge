
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/SEO";
import { CallToAction } from "@/components/sections/CallToAction";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { PropertiesTab } from "@/components/tabs/PropertiesTab";
import { Home, Building, Filter } from "lucide-react";

const Properties = () => {
  const location = useLocation();
  const selectedPropertyId = location.state?.selectedPropertyId;
  
  useEffect(() => {
    // If a property was selected from the home page, we can highlight it or scroll to it
    if (selectedPropertyId) {
      console.log("Selected property ID:", selectedPropertyId);
      // You might want to scroll to this property or highlight it
      // This could be implemented through a ref in the PropertiesTab component
      
      // Scroll to the properties section
      const propertiesSection = document.getElementById('properties-section');
      if (propertiesSection) {
        propertiesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [selectedPropertyId]);
  
  return (
    <div className="min-h-screen bg-gray-50 w-full max-w-full">
      <SEO title="Properties | RC Bridge" description="Explore our selection of premium properties" />
      <Navbar />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary/90 to-primary-700 text-white py-12 lg:py-20 w-full">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-center mb-4">
            Discover Your Perfect Property
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto text-gray-100">
            Browse through our exclusive collection of premium properties in Hyderabad
          </p>
        </div>
      </div>
      
      <main className="w-full max-w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="w-full max-w-screen-2xl mx-auto">
          <Breadcrumb className="mb-6">
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
          
          <section id="properties-section" className="mb-16 w-full bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-semibold text-gray-900 mb-2">
                  Our Properties
                </h2>
                <p className="text-gray-600">
                  Find your dream property from our carefully curated selection
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                  <Filter className="h-4 w-4" />
                  <span>Filter Properties</span>
                </button>
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
