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
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NumberDisplay } from "@/components/NumberDisplay";
import { shouldShowWords } from "@/utils/numberFormatting";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type BuyerPropertyFormData = {
  propertyType: "residential" | "commercial" | "agricultural" | "undeveloped";
  listingType: "sale" | "rent" | "development_partnership";
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
};

export const BuyerPropertyForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<BuyerPropertyFormData>({
    defaultValues: {
      propertyType: "residential",
      listingType: "sale",
    },
  });

  const propertyType = form.watch("propertyType");
  const listingType = form.watch("listingType");
  const minPrice = form.watch("minPrice");
  const maxPrice = form.watch("maxPrice");

  const redirectToAuth = () => {
    window.location.href = "/login";
  };

  const onSubmit = async (data: BuyerPropertyFormData) => {
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

  return (
    <>
      {/* Authentication Required Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" /> Authentication Required
            </DialogTitle>
            <DialogDescription>
              You need to sign in or create an account to save your property requirements.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 flex flex-col gap-4">
            <p className="text-sm text-gray-600">
              Creating an account allows you to receive notifications when matching properties become available.
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
    
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {!user && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription>
                You'll need to sign in before saving your property requirements. Your form data will be preserved.
              </AlertDescription>
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
                      <Input 
                        type="number" 
                        placeholder="Enter minimum price" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e.target.valueAsNumber || undefined);
                        }}
                      />
                    </FormControl>
                    {field.value && shouldShowWords(field.value) && (
                      <div className="mt-1">
                        <NumberDisplay 
                          value={field.value} 
                          type="currency" 
                          className="text-xs" 
                          wordClassName="italic text-muted-foreground"
                        />
                      </div>
                    )}
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
                      <Input 
                        type="number" 
                        placeholder="Enter maximum price" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e.target.valueAsNumber || undefined);
                        }}
                      />
                    </FormControl>
                    {field.value && shouldShowWords(field.value) && (
                      <div className="mt-1">
                        <NumberDisplay 
                          value={field.value} 
                          type="currency" 
                          className="text-xs" 
                          wordClassName="italic text-muted-foreground"
                        />
                      </div>
                    )}
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
                    <FormLabel>Minimum Size (sq.ft)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter minimum size" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e.target.valueAsNumber || undefined);
                        }}
                      />
                    </FormControl>
                    {field.value && shouldShowWords(field.value) && (
                      <div className="mt-1">
                        <NumberDisplay 
                          value={field.value} 
                          type="number" 
                          className="text-xs" 
                          wordClassName="italic text-muted-foreground"
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Size (sq.ft)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter maximum size" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e.target.valueAsNumber || undefined);
                        }}
                      />
                    </FormControl>
                    {field.value && shouldShowWords(field.value) && (
                      <div className="mt-1">
                        <NumberDisplay 
                          value={field.value} 
                          type="number" 
                          className="text-xs" 
                          wordClassName="italic text-muted-foreground"
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full md:w-auto relative"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Save Requirements"}
            {!user && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs">
                Login Required
              </Badge>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};
