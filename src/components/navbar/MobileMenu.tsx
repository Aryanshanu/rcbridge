
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Home, LogIn, Phone, Users, Building, Calculator } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "../auth/AuthDialog";
import { useState } from "react";
import { Link } from "react-router-dom";

interface MobileMenuProps {
  isOpen: boolean;
  scrollToPropertyForm: () => void;
  handleContactClick: () => void;
}

export const MobileMenu = ({ isOpen, scrollToPropertyForm, handleContactClick }: MobileMenuProps) => {
  const { user, signOut } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="md:hidden">
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
        <button
          onClick={handleContactClick}
          className="w-full text-left text-primary hover:text-primary/90 px-3 py-2 rounded-md text-sm font-medium"
        >
          <Phone className="h-5 w-5 inline-block mr-1" aria-hidden="true" />
          <span>Contact</span>
        </button>
        {user ? (
          <button
            onClick={signOut}
            className="w-full text-left text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Sign out
          </button>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button data-testid="sign-in-button" variant="outline" size="sm" className="w-full">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </DialogTrigger>
            <AuthDialog isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
          </Dialog>
        )}
      </div>
    </div>
  );
}
