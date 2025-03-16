
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
import { TabsContainer } from "@/components/TabsContainer";
import { TabsContent } from "@/components/ui/tabs";
import { PropertiesTab } from "@/components/tabs/PropertiesTab";
import { ServicesTab } from "@/components/tabs/ServicesTab";
import { CalculatorTab } from "@/components/tabs/CalculatorTab";

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
        
        {/* Tabbed Content */}
        <section className="mt-12 mb-12">
          <TabsContainer>
            <TabsContent value="properties" className="mt-6 animate-in fade-in-50 duration-300">
              <PropertiesTab />
            </TabsContent>
            
            <TabsContent value="services" className="mt-6 animate-in fade-in-50 duration-300">
              <ServicesTab />
            </TabsContent>
            
            <TabsContent value="calculator" className="mt-6 animate-in fade-in-50 duration-300">
              <CalculatorTab />
            </TabsContent>
          </TabsContainer>
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
