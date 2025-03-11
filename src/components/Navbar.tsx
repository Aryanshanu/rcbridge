
import { useState, useEffect } from "react";
import { Menu, X, Phone, MapPin, Users, Building, Home } from "lucide-react";
import { DesktopMenu } from "./navbar/DesktopMenu";
import { MobileMenu } from "./navbar/MobileMenu";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToPropertyForm = () => {
    const formElement = document.querySelector('#property-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const handleContactClick = () => {
    window.location.href = "mailto:aryan@rcbridge.co";
    setIsOpen(false);
  };

  return (
    <nav className={`${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white'} transition-all duration-300 sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="h-10 w-auto"
                src="/lovable-uploads/5fd561ff-5bbd-449c-94a3-d39d0a8b4f03.png"
                alt="RC Bridge"
              />
            </div>
          </div>

          {/* Desktop menu */}
          <DesktopMenu 
            scrollToPropertyForm={scrollToPropertyForm} 
            handleContactClick={handleContactClick} 
          />

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded={isOpen}
            >
              <span className="sr-only">{isOpen ? 'Close main menu' : 'Open main menu'}</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu 
        isOpen={isOpen} 
        scrollToPropertyForm={scrollToPropertyForm} 
        handleContactClick={handleContactClick} 
      />
    </nav>
  );
};
