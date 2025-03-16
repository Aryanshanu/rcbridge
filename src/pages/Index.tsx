
import { Suspense, useEffect, lazy } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Statistics } from "@/components/sections/Statistics";
import { CallToAction } from "@/components/sections/CallToAction";
import { Footer } from "@/components/sections/Footer";
import { PropertyForm } from "@/components/PropertyForm";
import { SEO } from "@/components/SEO";
import { Loader2, Building, Sparkles, Calculator } from "lucide-react";
import { NotificationButton } from "@/components/ui/NotificationButton";
import { ChatBot } from "@/components/ChatBot";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Testimonials = lazy(() => import("@/components/sections/Testimonials").then(module => ({ default: module.Testimonials })));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const Index = () => {
  useEffect(() => {
    console.log("Page viewed:", window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO />
      <Navbar />
      <Hero />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Statistics Section */}
        <Suspense fallback={<LoadingSpinner />}>
          <Statistics />
        </Suspense>
        
        {/* Navigation Links to Pages */}
        <section className="mt-12 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Explore Our Services</h2>
            <p className="mt-2 text-base sm:text-lg text-gray-600">
              Discover what RC Bridge has to offer to help you achieve your real estate goals
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <Building className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Properties</h3>
              <p className="text-gray-600 mb-4">Explore our curated collection of premium properties designed to meet your investment needs.</p>
              <Link to="/properties" className="mt-auto">
                <Button className="w-full">
                  Browse Properties
                </Button>
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <Sparkles className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Our Services</h3>
              <p className="text-gray-600 mb-4">Learn about the comprehensive real estate solutions we offer to our clients.</p>
              <Link to="/services" className="mt-auto">
                <Button className="w-full">
                  View Services
                </Button>
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <Calculator className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Investment Calculator</h3>
              <p className="text-gray-600 mb-4">Calculate potential returns and evaluate investment opportunities with our tools.</p>
              <Link to="/calculator" className="mt-auto">
                <Button className="w-full">
                  Use Calculator
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <section className="mb-12 sm:mb-16">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Tell Us Your Requirements</h2>
            <p className="mt-2 text-base sm:text-lg text-gray-600">
              Whether you're looking to buy, sell, or rent, we'll help you find the perfect match.
            </p>
          </div>
          <div id="property-form" className="bg-gray-100 backdrop-blur-lg rounded-lg shadow-lg p-4 sm:p-8">
            <Suspense fallback={<LoadingSpinner />}>
              <PropertyForm />
            </Suspense>
          </div>
        </section>
        
        <Suspense fallback={<LoadingSpinner />}>
          <Testimonials />
        </Suspense>
        
        <Suspense fallback={<LoadingSpinner />}>
          <CallToAction />
        </Suspense>
      </main>

      {/* Fixed position components with improved positioning */}
      <div className="fixed bottom-6 right-6 z-50">
        <NotificationButton />
      </div>
      <div className="fixed bottom-6 right-20 z-50">
        <ChatBot />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
