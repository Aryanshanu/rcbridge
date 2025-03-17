import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/SEO";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Features } from "@/components/sections/Features";
import { CallToAction } from "@/components/sections/CallToAction";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home, Building, Shield, Users, ChartBar, MapPin, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { PropertyForm } from "@/components/PropertyForm";

const Services = () => {
  const navigate = useNavigate();
  
  // Additional service categories
  const serviceCategories = [
    {
      title: "Residential Services",
      description: "Comprehensive solutions for buying, selling, and renting residential properties",
      items: [
        "Premium Home Buying & Selling",
        "Luxury Apartment Leasing",
        "Villa & Bungalow Transactions",
        "Plot & Land Acquisition",
        "Gated Community Properties"
      ],
      icon: <Home className="h-10 w-10 text-primary" />
    },
    {
      title: "Commercial Services",
      description: "Specialized solutions for businesses seeking office spaces and commercial properties",
      items: [
        "Office Space Acquisition",
        "Retail Space Leasing",
        "Industrial Property Transactions",
        "Warehouse & Storage Solutions",
        "Multi-use Commercial Complexes"
      ],
      icon: <Building className="h-10 w-10 text-primary" />
    },
    {
      title: "Investment Advisory",
      description: "Strategic guidance for maximizing returns on real estate investments",
      items: [
        "High-ROI Property Identification",
        "Investment Portfolio Diversification",
        "Market Trend Analysis",
        "Risk Assessment & Mitigation",
        "Capital Growth Strategies"
      ],
      icon: <ChartBar className="h-10 w-10 text-primary" />
    }
  ];

  // Client benefits
  const clientBenefits = [
    {
      title: "Time Efficiency",
      description: "Save valuable time with our curated property recommendations that match your exact requirements.",
      icon: <Clock className="h-8 w-8 text-primary" />
    },
    {
      title: "Value Preservation",
      description: "Maintain property value through controlled exposure and direct transactions without public listings.",
      icon: <Shield className="h-8 w-8 text-primary" />
    },
    {
      title: "Expert Guidance",
      description: "Benefit from our decade of industry expertise and deep market knowledge throughout your journey.",
      icon: <Users className="h-8 w-8 text-primary" />
    },
    {
      title: "Zero Brokerage",
      description: "Eliminate unnecessary brokerage fees through our direct buyer-seller connection platform.",
      icon: <Check className="h-8 w-8 text-primary" />
    }
  ];

  const scrollToPropertyForm = () => {
    document.getElementById('property-form')?.scrollIntoView({ behavior: 'smooth' });
  };

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
        </div>
        
        {/* Service Categories Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Service Categories</h2>
            <p className="mt-2 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Specialized solutions across various real estate segments
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {serviceCategories.map((category, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all border-gray-200">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <ul className="space-y-2 mb-6 flex-grow">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="mt-auto">
                    Learn More
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Client Benefits Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Client Benefits</h2>
            <p className="mt-2 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Why clients choose RC Bridge for their real estate needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clientBenefits.map((benefit, index) => (
              <div key={index} className="bg-white p-5 rounded-lg shadow-md border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section className="mb-16">
          <WhyChooseUs />
        </section>
        
        <section className="mb-16">
          <Features />
        </section>
        
        {/* FAQ Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-2 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Answers to common questions about our services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">How is RC Bridge different from other real estate platforms?</h3>
              <p className="text-gray-600">
                Unlike traditional platforms that rely on public listings, RC Bridge operates on a personalized matching model that preserves property value through controlled exposure and direct connections between buyers and sellers, eliminating intermediaries and unnecessary fees.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">What types of properties does RC Bridge handle?</h3>
              <p className="text-gray-600">
                We handle a wide range of properties including residential homes, apartments, commercial spaces, office buildings, lands, and industrial properties across various price ranges to meet diverse client needs.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">How do I get started with RC Bridge services?</h3>
              <p className="text-gray-600">
                Getting started is simple: Create an account, submit your property requirements or listing details, and our team will begin the personalized matching process immediately, connecting you with relevant opportunities.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">What are the fees associated with using RC Bridge?</h3>
              <p className="text-gray-600">
                RC Bridge operates on a zero-brokerage model for basic services. We eliminate traditional brokerage fees by directly connecting buyers and sellers, resulting in significant cost savings for all parties involved.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button onClick={scrollToPropertyForm}>
              Get Personalized Assistance
            </Button>
          </div>
        </section>
        
        {/* Property Form Section */}
        <section className="mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-center mb-6">Tell Us Your Requirements</h2>
            <p className="text-center text-gray-600 mb-8">
              Whether you're looking to buy, sell, or rent, we'll help you find the perfect match.
            </p>
            <PropertyForm />
          </div>
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
