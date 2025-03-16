
import { Suspense, useEffect, lazy } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Statistics } from "@/components/sections/Statistics";
import { CallToAction } from "@/components/sections/CallToAction";
import { Footer } from "@/components/sections/Footer";
import { PropertyForm } from "@/components/PropertyForm";
import { SEO } from "@/components/SEO";
import { Loader2, Building, Sparkles, Calculator, Clock, Shield, Users, HeartHandshake, Target, Trophy } from "lucide-react";
import { NotificationButton } from "@/components/ui/NotificationButton";
import { ChatBot } from "@/components/ChatBot";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TextFeaturedProperties } from "@/components/sections/TextFeaturedProperties";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";

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
        
        {/* Why Choose Us Section - Moved to top */}
        <section className="mt-16 mb-16">
          <WhyChooseUs />
        </section>
        
        {/* Tell Us Your Requirements Section - Moved after Why Choose Us */}
        <section className="mb-16 mt-8">
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
        
        {/* Our Core Values Section */}
        <section className="mt-16 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Core Values</h2>
            <p className="mt-2 text-base sm:text-lg text-gray-600">
              The principles that drive our commitment to excellence in real estate
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
              <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-4 mx-auto">
                <HeartHandshake className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">Integrity</h3>
              <p className="text-gray-600 text-center">
                Upholding the highest ethical standards in every transaction and relationship, ensuring trust and transparency.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
              <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-4 mx-auto">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">Innovation</h3>
              <p className="text-gray-600 text-center">
                Constantly evolving our approach to meet changing market needs and leveraging technology for better outcomes.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
              <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-4 mx-auto">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">Community</h3>
              <p className="text-gray-600 text-center">
                Building relationships that extend beyond transactions, fostering a vibrant ecosystem of property stakeholders.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
              <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-4 mx-auto">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">Excellence</h3>
              <p className="text-gray-600 text-center">
                Committed to delivering exceptional service and results that exceed expectations in every aspect.
              </p>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How RC Bridge Works</h2>
            <p className="mt-2 text-base sm:text-lg text-gray-600">
              Our unique approach to revolutionizing real estate transactions
            </p>
          </div>
          
          <div className="relative">
            {/* Process steps with connecting line */}
            <div className="hidden md:block absolute left-1/2 top-24 bottom-24 w-0.5 bg-primary/30 -translate-x-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-3 mx-auto">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Share Your Requirements</h3>
                <p className="text-gray-600">Tell us what you're looking for, whether buying, selling, or renting property.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-3 mx-auto">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">Personalized Matching</h3>
                <p className="text-gray-600">We match you with exclusive off-market properties or serious buyers based on your criteria.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-3 mx-auto">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">Direct Connections</h3>
                <p className="text-gray-600">Connect directly with property owners or buyers, eliminating middlemen and unnecessary fees.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Navigation Links to Pages */}
        <section className="mt-12 mb-16">
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
        
        {/* Featured Properties Section - Text Only */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Properties</h2>
            <Link to="/properties" className="text-primary hover:underline font-medium">
              View all properties
            </Link>
          </div>
          <TextFeaturedProperties />
        </section>
        
        <section className="mb-16">
          <Suspense fallback={<LoadingSpinner />}>
            <Features />
          </Suspense>
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
