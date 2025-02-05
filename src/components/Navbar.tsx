import { useState } from "react";
import { Menu, X, Home, Users, Phone, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, signInWithEmail, signUpWithEmail, signOut } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      await signUpWithEmail(email, password);
    } else {
      await signInWithEmail(email, password);
    }
    setEmail("");
    setPassword("");
  };

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
                  <Button variant="outline" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{isSignUp ? 'Create an account' : 'Sign in to your account'}</DialogTitle>
                    <DialogDescription>
                      {isSignUp ? 'Enter your details to create a new account' : 'Enter your credentials to sign in'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button type="submit">
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsSignUp(!isSignUp)}
                      >
                        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{isSignUp ? 'Create an account' : 'Sign in to your account'}</DialogTitle>
                    <DialogDescription>
                      {isSignUp ? 'Enter your details to create a new account' : 'Enter your credentials to sign in'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-mobile">Email</Label>
                      <Input
                        id="email-mobile"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-mobile">Password</Label>
                      <Input
                        id="password-mobile"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button type="submit">
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsSignUp(!isSignUp)}
                      >
                        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};