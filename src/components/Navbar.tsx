import { Home, Building, Users, HandshakeIcon, Key, Phone, Search } from "lucide-react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/5fd561ff-5bbd-449c-94a3-d39d0a8b4f03.png" 
                alt="RC Bridge Logo" 
                className="h-10 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-primary">RCBridge</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              <Home className="h-5 w-5 inline-block mr-1" />
              Home
            </Link>
            <Link to="/properties" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              <Building className="h-5 w-5 inline-block mr-1" />
              Properties
            </Link>
            <Link to="/rental-services" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              <Key className="h-5 w-5 inline-block mr-1" />
              Rental Services
            </Link>
            <Link to="/partnerships" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              <HandshakeIcon className="h-5 w-5 inline-block mr-1" />
              Partnerships
            </Link>
            <Link to="/community" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              <Users className="h-5 w-5 inline-block mr-1" />
              Community
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              <Phone className="h-5 w-5 inline-block mr-1" />
              Contact
            </Link>
            <button className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md text-sm font-medium">
              List Property
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};