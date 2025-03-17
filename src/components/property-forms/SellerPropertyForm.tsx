
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { PropertyImageUpload } from "@/components/PropertyImageUpload";
import { PropertyImageGallery } from "@/components/PropertyImageGallery";
import { PropertyTypeSection } from "./PropertyTypeSection";
import { ListingTypeSection } from "./ListingTypeSection";
import { BasicInformationSection } from "./BasicInformationSection";
import { PropertyDetailsSection } from "./PropertyDetailsSection";
import { FeaturesAmenitiesSection } from "./FeaturesAmenitiesSection";
import { SellerPropertyFormData } from "./types";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, LockIcon } from "lucide-react";

export const SellerPropertyForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<SellerPropertyFormData>({
    defaultValues: {
      propertyType: "residential",
      listingType: "sale",
      features: [],
      amenities: {},
    },
  });

  const propertyType = form.watch("propertyType");
  const listingType = form.watch("listingType");

  const redirectToAuth = () => {
    window.location.href = "/login";
  };

  const onSubmit = async (data: SellerPropertyFormData) => {
    // Check if user is authenticated
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log("Submitting property data:", data);

      const { data: newProperty, error } = await supabase
        .from("properties")
        .insert({
          title: data.title,
          description: data.description,
          location: data.location,
          price: data.price,
          area: data.size,
          land_size: data.landSize,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          property_type: data.propertyType,
          listing_type: data.listingType,
          rental_duration: data.rentalDuration,
          rental_terms: data.rentalTerms,
          roi_potential: data.expectedRoi,
          features: data.features,
          amenities: data.amenities,
          user_id: user.id,
          view_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      setPropertyId(newProperty.id);

      // We're removing the user analytics tracking since the table doesn't exist
      // This can be added back when the table is created

      toast({
        title: "Success!",
        description: "Your property has been listed successfully. You can now add images.",
      });
      
    } catch (error) {
      console.error("Error submitting property:", error);
      toast({
        title: "Error",
        description: "Failed to list your property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    console.log('Image uploaded:', imageUrl);
    toast({
      title: "Image Uploaded",
      description: "Your property image has been uploaded successfully.",
    });
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
              You need to sign in or create an account to list a property.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 flex flex-col gap-4">
            <p className="text-sm text-gray-600">
              Creating an account allows you to manage your property listings and track potential buyer inquiries.
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
                You'll need to sign in before listing a property. Your form data will be preserved.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PropertyTypeSection form={form} />
              <ListingTypeSection form={form} />
            </div>
          </div>

          <BasicInformationSection form={form} />
          <PropertyDetailsSection form={form} propertyType={propertyType} listingType={listingType} />
          <FeaturesAmenitiesSection form={form} />

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter detailed property description"
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {propertyId && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Property Images</h3>
              <PropertyImageUpload
                propertyId={propertyId}
                onUploadComplete={handleImageUpload}
              />
              <PropertyImageGallery propertyId={propertyId} />
            </div>
          )}

          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "List Property"}
          </Button>
        </form>
      </Form>
    </>
  );
};
