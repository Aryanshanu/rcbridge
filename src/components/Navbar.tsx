import { Home, Building, Users, HandshakeIcon, Key, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const scrollToPropertyForm = () => {
    const formElement = document.getElementById('property-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-primary shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center h-auto py-4">
          <div className="flex items-center bg-white px-4 py-2 rounded">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/5fd561ff-5bbd-449c-94a3-d39d0a8b4f03.png" 
                alt="RC Bridge Logo" 
                className="h-10 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-primary">RCBridge</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4 mt-4">
            <button onClick={scrollToPropertyForm} className="text-[#1EAEDB] hover:text-[#1EAEDB]/90 px-3 py-2 rounded-md text-sm font-medium">
              <Home className="h-5 w-5 inline-block mr-1" />
              Home
            </button>
            <button onClick={scrollToPropertyForm} className="text-[#1EAEDB] hover:text-[#1EAEDB]/90 px-3 py-2 rounded-md text-sm font-medium">
              <Building className="h-5 w-5 inline-block mr-1" />
              Properties
            </button>
            <button onClick={scrollToPropertyForm} className="text-[#1EAEDB] hover:text-[#1EAEDB]/90 px-3 py-2 rounded-md text-sm font-medium">
              <Key className="h-5 w-5 inline-block mr-1" />
              Rental Services
            </button>
            <button onClick={scrollToPropertyForm} className="text-[#1EAEDB] hover:text-[#1EAEDB]/90 px-3 py-2 rounded-md text-sm font-medium">
              <HandshakeIcon className="h-5 w-5 inline-block mr-1" />
              Partnerships
            </button>
            <button onClick={scrollToPropertyForm} className="text-[#1EAEDB] hover:text-[#1EAEDB]/90 px-3 py-2 rounded-md text-sm font-medium">
              <Users className="h-5 w-5 inline-block mr-1" />
              Community
            </button>
            <button onClick={scrollToPropertyForm} className="text-[#1EAEDB] hover:text-[#1EAEDB]/90 px-3 py-2 rounded-md text-sm font-medium">
              <Phone className="h-5 w-5 inline-block mr-1" />
              Contact
            </button>
            <button onClick={scrollToPropertyForm} className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/90 text-white px-4 py-2 rounded-md text-sm font-medium">
              List Property
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};