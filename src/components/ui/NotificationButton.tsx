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
import type { Database } from "@/integrations/supabase/types";

type PropertyType = Database['public']['Enums']['property_type'];
type ListingType = Database['public']['Enums']['listing_type'];

const propertyTypes = [
  { value: 'residential' as PropertyType, label: 'Residential' },
  { value: 'commercial' as PropertyType, label: 'Commercial' },
  { value: 'agricultural' as PropertyType, label: 'Agricultural' },
  { value: 'luxury' as PropertyType, label: 'Luxury' },
];

export const NotificationButton = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<PropertyType[]>([]);
  const [listingTypes, setListingTypes] = useState({ sale: false, rent: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertCount, setAlertCount] = useState(0); 
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  const isPropertyTypeSelected = (type: PropertyType) => {
    return selectedPropertyTypes.includes(type);
  };

  const togglePropertyType = (type: PropertyType) => {
    if (isPropertyTypeSelected(type)) {
      setSelectedPropertyTypes(selectedPropertyTypes.filter(t => t !== type));
    } else {
      setSelectedPropertyTypes([...selectedPropertyTypes, type]);
    }
  };

  const redirectToAuth = () => {
    window.location.href = "/login";
  };

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
      
      if (user.email) {
        setEmail(user.email);
      }
    } else {
      setAlertCount(0);
    }
  };

  useEffect(() => {
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
    
    if (selectedPropertyTypes.length === 0) {
      toast({
        title: "Property type required",
        description: "Please select at least one property type.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedTypes = propertyTypes.filter(type => 
        isPropertyTypeSelected(type.value)
      );

      if (selectedTypes.length === 0) {
        toast({
          title: "Selection Required",
          description: "Please select at least one property type",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Validate and coerce prices
      const minPriceNum = minPrice ? parseFloat(minPrice) : null;
      const maxPriceNum = maxPrice ? parseFloat(maxPrice) : null;

      if (minPriceNum !== null && isNaN(minPriceNum)) {
        toast({
          title: "Invalid Price",
          description: "Minimum price must be a valid number",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (maxPriceNum !== null && isNaN(maxPriceNum)) {
        toast({
          title: "Invalid Price",
          description: "Maximum price must be a valid number",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (minPriceNum !== null && maxPriceNum !== null && minPriceNum > maxPriceNum) {
        toast({
          title: "Invalid Range",
          description: "Minimum price cannot be greater than maximum price",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const alertsToInsert = selectedTypes.flatMap(type => {
        const baseAlert = {
          user_id: user.id,
          location,
          min_price: minPriceNum,
          max_price: maxPriceNum,
          property_type: type.value,
          min_size: null,
          max_size: null,
          is_active: true,
        };

        if (listingTypes.sale && listingTypes.rent) {
          return [
            { ...baseAlert, listing_type: 'sale' as ListingType },
            { ...baseAlert, listing_type: 'rent' as ListingType },
          ];
        } else if (listingTypes.sale) {
          return [{ ...baseAlert, listing_type: 'sale' as ListingType }];
        } else if (listingTypes.rent) {
          return [{ ...baseAlert, listing_type: 'rent' as ListingType }];
        }
        return [];
      });

      if (alertsToInsert.length === 0) {
        toast({
          title: "Selection Required",
          description: "Please select at least one listing type (For Sale or For Rent)",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from('property_alerts')
        .insert(alertsToInsert);

      if (error) {
        // Handle enum mismatch gracefully
        if (error.code === '22P02' && error.message.includes('invalid input value for enum')) {
          console.warn('Enum mismatch, retrying without listing_type');
          const fallbackAlerts = alertsToInsert.map(alert => ({
            ...alert,
            listing_type: null,
          }));
          const { error: retryError } = await supabase
            .from('property_alerts')
            .insert(fallbackAlerts);
          
          if (retryError) throw retryError;
          
          toast({
            title: "Alert Saved",
            description: "Your preferences have been saved (listing type excluded)",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Alert Saved",
          description: "We'll notify you when matching properties are available",
        });
      }

      setOpen(false);
      setEmail('');
      setLocation('');
      setMinPrice('');
      setMaxPrice('');
      setSelectedPropertyTypes([]);
      setListingTypes({ sale: false, rent: false });
      
      fetchAlertCount();
    } catch (error) {
      console.error('Error saving alert:', error);
      toast({
        title: "Error",
        description: "Failed to save your alert preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 group relative"
        aria-label="Get property notifications"
      >
        <Bell className="h-9 w-9" />
        {alertCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {alertCount}
          </span>
        )}
        <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Property Alerts
        </span>
      </button>

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

      <Dialog open={open} onOpenChange={setOpen}>
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
          
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4 py-4">
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
                {propertyTypes.map((type) => (
                  <Button 
                    key={type.value}
                    type="button" 
                    variant={isPropertyTypeSelected(type.value) ? "default" : "outline"} 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => togglePropertyType(type.value)}
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Listing Type</label>
              <div className="flex flex-wrap gap-3">
                <Button 
                  type="button" 
                  variant={listingTypes.sale ? "default" : "outline"} 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => setListingTypes({ ...listingTypes, sale: !listingTypes.sale })}
                >
                  For Sale
                </Button>
                <Button 
                  type="button" 
                  variant={listingTypes.rent ? "default" : "outline"} 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => setListingTypes({ ...listingTypes, rent: !listingTypes.rent })}
                >
                  For Rent
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
