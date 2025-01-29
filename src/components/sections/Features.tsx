import { Building2, Users, Brain, Shield, Users2, ChartBar } from "lucide-react";

export const Features = () => {
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
    <section className="mb-12 sm:mb-16">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why Choose RCBridge?</h2>
        <p className="mt-2 text-base sm:text-lg text-gray-600">
          We're revolutionizing property transactions with cutting-edge technology and a commitment to transparency.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-primary/10 text-primary mb-4">
              {feature.icon}
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};