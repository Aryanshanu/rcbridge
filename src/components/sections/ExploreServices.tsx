
import { Building, Sparkles, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const ExploreServices = () => {
  const services = [
    {
      icon: Building,
      title: "Properties",
      description: "Explore our curated collection of premium properties designed to meet your investment needs.",
      link: "/properties",
      buttonText: "Browse Properties"
    },
    {
      icon: Sparkles,
      title: "Our Services",
      description: "Learn about the comprehensive real estate solutions we offer to our clients.",
      link: "/services",
      buttonText: "View Services"
    },
    {
      icon: Calculator,
      title: "Investment Calculator",
      description: "Calculate potential returns and evaluate investment opportunities with our tools.",
      link: "/calculator",
      buttonText: "Use Calculator"
    }
  ];

  return (
    <section className="full-width bg-white py-16">
      <div className="content-container">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Explore Our Services</h2>
          <p className="mt-2 text-base sm:text-lg text-gray-600">
            Discover what RC Bridge has to offer to help you achieve your real estate goals
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <service.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <Link to={service.link} className="mt-auto">
                <Button className="w-full">
                  {service.buttonText}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
