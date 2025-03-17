
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface AuthDialogProps {
  isSignUp: boolean;
  setIsSignUp: (value: boolean) => void;
}

export const AuthDialog = ({ isSignUp, setIsSignUp }: AuthDialogProps) => {
  const { signInWithGoogle } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      // In case OAuth redirect doesn't happen right away
      setTimeout(() => {
        setIsGoogleLoading(false);
      }, 3000);
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader className="text-center">
        <DialogTitle className="text-xl font-bold">
          {isSignUp ? 'Join RC Bridge' : 'Welcome Back'}
        </DialogTitle>
        <DialogDescription className="mt-2 text-center">
          {isSignUp 
            ? 'Create an account to explore properties and join our community' 
            : 'Sign in to access your account and saved properties'}
        </DialogDescription>
      </DialogHeader>
      
      <div className="flex flex-col space-y-4 py-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="flex items-center justify-center space-x-2 py-6 transition-all hover:shadow-md w-full relative overflow-hidden group"
        >
          <div className="absolute inset-0 w-0 bg-gradient-to-r from-blue-50 to-indigo-50 transition-all duration-[400ms] ease-out group-hover:w-full"></div>
          <svg viewBox="0 0 48 48" width="20" height="20" className="relative z-10">
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
          <span className="font-medium relative z-10">
            {isGoogleLoading ? "Connecting..." : "Continue with Google"}
          </span>
          
          {isGoogleLoading && (
            <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent relative z-10"></div>
          )}
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200"></span>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-gray-500">or</span>
          </div>
        </div>
        
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setIsSignUp(!isSignUp);
          }}
          className="text-primary hover:text-primary/90 hover:bg-gray-50"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </Button>
      </div>
      
      <div className="mt-4 text-center text-xs text-gray-500">
        By continuing, you agree to RC Bridge's Terms of Service and Privacy Policy.
      </div>
    </DialogContent>
  );
};
