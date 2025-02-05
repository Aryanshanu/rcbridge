import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const CallToAction = () => {
  const [isSchedulingDemo, setIsSchedulingDemo] = useState(false);
  const [demoEmail, setDemoEmail] = useState("");
  const [demoName, setDemoName] = useState("");
  const { signUpWithEmail } = useAuth();
  const { toast } = useToast();

  const handleDemoRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Here you would typically send this to your backend
      console.log("Demo requested for:", { demoName, demoEmail });
      toast({
        title: "Demo Request Received",
        description: "We'll contact you shortly to schedule your demo.",
      });
      setIsSchedulingDemo(false);
      setDemoEmail("");
      setDemoName("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule demo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateAccount = () => {
    // Use the existing auth dialog from Navbar
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
        >
          Create Your Account
        </Button>
        
        <Dialog open={isSchedulingDemo} onOpenChange={setIsSchedulingDemo}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-transparent border-2 border-white hover:bg-white/10 text-white"
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
                />
              </div>
              <Button type="submit" className="w-full">
                Request Demo
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};