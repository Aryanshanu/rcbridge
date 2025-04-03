
import React from 'react';
import { SEO } from '@/components/SEO';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/sections/Features';
import { FeaturedProperties } from '@/components/sections/FeaturedProperties';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { CallToAction } from '@/components/sections/CallToAction';
import { Footer } from '@/components/sections/Footer';
import { StatisticsSection } from '@/components/sections/Statistics';
import { RealEstateAssistant } from '@/components/RealEstateAssistant';

const Index = () => {
  return (
    <>
      <SEO 
        title="RC Bridge | Real Estate Simplified" 
        description="Find your dream property with RC Bridge. We connect buyers and sellers directly for a seamless real estate experience." 
      />
      
      <Hero />
      
      <RealEstateAssistant />
      
      <Features />
      
      <FeaturedProperties />
      
      <StatisticsSection />
      
      <HowItWorks />
      
      <WhyChooseUs />
      
      <CallToAction />
      
      <Footer />
    </>
  );
};

export default Index;
