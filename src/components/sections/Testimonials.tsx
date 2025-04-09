import React, { useState, useEffect, useRef } from "react";
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
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
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
    timerRef.current = setInterval(() => {
      nextTestimonial();
    }, 8000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const nextTestimonial = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1));
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1));
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const handleDotClick = (index: number) => {
    if (isAnimating || index === activeIndex) return;
    
    setIsAnimating(true);
    setActiveIndex(index);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    
    // Reset the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        nextTestimonial();
      }, 8000);
    }
  };

  return (
    <section className="mb-16 sm:mb-20 overflow-hidden bg-gray-50 py-12 rounded-xl">
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-3xl font-display font-bold text-gray-900">What Our Users Say</h2>
        <div className="w-20 h-1 bg-accent mx-auto mt-3 mb-4 rounded-full"></div>
        <p className="mt-2 text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
          Real experiences from our community members
        </p>
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4">
        <div className="relative bg-white rounded-xl shadow-lg p-6 sm:p-10 overflow-hidden">
          {/* Background design elements */}
          <div className="absolute top-6 left-6 text-primary opacity-10">
            <Quote size={80} />
          </div>
          <div className="absolute bottom-6 right-6 text-primary opacity-10">
            <Quote size={80} className="rotate-180" />
          </div>
          
          <div className="relative z-10 min-h-[200px]">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`transition-all duration-500 ${
                  index === activeIndex 
                    ? "opacity-100 transform translate-x-0" 
                    : "opacity-0 absolute inset-0 transform translate-x-8"
                }`}
              >
                <blockquote className="text-lg sm:text-xl italic text-gray-700 mb-6 pt-8">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="flex items-center mt-6">
                  <div className="mr-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center text-lg font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                  </div>
                  
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
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={prevTestimonial}
            className="p-3 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors text-primary"
            aria-label="Previous testimonial"
            disabled={isAnimating}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? "bg-accent w-6" 
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
                aria-current={index === activeIndex ? "true" : "false"}
              />
            ))}
          </div>
          
          <button
            onClick={nextTestimonial}
            className="p-3 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors text-primary"
            aria-label="Next testimonial"
            disabled={isAnimating}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
