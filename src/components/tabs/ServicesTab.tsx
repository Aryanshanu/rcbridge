
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Features } from "@/components/sections/Features";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Building, ChartBar, Shield, Check, Users, Clock } from "lucide-react";

export const ServicesTab = () => {
  // Service Categories with modern design
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
      icon: <Home className="h-12 w-12 text-primary" />,
      color: "bg-[#F2FCE2]"
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
      icon: <Building className="h-12 w-12 text-primary" />,
      color: "bg-[#D3E4FD]"
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
      icon: <ChartBar className="h-12 w-12 text-primary" />,
      color: "bg-[#E5DEFF]"
    }
  ];

  // Client benefits with modern design
  const clientBenefits = [
    {
      title: "Time Efficiency",
      description: "Save valuable time with our curated property recommendations that match your exact requirements.",
      icon: <Clock className="h-10 w-10 text-primary" />,
      color: "bg-[#FEF7CD]"
    },
    {
      title: "Value Preservation",
      description: "Maintain property value through controlled exposure and direct transactions without public listings.",
      icon: <Shield className="h-10 w-10 text-primary" />,
      color: "bg-[#FFDEE2]"
    },
    {
      title: "Expert Guidance",
      description: "Benefit from our decade of industry expertise and deep market knowledge throughout your journey.",
      icon: <Users className="h-10 w-10 text-primary" />,
      color: "bg-[#FDE1D3]"
    },
    {
      title: "Zero Brokerage",
      description: "Eliminate unnecessary brokerage fees through our direct buyer-seller connection platform.",
      icon: <Check className="h-10 w-10 text-primary" />,
      color: "bg-[#F2FCE2]"
    }
  ];

  return (
    <section className="w-full space-y-12 py-4">
      {/* Service Categories Section */}
      <div className="mb-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Service Categories</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Specialized solutions across various real estate segments
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {serviceCategories.map((category, index) => (
            <Card key={index} className="overflow-hidden hover-card border-0 shadow-lg">
              <div className={`${category.color} p-6`}>
                {category.icon}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">{category.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{category.description}</p>
                <ul className="space-y-2 mb-6 text-sm">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-primary mr-2 font-bold">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Learn More
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Client Benefits Section */}
      <div className="mb-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Client Benefits</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Why clients choose RC Bridge for their real estate needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {clientBenefits.map((benefit, index) => (
            <div 
              key={index} 
              className={`${benefit.color} rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="mb-5">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-gray-700">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Additional sections */}
      <WhyChooseUs />
      <Features />
    </section>
  );
};
