
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/SEO";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Features } from "@/components/sections/Features";
import { CallToAction } from "@/components/sections/CallToAction";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

const Services = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="Our Services | RC Bridge" description="Discover our comprehensive real estate services" />
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
              <BreadcrumbPage>Our Services</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">Our Core Services</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive real estate solutions tailored to your needs
          </p>
        </div>
        
        <section className="mb-16">
          <WhyChooseUs />
        </section>
        
        <section className="mb-16">
          <Features />
        </section>
        
        <section className="mb-16">
          <CallToAction />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;
