
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const previousUser = user;
      const currentUser = session?.user ?? null;
      
      setUser(currentUser);
      
      // If user wasn't logged in before and now is, show welcome animation
      if (!previousUser && currentUser) {
        setShowWelcome(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [user]);

  const signInWithGoogle = async () => {
    try {
      console.log("Starting Google Sign In process...");
      
      // Get the current window location for debugging
      console.log("Current window location:", window.location.href);
      
      // Build and log the redirectTo URL for debugging
      const redirectUrl = window.location.origin;
      console.log("Redirect URL being used:", redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error('Detailed Google sign-in error:', {
          message: error.message,
          status: error.status,
          name: error.name,
          stack: error.stack
        });
        throw error;
      }
      
      console.log("Google Sign In successful, data:", data);
      
      // If the URL property exists in the response, redirect the user
      if (data?.url) {
        console.log("Redirecting to:", data.url);
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      toast({
        title: "Error signing in with Google",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Starting email/password sign in process...");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      console.log("Sign in successful:", data);
      // Not returning data
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast({
        title: "Error signing in",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      console.log("Starting sign up process...");
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }
      
      console.log("Sign up successful:", data);
      // Not returning data
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: "Error signing up",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: error.message || "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    loading,
    showWelcome,
    setShowWelcome,
    signInWithGoogle,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
