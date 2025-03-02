import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const CallToAction = () => {
  const [isSchedulingDemo, setIsSchedulingDemo] = useState(false);
  const [demoEmail, setDemoEmail] = useState("");
  const [demoName, setDemoName] = useState("");
  const { toast } = useToast();
  const { signInWithGoogle } = useAuth();

  const handleDemoRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('demo_requests')
        .insert({
          name: demoName,
          email: demoEmail,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Demo Request Received",
        description: "We'll contact you shortly to schedule your demo.",
      });
      
      setIsSchedulingDemo(false);
      setDemoEmail("");
      setDemoName("");
      
      console.log("Demo requested for:", { demoName, demoEmail });
      
    } catch (error: any) {
      console.error("Error scheduling demo:", error);
      toast({
        title: "Error",
        description: "Failed to schedule demo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateAccount = () => {
    const signInButton = document.querySelector('[data-testid="sign-in-button"]') as HTMLButtonElement;
    if (signInButton) {
      signInButton.click();
    } else {
      toast({
        title: "Error",
        description: "Couldn't find the sign-in button. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle();
  };

  return (
    <section className="bg-primary rounded-lg p-6 sm:p-12 text-center text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Get Started?</h2>
      <p className="text-lg sm:text-xl mb-6 sm:mb-8">
        Join RCBridge today and become part of Hyderabad's most innovative property marketplace.
      </p>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Button
          onClick={handleCreateAccount}
          className="bg-white text-primary hover:bg-gray-100"
          data-testid="create-account-button"
        >
          Create Your Account
        </Button>
        
        <Button
          onClick={handleGoogleSignIn}
          variant="outline"
          className="bg-transparent border-2 border-white hover:bg-white/10 text-white flex items-center justify-center space-x-2"
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
          <span>Sign in with Google</span>
        </Button>
        
        <Dialog open={isSchedulingDemo} onOpenChange={setIsSchedulingDemo}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-transparent border-2 border-white hover:bg-white/10 text-white"
              data-testid="schedule-demo-button"
            >
              Schedule a Demo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule a Demo</DialogTitle>
              <DialogDescription>
                Fill out the form below and we'll contact you to schedule a personalized demo.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleDemoRequest} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={demoName}
                  onChange={(e) => setDemoName(e.target.value)}
                  placeholder="Your name"
                  required
                  data-testid="demo-name-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={demoEmail}
                  onChange={(e) => setDemoEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  data-testid="demo-email-input"
                />
              </div>
              <Button type="submit" className="w-full" data-testid="submit-demo-request">
                Request Demo
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};
