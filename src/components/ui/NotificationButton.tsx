
import { useState } from "react";
import { Bell } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export const NotificationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add subscription logic here
    
    toast({
      title: "Notification preferences saved",
      description: "You'll be notified about new properties matching your criteria.",
    });
    
    setIsOpen(false);
    setEmail("");
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 group"
        aria-label="Get property notifications"
      >
        <Bell className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          3
        </span>
        <span className="absolute left-0 -ml-28 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Property Alerts
        </span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Get Property Alerts</DialogTitle>
            <DialogDescription>
              Stay updated with new properties that match your criteria. We'll notify you when something perfect comes along.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="outline" size="sm" className="rounded-full">
                Apartments
              </Button>
              <Button type="button" variant="outline" size="sm" className="rounded-full">
                Villas
              </Button>
              <Button type="button" variant="outline" size="sm" className="rounded-full">
                Commercial
              </Button>
              <Button type="button" variant="outline" size="sm" className="rounded-full">
                Plots
              </Button>
              <Button type="button" variant="outline" size="sm" className="rounded-full">
                New Projects
              </Button>
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="submit">Save Preferences</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
