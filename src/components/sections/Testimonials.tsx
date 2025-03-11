
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  company?: string;
  content: string;
  image?: string;
};

export const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Arjun Reddy",
      role: "Property Owner",
      content: "RC Bridge helped me connect with genuine buyers directly, saving me significant brokerage fees. The platform's verification process ensured I only dealt with serious inquiries.",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Startup Founder",
      company: "TechSprint",
      content: "Finding the right office space was crucial for our growing startup. The Gen Z ambassadors at RC Bridge provided personalized assistance and helped us find the perfect location within our budget.",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Rahul Menon",
      role: "Real Estate Investor",
      content: "The community aspect of RC Bridge is what sets it apart. I've not only found multiple investment properties but also connected with other investors, creating valuable partnerships.",
      image: "/placeholder.svg",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1));
    }, 8000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setActiveIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1));
  };

  const prevTestimonial = () => {
    setActiveIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1));
  };

  return (
    <section className="mb-12 sm:mb-16 overflow-hidden">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What Our Users Say</h2>
        <p className="mt-2 text-base sm:text-lg text-gray-600">
          Real experiences from our community members
        </p>
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4">
        <div className="relative bg-white rounded-xl shadow-lg p-6 sm:p-10">
          <div className="absolute top-6 left-6 text-primary opacity-30">
            <Quote size={48} />
          </div>
          
          <div className="relative z-10">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`transition-opacity duration-500 ${
                  index === activeIndex ? "opacity-100" : "opacity-0 absolute inset-0"
                }`}
              >
                <blockquote className="text-lg sm:text-xl italic text-gray-700 mb-6 pt-8">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="flex items-center mt-4">
                  {testimonial.image && (
                    <div className="mr-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">
                      {testimonial.role}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation controls */}
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={prevTestimonial}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "bg-primary w-4" : "bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          <button
            onClick={nextTestimonial}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
