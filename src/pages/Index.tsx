import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyForm } from "@/components/PropertyForm";
import { Building2, Users, Handshake, Trophy, Brain, Shield, Users2, ChartBar } from "lucide-react";

const Index = () => {
  const featuredProperties = [
    {
      title: "Luxury Villa in Banjara Hills",
      location: "Banjara Hills, Hyderabad",
      price: "₹2.5Cr",
      bedrooms: 4,
      bathrooms: 4,
      area: "4500 sq.ft",
      image: "/placeholder.svg",
    },
    {
      title: "Modern Office Space in HITEC City",
      location: "HITEC City, Hyderabad",
      price: "₹1.8Cr",
      bedrooms: 0,
      bathrooms: 4,
      area: "3000 sq.ft",
      image: "/placeholder.svg",
    },
    {
      title: "Premium Apartment in Jubilee Hills",
      location: "Jubilee Hills, Hyderabad",
      price: "₹95L",
      bedrooms: 3,
      bathrooms: 3,
      area: "2200 sq.ft",
      image: "/placeholder.svg",
    },
  ];

  const stats = [
    { label: "Properties Listed", value: "5,000+" },
    { label: "Active Users", value: "10,000+" },
    { label: "Startups Supported", value: "500+" },
    { label: "Successful Deals", value: "2,000+" },
  ];

  const features = [
    {
      icon: <Building2 className="h-8 w-8" />,
      title: "Smart Property Listings",
      description: "Advanced property listings with virtual tours, detailed analytics, and real-time market comparisons.",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Search",
      description: "Our intelligent search algorithm learns from your preferences to show the most relevant properties.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Communication",
      description: "End-to-end encrypted messaging system for safe and direct communication between parties.",
    },
    {
      icon: <Users2 className="h-8 w-8" />,
      title: "Startup Ecosystem",
      description: "Comprehensive support system including mentorship, networking, and resources for startups.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Platform",
      description: "Engage with a vibrant community of property owners, investors, and entrepreneurs.",
    },
    {
      icon: <ChartBar className="h-8 w-8" />,
      title: "Market Intelligence",
      description: "Real-time market insights and predictive analytics to make informed decisions.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      
      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Property Form Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Tell Us Your Requirements</h2>
            <p className="mt-2 text-lg text-gray-600">
              Whether you're looking to buy, sell, or rent, we'll help you find the perfect match.
            </p>
          </div>
          <div className="bg-gray-100 backdrop-blur-lg rounded-lg shadow-lg p-8">
            <PropertyForm />
          </div>
        </section>

        {/* Featured Properties */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
            <p className="mt-2 text-lg text-gray-600">
              Discover our hand-picked premium listings
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <PropertyCard key={index} {...property} />
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium">
              View All Properties
            </button>
          </div>
        </section>

        {/* Why Choose RCBridge */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose RCBridge?</h2>
            <p className="mt-2 text-lg text-gray-600">
              We're revolutionizing property transactions with cutting-edge technology and a commitment to transparency.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-primary rounded-lg p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">
            Join RCBridge today and become part of Hyderabad's most innovative property marketplace.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-md font-medium">
              Create Your Account
            </button>
            <button className="bg-transparent border-2 border-white hover:bg-white/10 px-6 py-3 rounded-md font-medium">
              Schedule a Demo
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">RCBridge</h3>
              <p className="text-sm">
                Connecting landowners, buyers, and startups in Hyderabad's property market.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Properties</a></li>
                <li><a href="#" className="hover:text-white">Startup Support</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Market Insights</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-sm">
                <li>Hyderabad, India</li>
                <li>aryan@rcbridge.co</li>
                <li>Contact us through email</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            © 2025 RCBridge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
