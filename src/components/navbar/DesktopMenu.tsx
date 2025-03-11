
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Home, LogIn, Phone, Users, Building, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "../auth/AuthDialog";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DesktopMenuProps {
  scrollToPropertyForm: () => void;
  handleContactClick: () => void;
}

export const DesktopMenu = ({ scrollToPropertyForm, handleContactClick }: DesktopMenuProps) => {
  const { user, signOut } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  
  return (
    <div className="hidden md:flex md:items-center md:space-x-6">
      <button
        onClick={() => window.location.href = '/'}
        className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors group relative"
      >
        <Home className="h-5 w-5 inline-block mr-1" aria-hidden="true" />
        <span>Home</span>
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
      </button>
      
      <button
        onClick={scrollToPropertyForm}
        className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors group relative"
      >
        <Building className="h-5 w-5 inline-block mr-1" aria-hidden="true" />
        <span>Properties</span>
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
      </button>
      
      <button
        onClick={scrollToPropertyForm}
        className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors group relative"
      >
        <Users className="h-5 w-5 inline-block mr-1" aria-hidden="true" />
        <span>Community</span>
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
      </button>
      
      <button
        onClick={handleContactClick}
        className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors group relative"
      >
        <Phone className="h-5 w-5 inline-block mr-1" aria-hidden="true" />
        <span>Contact</span>
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
      </button>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                {user.user_metadata?.avatar_url ? (
                  <AvatarImage src={user.user_metadata.avatar_url} alt={user.email || 'User'} />
                ) : (
                  <AvatarFallback className="bg-primary text-white">{user.email?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
                )}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="cursor-pointer font-medium text-sm" onClick={() => scrollToPropertyForm()}>
              <MapPin className="mr-2 h-4 w-4" />
              My Properties
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer font-medium text-sm" onClick={signOut}>
              <LogIn className="mr-2 h-4 w-4 rotate-180" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button data-testid="sign-in-button" variant="default" size="sm" className="bg-primary hover:bg-primary/90">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </DialogTrigger>
          <AuthDialog isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
        </Dialog>
      )}
    </div>
  );
};
