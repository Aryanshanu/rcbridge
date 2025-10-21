
import { useState, useEffect, useRef } from "react";
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
    {
      id: 4,
      name: "Sneha Patel",
      role: "First-Time Homebuyer",
      content: "As a first-time buyer, I was overwhelmed by the process. RC Bridge's transparent approach and helpful team made my dream of owning a home a reality. No hidden fees, just genuine support!",
      image: "/placeholder.svg",
    },
    {
      id: 5,
      name: "Vikram Singh",
      role: "Commercial Property Developer",
      content: "The investment calculator and market insights provided by RC Bridge are exceptional. It helped me make informed decisions on multiple commercial property acquisitions in Hyderabad.",
      image: "/placeholder.svg",
    },
    {
      id: 6,
      name: "Anjali Desai",
      role: "Agricultural Land Investor",
      content: "RC Bridge's expertise in agricultural land transactions is unmatched. They guided me through the entire process of purchasing farmland, from legal documentation to land verification.",
      image: "/placeholder.svg",
    },
    {
      id: 7,
      name: "Karthik Rao",
      role: "Rental Property Manager",
      content: "Managing rental properties became so much easier with RC Bridge. Their tenant verification process and rental management tools saved me countless hours and headaches.",
      image: "/placeholder.svg",
    },
    {
      id: 8,
      name: "Meera Nair",
      role: "Luxury Villa Buyer",
      content: "Looking for a luxury property requires discretion and expertise. RC Bridge delivered on both fronts, helping me find my dream villa in a premium locality with complete privacy.",
      image: "/placeholder.svg",
    },
    {
      id: 9,
      name: "Aditya Kumar",
      role: "Student Housing Investor",
      content: "RC Bridge identified an excellent opportunity in the student housing market. Their market analysis and ROI projections were spot-on. My investment is performing better than expected!",
      image: "/placeholder.svg",
    },
    {
      id: 10,
      name: "Divya Krishnan",
      role: "Property Flipper",
      content: "The platform's quick turnaround time for property listings and buyer connections is impressive. I've successfully flipped three properties this year, all thanks to RC Bridge's efficient system.",
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
    <section className="mb-16 sm:mb-20 overflow-hidden bg-gray-50 dark:bg-gray-900 py-12 rounded-xl">
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-gray-50">What Our Users Say</h2>
        <div className="w-20 h-1 bg-accent mx-auto mt-3 mb-4 rounded-full"></div>
        <p className="mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Real experiences from our community members
        </p>
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-10 overflow-hidden border dark:border-gray-700">
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
                <blockquote className="text-lg sm:text-xl italic text-gray-700 dark:text-gray-300 mb-6 pt-8">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="flex items-center mt-6">
                  <div className="mr-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center text-lg font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-50">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
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
            className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-primary dark:text-white"
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
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
                aria-current={index === activeIndex ? "true" : "false"}
              />
            ))}
          </div>
          
          <button
            onClick={nextTestimonial}
            className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-primary dark:text-white"
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
