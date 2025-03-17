
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, LockIcon, UserIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { NumberInput } from "@/components/ui/NumberInput";
import { BuyerFormData } from "./types";
import { useNavigate } from "react-router-dom";

export const BuyerPropertyForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<BuyerFormData>({
    defaultValues: {
      propertyType: "residential",
      listingType: "sale",
    },
  });

  const propertyType = form.watch("propertyType");
  const listingType = form.watch("listingType");

  const redirectToAuth = () => {
    setShowAuthDialog(false);
    navigate("/login", { state: { returnTo: window.location.pathname } });
  };

  const onSubmit = async (data: BuyerFormData) => {
    // Check if user is authenticated
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log("Submitting buyer requirements:", data);

      const { error } = await supabase.from("property_alerts").insert({
        property_type: data.propertyType,
        listing_type: data.listingType,
        min_price: data.minPrice,
        max_price: data.maxPrice,
        min_size: data.minSize,
        max_size: data.maxSize,
        location: data.location,
        user_id: user.id
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your property requirements have been saved. We'll notify you when matching properties are listed.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting requirements:", error);
      toast({
        title: "Error",
        description: "Failed to save your requirements. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to determine if we should display acres (for agricultural land) or sq.ft
  const getSizeUnit = () => {
    return propertyType === "agricultural" ? "acres" : "sq.ft";
  };

  return (
    <>
      {/* Authentication Required Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LockIcon className="h-5 w-5" /> Authentication Required
            </DialogTitle>
            <DialogDescription>
              You need to sign in or create an account to save your property requirements.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
              <div className="flex items-start">
                <UserIcon className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-amber-800">
                    Creating an account allows you to:
                  </p>
                  <ul className="list-disc ml-5 mt-1 text-sm text-amber-700">
                    <li>Receive notifications when matching properties are listed</li>
                    <li>Save multiple property requirement profiles</li>
                    <li>Contact sellers directly through the platform</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setShowAuthDialog(false)}>
              Cancel
            </Button>
            <Button onClick={redirectToAuth}>
              Sign In / Sign Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {!user && (
            <Alert variant="destructive" className="mb-4 bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Authentication Required</AlertTitle>
              <AlertDescription className="text-amber-700">
                You'll need to sign in before saving your property requirements. Your form data will be preserved.
              </AlertDescription>
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200"
                  onClick={redirectToAuth}
                >
                  Sign In Now
                </Button>
              </div>
            </Alert>
          )}
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Property Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="residential" id="r-residential" />
                          <label htmlFor="r-residential">Residential</label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="commercial" id="r-commercial" />
                          <label htmlFor="r-commercial">Commercial</label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="agricultural" id="r-agricultural" />
                          <label htmlFor="r-agricultural">Agricultural</label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="undeveloped" id="r-undeveloped" />
                          <label htmlFor="r-undeveloped">Undeveloped Land</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="listingType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Looking to</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="sale" id="r-buy" />
                          <label htmlFor="r-buy">Buy</label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="rent" id="r-rent" />
                          <label htmlFor="r-rent">Rent</label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="development_partnership" id="r-partner" />
                          <label htmlFor="r-partner">Development Partnership</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Price Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="minPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Price (₹)</FormLabel>
                    <FormControl>
                      <NumberInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter minimum price"
                        displayType="currency"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Price (₹)</FormLabel>
                    <FormControl>
                      <NumberInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter maximum price"
                        displayType="currency"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter preferred location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Size Range */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Size Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="minSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Size ({getSizeUnit()})</FormLabel>
                    <FormControl>
                      <NumberInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={`Enter minimum size (${getSizeUnit()})`}
                        displayType="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Size ({getSizeUnit()})</FormLabel>
                    <FormControl>
                      <NumberInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={`Enter maximum size (${getSizeUnit()})`}
                        displayType="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Save Requirements"}
            </Button>
            
            {!user && (
              <div className="mt-2 text-center md:text-left">
                <Badge variant="destructive" className="text-xs">
                  Login Required
                </Badge>
              </div>
            )}
          </div>
        </form>
      </Form>
    </>
  );
};
