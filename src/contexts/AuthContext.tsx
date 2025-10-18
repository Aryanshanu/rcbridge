
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { z } from "zod";

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
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const previousUser = user;
      const currentUser = session?.user ?? null;
      
      if (event === 'SIGNED_OUT') {
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
      const redirectUrl = window.location.origin;
      
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
        throw error;
      }
      
      // If the URL property exists in the response, redirect the user
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      uiToast({
        title: "Error signing in with Google",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
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
      // Validate password strength before submitting to Supabase
      const passwordSchema = z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

      const validation = passwordSchema.safeParse(password);
      if (!validation.success) {
        throw new Error(validation.error.issues[0].message);
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
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
      // Clear user state first to prevent any race conditions
      setUser(null);
      
      // Get all localStorage keys related to Supabase
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const keyPrefix = projectId ? `sb-${projectId}` : 'sb-';
      
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(keyPrefix)) {
          keysToRemove.push(key);
        }
      }
      
      // Remove all matched keys
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Clear any session cookies
      document.cookie.split(";").forEach(c => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Clear session storage items
      sessionStorage.clear();
      
      // Call Supabase signOut after clearing storage
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        throw error;
      }
      
      // Notify user
      toast.success("Signed out successfully");
      
      // Force page reload to clear any remaining state
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
      
    } catch (error: any) {
      toast.error("Error signing out: " + (error.message || "Please try again"));
      
      // Attempt a more aggressive approach if normal signout fails
      try {
        // Force clear all storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Force reload the page
        window.location.href = '/';
      } catch (e) {
        // Final fallback failed - user may need to clear cookies manually
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
