
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
import { useToast } from "@/components/ui/use-toast";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, resendVerificationEmail } = useAuth();
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const { toast } = useToast();

  const validatePassword = (pass: string) => {
    const hasMinLength = pass.length >= 8;
    const hasNumber = /\d/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return hasMinLength && hasNumber && hasSpecialChar;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setIsPasswordValid(validatePassword(newPassword));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      if (!isPasswordValid) {
        toast({
          title: "Invalid password",
          description: "Password must be at least 8 characters long and contain numbers and special characters.",
          variant: "destructive",
        });
        return;
      }
      
      if (password !== confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "Please ensure both passwords match.",
          variant: "destructive",
        });
        return;
      }
      
      await signUpWithEmail(email, password);
    } else {
      await signInWithEmail(email, password);
    }
    
    setEmail("");
    setPassword("");
    setConfirmPassword("");
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
                  <Button data-testid="sign-in-button" variant="outline" size="sm">
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
                        onChange={handlePasswordChange}
                        required
                      />
                      {isSignUp && (
                        <p className="text-sm text-gray-500">
                          Password must be at least 8 characters long and contain numbers and special characters.
                        </p>
                      )}
                    </div>
                    {isSignUp && (
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    )}
                    <div className="flex flex-col space-y-2">
                      <Button type="submit">
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                      </Button>
                      
                      <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                      </div>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={signInWithGoogle}
                        className="flex items-center justify-center space-x-2"
                      >
                        <svg viewBox="0 0 48 48" width="16" height="16">
                          <path
                            fill="#EA4335"
                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                          />
                          <path
                            fill="#4285F4"
                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                          />
                          <path
                            fill="#34A853"
                            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                          />
                        </svg>
                        <span>Google</span>
                      </Button>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setIsSignUp(!isSignUp);
                          setPassword("");
                          setConfirmPassword("");
                        }}
                      >
                        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                      </Button>
                      {!isSignUp && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => resendVerificationEmail(email)}
                        >
                          Resend verification email
                        </Button>
                      )}
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
                  <Button data-testid="sign-in-button" variant="outline" size="sm" className="w-full">
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
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    {isSignUp && (
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword-mobile">Confirm Password</Label>
                        <Input
                          id="confirmPassword-mobile"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    )}
                    <div className="flex flex-col space-y-2">
                      <Button type="submit">
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                      </Button>
                      
                      <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                      </div>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={signInWithGoogle}
                        className="flex items-center justify-center space-x-2"
                      >
                        <svg viewBox="0 0 48 48" width="16" height="16">
                          <path
                            fill="#EA4335"
                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                          />
                          <path
                            fill="#4285F4"
                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                          />
                          <path
                            fill="#34A853"
                            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                          />
                        </svg>
                        <span>Google</span>
                      </Button>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setIsSignUp(!isSignUp);
                          setPassword("");
                          setConfirmPassword("");
                        }}
                      >
                        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                      </Button>
                      {!isSignUp && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => resendVerificationEmail(email)}
                        >
                          Resend verification email
                        </Button>
                      )}
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
