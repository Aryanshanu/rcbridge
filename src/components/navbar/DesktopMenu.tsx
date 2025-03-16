
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface DesktopMenuProps {
  className?: string;
  scrollToPropertyForm?: () => void;
  handleContactClick?: () => void;
}

export const DesktopMenu: React.FC<DesktopMenuProps> = ({ className, scrollToPropertyForm, handleContactClick }) => {
  const { user, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`hidden lg:flex items-center space-x-6 ${className}`}>
      <div className="flex space-x-6">
        <Link 
          to="/" 
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isActive("/") && "text-primary font-semibold"
          )}
        >
          Home
        </Link>
        <Link 
          to="/properties" 
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isActive("/properties") && "text-primary font-semibold"
          )}
        >
          Properties
        </Link>
        <Link 
          to="/services" 
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isActive("/services") && "text-primary font-semibold"
          )}
        >
          Services
        </Link>
        <Link 
          to="/calculator" 
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isActive("/calculator") && "text-primary font-semibold"
          )}
        >
          Calculator
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 h-auto text-sm font-medium transition-colors hover:text-primary">
              Resources <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white shadow-md z-50">
            <DropdownMenuItem>
              <Link to="/blog" className="w-full">Blog</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/faq" className="w-full">FAQ</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/contact" className="w-full">Contact Us</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center ml-6">
        {user ? (
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-auto text-sm font-medium transition-colors hover:text-primary">
                {user.email} <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white shadow-md z-50">
              <DropdownMenuItem>
                <Link to="/profile" className="w-full">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/my-properties" className="w-full">My Properties</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/saved-searches" className="w-full">Saved Searches</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex space-x-3">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Register</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
