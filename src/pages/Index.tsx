import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Statistics } from "@/components/sections/Statistics";
import { FeaturedProperties } from "@/components/sections/FeaturedProperties";
import { Features } from "@/components/sections/Features";
import { CallToAction } from "@/components/sections/CallToAction";
import { Footer } from "@/components/sections/Footer";
import { PropertyForm } from "@/components/PropertyForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <Statistics />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Property Form Section */}
        <section className="mb-12 sm:mb-16">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Tell Us Your Requirements</h2>
            <p className="mt-2 text-base sm:text-lg text-gray-600">
              Whether you're looking to buy, sell, or rent, we'll help you find the perfect match.
            </p>
          </div>
          <div className="bg-gray-100 backdrop-blur-lg rounded-lg shadow-lg p-4 sm:p-8">
            <PropertyForm />
          </div>
        </section>

        <FeaturedProperties />
        <Features />
        <CallToAction />
      </main>

      <Footer />
    </div>
  );
};

export default Index;