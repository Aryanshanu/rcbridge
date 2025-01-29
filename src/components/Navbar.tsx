import { useState } from "react";
import { Menu, X, Home, Users, Phone, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signInWithGoogle, signOut } = useAuth();

  const scrollToPropertyForm = () => {
    const formElement = document.querySelector('#property-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactClick = () => {
    window.location.href = "mailto:aryan@rcbridge.co";
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/lovable-uploads/5fd561ff-5bbd-449c-94a3-d39d0a8b4f03.png"
                alt="RC Bridge"
              />
            </div>
          </div>

          {/* Desktop menu */}
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
                      <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} />
                      <AvatarFallback>{user.user_metadata.full_name?.charAt(0) ?? 'U'}</AvatarFallback>
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
              <Button onClick={signInWithGoogle} variant="outline" size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                Sign in with Google
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full text-left text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              <Home className="h-5 w-5 inline-block mr-1" aria-hidden="true" />
              <span>Home</span>
            </button>
            <button
              onClick={scrollToPropertyForm}
              className="w-full text-left text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              <Users className="h-5 w-5 inline-block mr-1" aria-hidden="true" />
              <span>Community</span>
            </button>
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
              <button
                onClick={signInWithGoogle}
                className="w-full text-left text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                <LogIn className="h-5 w-5 inline-block mr-1" />
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};