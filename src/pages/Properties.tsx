
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/SEO";
import { TextFeaturedProperties } from "@/components/sections/TextFeaturedProperties";
import { FeaturedProperties } from "@/components/sections/FeaturedProperties";
import { CallToAction } from "@/components/sections/CallToAction";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

const Properties = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="Properties | RC Bridge" description="Explore our selection of premium properties" />
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4 mr-1" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Properties</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">Our Properties</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our curated selection of premium properties designed to meet your investment needs
          </p>
        </div>
        
        <section className="mb-16">
          <TextFeaturedProperties />
        </section>
        
        <section className="mb-16">
          <FeaturedProperties />
        </section>
        
        <section className="mb-16">
          <CallToAction />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Properties;
