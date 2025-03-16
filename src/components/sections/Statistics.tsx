
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const Statistics = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Updated statistics to reflect the platform's impact with more specific numbers
  const stats = [
    { label: "Properties Listed", value: "487", icon: "🏡" },
    { label: "Active Users", value: "1,248", icon: "👥" },
    { label: "Startups Supported", value: "42", icon: "🚀" },
    { label: "Successful Deals", value: "356", icon: "🤝" },
    { label: "Years in Hyderabad", value: "10", icon: "⭐" },
    { label: "Avg. Buyer Savings", value: "₹3.8L", icon: "💰" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("statistics-section");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.disconnect();
    };
  }, []);

  return (
    <section id="statistics-section" className="py-10 sm:py-16 bg-white rounded-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">A Decade of Excellence in Real Estate</h2>
          <p className="mt-2 text-base sm:text-lg text-gray-600">
            Building trust through transparent transactions and exceptional service since 2013
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 rounded-lg p-4 sm:p-6 text-center border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-3xl sm:text-4xl mb-2">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm sm:text-base text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-gray-600 italic">
            "Eliminating middlemen and preserving property value through direct connections since 2013"
          </p>
        </div>
      </div>
    </section>
  );
};
