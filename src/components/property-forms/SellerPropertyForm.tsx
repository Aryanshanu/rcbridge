
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertCircle, LockIcon, UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SellerPropertyForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
    setShowAuthDialog(false);
    navigate("/login", { state: { returnTo: window.location.pathname } });
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
          <div className="flex flex-col gap-4">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
              <div className="flex items-start">
                <UserIcon className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-amber-800">
                    Creating an account allows you to:
                  </p>
                  <ul className="list-disc ml-5 mt-1 text-sm text-amber-700">
                    <li>Save and manage your property listings</li>
                    <li>Receive inquiries from potential buyers</li>
                    <li>Track property views and interest</li>
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
                You'll need to sign in before listing a property. Your form data will be preserved.
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
              <PropertyTypeSection form={form} />
              <ListingTypeSection form={form} />
            </div>
          </div>

          <BasicInformationSection form={form} />
          <PropertyDetailsSection form={form} propertyType={propertyType} listingType={listingType} />
          <FeaturesAmenitiesSection form={form} />

          {propertyId && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Property Images</h3>
              <PropertyImageUpload
                propertyId={propertyId}
                onUploadComplete={(imageUrl) => {
                  console.log('Image uploaded:', imageUrl);
                  toast({
                    title: "Image Uploaded",
                    description: "Your property image has been uploaded successfully.",
                  });
                }}
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
