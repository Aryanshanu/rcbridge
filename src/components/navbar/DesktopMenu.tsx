
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Home, LogIn, Phone, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "../auth/AuthDialog";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DesktopMenuProps {
  scrollToPropertyForm: () => void;
  handleContactClick: () => void;
}

export const DesktopMenu = ({ scrollToPropertyForm, handleContactClick }: DesktopMenuProps) => {
  const { user, signOut } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  
  return (
    <div className="hidden md:flex md:items-center md:space-x-4">
      <button
        onClick={() => window.location.href = '/'}
        className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
      >
        <Home className="h-5 w-5 inline-block mr-1" aria-hidden="true" />
        <span>Home</span>
      </button>
      <button
        onClick={scrollToPropertyForm}
        className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
      >
        <Users className="h-5 w-5 inline-block mr-1" aria-hidden="true" />
        <span>Community</span>
      </button>
      <button
        onClick={handleContactClick}
        className="text-primary hover:text-primary/90 px-3 py-2 rounded-md text-sm font-medium"
      >
        <Phone className="h-5 w-5 inline-block mr-1" aria-hidden="true" />
        <span>Contact</span>
      </button>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user.email?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={signOut}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button data-testid="sign-in-button" variant="outline" size="sm">
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
