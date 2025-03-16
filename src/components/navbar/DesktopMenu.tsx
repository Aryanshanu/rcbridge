
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
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ChevronDown, Home, Building, Landmark, Calculator, MapPin } from "lucide-react";
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
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link 
              to="/" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/") && "text-primary font-semibold"
              )}
            >
              Home
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link 
              to="/properties" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/properties") && "text-primary font-semibold"
              )}
            >
              Properties
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link 
              to="/services" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/services") && "text-primary font-semibold"
              )}
            >
              Services
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link 
              to="/calculator" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/calculator") && "text-primary font-semibold"
              )}
            >
              Calculator
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto text-sm font-medium transition-colors hover:text-primary">
                  Resources <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
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
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {user ? (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 h-auto text-sm font-medium transition-colors hover:text-primary">
              {user.email} <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
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
        <>
          <Link to="/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Register</Button>
          </Link>
        </>
      )}
    </div>
  );
};
