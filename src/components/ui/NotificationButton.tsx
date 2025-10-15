
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { propertyAlertSchema } from "@/utils/validation/schemas";
import { z } from "zod";

type PropertyType = 'residential' | 'commercial' | 'agricultural' | 'undeveloped';
type ListingType = 'sale' | 'rent' | 'development_partnership';

export const NotificationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [listingType, setListingType] = useState<ListingType | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertCount, setAlertCount] = useState(0); 
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Check if a property type is selected
  const isPropertyTypeSelected = (type: PropertyType) => {
    return propertyTypes.includes(type);
  };

  // Toggle property type selection
  const togglePropertyType = (type: PropertyType) => {
    if (isPropertyTypeSelected(type)) {
      setPropertyTypes(propertyTypes.filter(t => t !== type));
    } else {
      setPropertyTypes([...propertyTypes, type]);
    }
  };

  // Redirect to authentication page
  const redirectToAuth = () => {
    window.location.href = "/login";
  };

  // Fetch user's existing alerts count if logged in
  useEffect(() => {
    const fetchAlertCount = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('property_alerts')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error fetching alerts:', error);
          return;
        }
        
        setAlertCount(data?.length || 0);
        
        // Pre-fill email if user is logged in
        if (user.email) {
          setEmail(user.email);
        }
        
        // Try to get profile data
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profiles) {
          // Use any saved preferences if available
        }
      } else {
        // Reset alert count for non-logged in users
        setAlertCount(0);
      }
    };
    
    fetchAlertCount();
  }, [user]);

  const validateForm = () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please provide your email address to receive alerts.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!location) {
      toast({
        title: "Location required",
        description: "Please specify a location for property alerts.",
        variant: "destructive",
      });
      return false;
    }
    
    if (propertyTypes.length === 0) {
      toast({
        title: "Property type required",
        description: "Please select at least one property type.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // SECURITY FIX: Validate and sanitize inputs before saving
      for (const propertyType of propertyTypes) {
        try {
          const alertData = {
            user_id: user.id,
            location,
            property_type: propertyType,
            listing_type: listingType || null,
            min_price: minPrice ? parseFloat(minPrice) : null,
            max_price: maxPrice ? parseFloat(maxPrice) : null,
            is_active: true
          };

          // Validate data before inserting
          propertyAlertSchema.parse(alertData);
          
          const { error } = await supabase.from('property_alerts').insert(alertData);
          
          if (error) {
            console.error('Error saving alert:', error);
            throw new Error(error.message);
          }
        } catch (validationError) {
          if (validationError instanceof z.ZodError) {
            console.error("Validation error:", validationError.errors);
            toast({
              title: "Invalid Input",
              description: validationError.errors[0]?.message || "Please check your inputs",
              variant: "destructive",
            });
            return;
          }
          throw validationError;
        }
      }
      
      // We're removing the user analytics tracking since the table doesn't exist
      // This can be added back when the table is created
      
      toast({
        title: "Notification preferences saved",
        description: "You'll be notified about new properties matching your criteria.",
      });
      
      // Reset form and close dialog
      setIsOpen(false);
      setLocation("");
      setMinPrice("");
      setMaxPrice("");
      setPropertyTypes([]);
      setListingType("");
      
      // Update alert count
      const { data } = await supabase
        .from('property_alerts')
        .select('*')
        .eq('user_id', user.id);
        
      if (data) {
        setAlertCount(data.length);
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error saving preferences",
        description: error.message || "There was a problem saving your alert preferences.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 group"
        aria-label="Get property notifications"
      >
        <Bell className="h-6 w-6" />
        {alertCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {alertCount}
          </span>
        )}
        <span className="absolute left-0 -ml-28 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Property Alerts
        </span>
      </button>

      {/* Authentication Required Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" /> Authentication Required
            </DialogTitle>
            <DialogDescription>
              You need to sign in or create an account to set up property alerts.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 flex flex-col gap-4">
            <p className="text-sm text-gray-600">
              Creating an account helps us personalize your property alerts and send notifications directly to you.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAuthDialog(false)}>
                Cancel
              </Button>
              <Button onClick={redirectToAuth}>
                Sign In / Sign Up
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Get Property Alerts</DialogTitle>
            <DialogDescription>
              Stay updated with new properties that match your criteria. We'll notify you when something perfect comes along.
            </DialogDescription>
          </DialogHeader>
          
          {!user && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription>
                You'll need to sign in before setting up property alerts. All your preferences will be preserved.
              </AlertDescription>
            </Alert>
          )}
          
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
                disabled={Boolean(user)}
              />
              {user && <p className="text-xs text-gray-500">Email from your account</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="E.g., Hyderabad, Banjara Hills"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="price-range" className="text-sm font-medium">
                Price Range (₹)
              </label>
              <div className="flex gap-2">
                <Input
                  id="min-price"
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                />
                <Input
                  id="max-price"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Property Type</label>
              <div className="flex flex-wrap gap-3">
                <Button 
                  type="button" 
                  variant={isPropertyTypeSelected("residential") ? "default" : "outline"} 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => togglePropertyType("residential")}
                >
                  Residential
                </Button>
                <Button 
                  type="button" 
                  variant={isPropertyTypeSelected("commercial") ? "default" : "outline"} 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => togglePropertyType("commercial")}
                >
                  Commercial
                </Button>
                <Button 
                  type="button" 
                  variant={isPropertyTypeSelected("agricultural") ? "default" : "outline"} 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => togglePropertyType("agricultural")}
                >
                  Agricultural
                </Button>
                <Button 
                  type="button" 
                  variant={isPropertyTypeSelected("undeveloped") ? "default" : "outline"} 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => togglePropertyType("undeveloped")}
                >
                  Undeveloped
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Listing Type</label>
              <div className="flex flex-wrap gap-3">
                <Button 
                  type="button" 
                  variant={listingType === "sale" ? "default" : "outline"} 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => setListingType(listingType === "sale" ? "" : "sale")}
                >
                  For Sale
                </Button>
                <Button 
                  type="button" 
                  variant={listingType === "rent" ? "default" : "outline"} 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => setListingType(listingType === "rent" ? "" : "rent")}
                >
                  For Rent
                </Button>
                <Button 
                  type="button" 
                  variant={listingType === "development_partnership" ? "default" : "outline"} 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => setListingType(listingType === "development_partnership" ? "" : "development_partnership")}
                >
                  Development
                </Button>
              </div>
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Preferences"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
