import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Lock, Mail, Loader2 } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Sign in with email/password
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        throw signInError;
      }

      if (!authData.session) {
        throw new Error("No session returned after sign in");
      }

      // Verify admin access server-side
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
        'verify-admin',
        {
          headers: {
            Authorization: `Bearer ${authData.session.access_token}`
          }
        }
      );

      if (verifyError || !verifyData?.authorized) {
        // Not authorized - sign out and reject
        await supabase.auth.signOut();
        throw new Error("You are not authorized to access the admin portal");
      }

      // Success! Welcome admin
      toast({
        title: "Welcome, Admin!",
        description: `You have been granted ${verifyData.role} access`,
      });

      navigate('/admin', { replace: true });

    } catch (error: any) {
      console.error('Admin login error:', error);
      
      toast({
        title: "Access Denied",
        description: error.message || "Invalid credentials or insufficient permissions",
        variant: "destructive"
      });

      // Make sure user is signed out on failure
      await supabase.auth.signOut();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Admin Login - RC Bridge"
        description="Secure admin portal access for RC Bridge platform administrators"
        noindex
      />
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
            <CardDescription>
              Secure access for authorized administrators only
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Admin Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@rcbridge.co"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-background"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying Access...
                  </>
                ) : (
                  "Sign In to Admin Portal"
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <p>Need help? Contact support at</p>
                <a 
                  href="mailto:aryan@rcbridge.co" 
                  className="text-primary hover:underline font-medium"
                >
                  aryan@rcbridge.co
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
