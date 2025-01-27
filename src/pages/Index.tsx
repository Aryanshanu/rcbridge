import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { PropertyCard } from "@/components/PropertyCard";
import { Building2, Users, Handshake, Trophy } from "lucide-react";
import { PropertyForm } from "@/components/PropertyForm";

const Index = () => {
  const featuredProperties = [
    {
      title: "Modern Office Space in Jubilee Hills",
      location: "Jubilee Hills, Hyderabad",
      price: "₹85L",
      bedrooms: 0,
      bathrooms: 2,
      area: "1800 sq.ft",
      image: "/placeholder.svg",
    },
    {
      title: "Coworking Space in HITEC City",
      location: "HITEC City, Hyderabad",
      price: "₹1.2Cr",
      bedrooms: 0,
      bathrooms: 2,
      area: "2500 sq.ft",
      image: "/placeholder.svg",
    },
    {
      title: "Startup Hub in Banjara Hills",
      location: "Banjara Hills, Hyderabad",
      price: "₹2.5Cr",
      bedrooms: 0,
      bathrooms: 4,
      area: "3200 sq.ft",
      image: "/placeholder.svg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Property Form Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">List Your Property</h2>
          <div className="bg-white/80 backdrop-blur-lg rounded-lg shadow-lg p-8">
            <PropertyForm />
          </div>
        </section>

        {/* Featured Properties */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <PropertyCard key={index} {...property} />
            ))}
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose RCBridge</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Building2 className="h-8 w-8" />,
                title: "Direct Connections",
                description: "Connect directly with property owners and make informed decisions",
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Community Focus",
                description: "Join a thriving community of startups and entrepreneurs",
              },
              {
                icon: <Handshake className="h-8 w-8" />,
                title: "Trusted Platform",
                description: "Transparent transactions and verified listings",
              },
              {
                icon: <Trophy className="h-8 w-8" />,
                title: "Startup Support",
                description: "Access mentorship and resources for your startup",
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Startup Community Section */}
        <div className="bg-secondary rounded-lg p-8 mt-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-4">Join Our Startup Community</h2>
            <p className="text-gray-600 mb-6">
              Connect with fellow entrepreneurs, find mentors, and access resources to grow your business. 
              Be part of Hyderabad's most dynamic startup ecosystem.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium">
                Join Community
              </button>
              <button className="bg-white hover:bg-gray-50 text-primary px-6 py-3 rounded-md font-medium">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
