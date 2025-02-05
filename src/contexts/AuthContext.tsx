import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;

      if (!data.user?.email_confirmed_at) {
        toast({
          title: "Email not verified",
          description: "Please check your email and verify your account.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast({
        title: "Error signing in",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      
      if (error) throw error;

      toast({
        title: "Check your email",
        description: "We've sent you a verification link to complete your registration.",
      });
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: "Error signing up",
        description: error.message || "Please try again with a different email or password.",
        variant: "destructive",
      });
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) throw error;

      toast({
        title: "Verification email sent",
        description: "Please check your email for the verification link.",
      });
    } catch (error: any) {
      console.error('Error resending verification:', error);
      toast({
        title: "Error sending verification email",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
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
    signInWithEmail,
    signUpWithEmail,
    signOut,
    resendVerificationEmail,
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