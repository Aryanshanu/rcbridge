
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";

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
  const { toast: uiToast } = useToast();

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "User session found" : "No session found");
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session ? "Session exists" : "No session");
      
      const previousUser = user;
      const currentUser = session?.user ?? null;
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing user state');
        setUser(null);
      } else {
        setUser(currentUser);
      }
      
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
      uiToast({
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
      uiToast({
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
      uiToast({
        title: "Error signing up",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out user...");
      
      // Clear all local storage items related to Supabase
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const keyPrefix = 'sb-' + projectId;
      
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(keyPrefix)) {
          console.log('Removing localStorage item:', key);
          localStorage.removeItem(key);
        }
      });
      
      // Call Supabase signOut after clearing storage
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      
      // Force clear the user state after signout
      setUser(null);
      
      // Notify user
      toast.success("Signed out successfully");
      
      // Redirect to home page with a full page reload
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
      
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error("Error signing out: " + (error.message || "Please try again"));
      
      // Attempt a more aggressive approach if normal signout fails
      try {
        // Force clear all auth state
        localStorage.clear();
        setUser(null);
        window.location.href = '/';
      } catch (e) {
        console.error('Final fallback error:', e);
      }
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
