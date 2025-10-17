
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, LogIn, MapPin, Phone, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getUserRole } from "@/utils/admin/userUtils";

interface DesktopMenuProps {
  scrollToPropertyForm: () => void;
  handleContactClick: () => void;
}

// Helper function to get initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const DesktopMenu = ({ scrollToPropertyForm, handleContactClick }: DesktopMenuProps) => {
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // Get user display name and initials
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";
  const initials = getInitials(displayName);

  // Fetch user role when user changes
  useEffect(() => {
    if (user) {
      getUserRole().then(role => setUserRole(role));
    } else {
      setUserRole(null);
    }
  }, [user]);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isSigningOut) return;
    
    try {
      setIsSigningOut(true);
      toast.loading("Signing out...");
      await signOut();
    } catch (error) {
      console.error("Error during sign out:", error);
      setIsSigningOut(false);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <div className="hidden md:flex items-center space-x-8">
      <Link to="/" className="text-gray-700 hover:text-primary font-medium">
        Home
      </Link>
      <Link to="/properties" className="text-gray-700 hover:text-primary font-medium">
        Properties
      </Link>
      <Link to="/services" className="text-gray-700 hover:text-primary font-medium">
        Services
      </Link>
      <Link to="/calculator" className="text-gray-700 hover:text-primary font-medium">
        Calculator
      </Link>
      <div className="relative group">
        <div className="text-gray-700 hover:text-primary font-medium cursor-pointer">
          Resources
          <div className="absolute bg-white shadow-md py-2 rounded-md mt-2 z-50 min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
            <Link to="/blog" className="block px-4 py-2 hover:bg-gray-50 text-gray-700">
              Blog
            </Link>
            <Link to="/faq" className="block px-4 py-2 hover:bg-gray-50 text-gray-700">
              FAQ
            </Link>
            <Link to="/contact" className="block px-4 py-2 hover:bg-gray-50 text-gray-700">
              Contact
            </Link>
          </div>
        </div>
      </div>
      
      {user ? (
        <div className="relative group">
          <div className="flex items-center hover:text-primary font-medium cursor-pointer gap-2">
            <Avatar className="h-8 w-8 bg-primary text-white">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="text-gray-700">{displayName}</span>
            
            <div className="absolute bg-white shadow-md py-2 rounded-md mt-2 right-0 top-full z-50 min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-50 text-gray-700">
                Profile
              </Link>
              <Link to="/my-properties" className="block px-4 py-2 hover:bg-gray-50 text-gray-700">
                My Properties
              </Link>
              <Link to="/saved-searches" className="block px-4 py-2 hover:bg-gray-50 text-gray-700">
                Saved Searches
              </Link>
              
              {userRole && ['admin', 'developer', 'maintainer'].includes(userRole) && (
                <Link to="/admin" className="flex items-center px-4 py-2 hover:bg-gray-50 text-gray-700">
                  <Shield className="h-4 w-4 mr-1.5" />
                  Admin Dashboard
                </Link>
              )}
              
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex w-full items-center text-left px-4 py-2 hover:bg-gray-50 text-red-600"
              >
                <LogOut className="h-4 w-4 mr-1.5" />
                {isSigningOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Link to="/login">
          <Button variant="outline" className="flex items-center" size="sm">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </Link>
      )}
      
      <Button size="sm" onClick={scrollToPropertyForm}>
        List Property
      </Button>
    </div>
  );
};
