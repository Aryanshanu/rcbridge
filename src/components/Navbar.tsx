import { Home, Building, Users, HandshakeIcon, Key, Phone, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToPropertyForm = () => {
    const formElement = document.getElementById('property-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactClick = () => {
    window.location.href = "mailto:aryan@rcbridge.co";
  };

  return (
    <nav className="bg-primary shadow-sm border-b sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center h-auto py-4">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center bg-white px-4 py-2 rounded">
              <Link to="/" className="flex items-center" aria-label="Go to homepage">
                <img 
                  src="/lovable-uploads/5fd561ff-5bbd-449c-94a3-d39d0a8b4f03.png" 
                  alt="RC Bridge Logo" 
                  className="h-8 w-auto sm:h-10"
                  loading="lazy"
                />
                <span className="ml-2 text-lg sm:text-xl font-bold text-primary">RCBridge</span>
              </Link>
            </div>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden bg-white p-2 rounded-md"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-6 w-6 text-primary" aria-hidden="true" />
            </button>
          </div>
          
          <div 
            id="mobile-menu"
            className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex w-full md:w-auto flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 mt-4 bg-white rounded-lg px-4 py-3 md:px-6`}
            role="menu"
          >
            <button onClick={scrollToPropertyForm} className="w-full md:w-auto text-left md:text-center text-primary hover:text-primary/90 px-3 py-2 rounded-md text-sm font-medium" role="menuitem">
              <Home className="h-5 w-5 inline-block mr-1" aria-hidden="true" />
              <span>Home</span>
            </button>
            <button onClick={scrollToPropertyForm} className="w-full md:w-auto text-left md:text-center text-primary hover:text-primary/90 px-3 py-2 rounded-md text-sm font-medium" role="menuitem">
              <Building className="h-5 w-5 inline-block mr-1" aria-hidden="true" />
              <span>Properties</span>
            </button>
            <button onClick={scrollToPropertyForm} className="w-full md:w-auto text-left md:text-center text-primary hover:text-primary/90 px-3 py-2 rounded-md text-sm font-medium" role="menuitem">
              <Key className="h-5 w-5 inline-block mr-1" aria-hidden="true" />
              <span>Rental Services</span>
            </button>
            <button onClick={scrollToPropertyForm} className="w-full md:w-auto text-left md:text-center text-primary hover:text-primary/90 px-3 py-2 rounded-md text-sm font-medium" role="menuitem">
              <HandshakeIcon className="h-5 w-5 inline-block mr-1" aria-hidden="true" />
              <span>Partnerships</span>
            </button>
            <button onClick={scrollToPropertyForm} className="w-full md:w-auto text-left md:text-center text-primary hover:text-primary/90 px-3 py-2 rounded-md text-sm font-medium" role="menuitem">
              <Users className="h-5 w-5 inline-block mr-1" aria-hidden="true" />
              <span>Community</span>
            </button>
            <button onClick={handleContactClick} className="w-full md:w-auto text-left md:text-center text-primary hover:text-primary/90 px-3 py-2 rounded-md text-sm font-medium" role="menuitem">
              <Phone className="h-5 w-5 inline-block mr-1" aria-hidden="true" />
              <span>Contact</span>
            </button>
            <button onClick={scrollToPropertyForm} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium" role="menuitem">
              List Property
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};