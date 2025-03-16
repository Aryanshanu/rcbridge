
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  LogIn, 
  Phone, 
  Users, 
  Building, 
  Calculator, 
  User,
  ChevronDown,
  BookOpen,
  HelpCircle,
  Mail
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "../auth/AuthDialog";
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface MobileMenuProps {
  isOpen: boolean;
  scrollToPropertyForm: () => void;
  handleContactClick: () => void;
}

export const MobileMenu = ({ isOpen, scrollToPropertyForm, handleContactClick }: MobileMenuProps) => {
  const { user, signOut } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white border-t">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <Link
          to="/"
          className="w-full block text-left text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
        >
          <Home className="h-5 w-5 inline-block mr-1" aria-hidden="true" />
          <span>Home</span>
        </Link>
        <Link
          to="/properties"
          className="w-full block text-left text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
        >
          <Building className="h-5 w-5 inline-block mr-1" aria-hidden="true" />
          <span>Properties</span>
        </Link>
        <Link
          to="/services"
          className="w-full block text-left text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
        >
          <Users className="h-5 w-5 inline-block mr-1" aria-hidden="true" />
          <span>Services</span>
        </Link>
        <Link
          to="/calculator"
          className="w-full block text-left text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
        >
          <Calculator className="h-5 w-5 inline-block mr-1" aria-hidden="true" />
          <span>Calculator</span>
        </Link>
        
        <div className="border-t border-gray-200 my-2"></div>
        
        <div className="w-full px-3 py-2">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-0"
            onClick={() => setIsResourcesOpen(!isResourcesOpen)}
          >
            <span className="flex items-center text-gray-700">
              <BookOpen className="h-5 w-5 mr-1" />
              Resources
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
          </Button>
          
          {isResourcesOpen && (
            <div className="pl-6 mt-2 space-y-2">
              <Link
                to="/blog"
                className="block text-gray-600 hover:text-gray-900 py-1"
              >
                <BookOpen className="h-4 w-4 inline-block mr-1" />
                Blog
              </Link>
              <Link
                to="/faq"
                className="block text-gray-600 hover:text-gray-900 py-1"
              >
                <HelpCircle className="h-4 w-4 inline-block mr-1" />
                FAQ
              </Link>
              <Link
                to="/contact"
                className="block text-gray-600 hover:text-gray-900 py-1"
              >
                <Mail className="h-4 w-4 inline-block mr-1" />
                Contact Us
              </Link>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 my-2"></div>
        
        <button
          onClick={handleContactClick}
          className="w-full text-left text-primary hover:text-primary/90 px-3 py-2 rounded-md text-sm font-medium"
        >
          <Phone className="h-5 w-5 inline-block mr-1" aria-hidden="true" />
          <span>Contact</span>
        </button>
        
        {user ? (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="px-3 text-sm text-gray-600">Signed in as: {user.email}</p>
            <Link
              to="/profile"
              className="w-full block text-left text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium mt-2"
            >
              <User className="h-5 w-5 inline-block mr-1" aria-hidden="true" />
              Profile
            </Link>
            <button
              onClick={signOut}
              className="w-full text-left text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col space-y-2 px-3">
            <Link to="/login">
              <Button variant="outline" size="sm" className="w-full">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="w-full">
                Register
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
