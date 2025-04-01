
import { Suspense, useEffect, lazy } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Statistics } from "@/components/sections/Statistics";
import { CallToAction } from "@/components/sections/CallToAction";
import { Footer } from "@/components/sections/Footer";
import { PropertyForm } from "@/components/PropertyForm";
import { SEO } from "@/components/SEO";
import { Loader2 } from "lucide-react";
import { NotificationButton } from "@/components/ui/NotificationButton";
import { ChatBot } from "@/components/ChatBot";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { CoreValues } from "@/components/sections/CoreValues";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ExploreServices } from "@/components/sections/ExploreServices";
import { TextFeaturedProperties } from "@/components/sections/TextFeaturedProperties";
import { Link } from "react-router-dom";

const Testimonials = lazy(() => import("@/components/sections/Testimonials").then(module => ({ default: module.Testimonials })));
const Features = lazy(() => import("@/components/sections/Features").then(module => ({ default: module.Features })));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const Index = () => {
  useEffect(() => {
    console.log("Page viewed:", window.location.pathname);
    
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('scrollTo') === 'property-form') {
      setTimeout(() => {
        const formElement = document.querySelector('#property-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <SEO />
      <Navbar />
      <Hero />
      
      <main className="w-full">
        {/* Statistics Section */}
        <div className="full-width">
          <div className="content-container">
            <Suspense fallback={<LoadingSpinner />}>
              <Statistics />
            </Suspense>
          </div>
        </div>
        
        {/* Why Choose Us Section */}
        <section className="full-width bg-white py-16">
          <div className="content-container">
            <WhyChooseUs />
          </div>
        </section>
        
        {/* Tell Us Your Requirements Section */}
        <section className="full-width bg-gray-50 py-16">
          <div className="content-container">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Tell Us Your Requirements</h2>
              <p className="mt-2 text-base sm:text-lg text-gray-600">
                Whether you're looking to buy, sell, or rent, we'll help you find the perfect match.
              </p>
            </div>
            <div id="property-form" className="bg-gray-100 backdrop-blur-lg rounded-lg shadow-lg p-4 sm:p-8 max-w-5xl mx-auto">
              <Suspense fallback={<LoadingSpinner />}>
                <PropertyForm />
              </Suspense>
            </div>
          </div>
        </section>
        
        {/* Core Values Section */}
        <CoreValues />
        
        {/* How It Works Section */}
        <HowItWorks />
        
        {/* Explore Services Section */}
        <ExploreServices />
        
        {/* Featured Properties Section - Text Only */}
        <section className="full-width bg-gray-50 py-16">
          <div className="content-container">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Properties</h2>
              <Link to="/properties" className="text-primary hover:underline font-medium">
                View all properties
              </Link>
            </div>
            <TextFeaturedProperties />
          </div>
        </section>
        
        {/* Features Section */}
        <section className="full-width bg-white py-16">
          <div className="content-container">
            <Suspense fallback={<LoadingSpinner />}>
              <Features />
            </Suspense>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="full-width bg-gray-50 py-16">
          <div className="content-container">
            <Suspense fallback={<LoadingSpinner />}>
              <Testimonials />
            </Suspense>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="full-width bg-primary text-white py-16">
          <div className="content-container">
            <Suspense fallback={<LoadingSpinner />}>
              <CallToAction />
            </Suspense>
          </div>
        </section>
      </main>

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
