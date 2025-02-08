
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
import { SellerPropertyFormData } from "./types";

export const SellerPropertyForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const { toast } = useToast();
  
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

  const onSubmit = async (data: SellerPropertyFormData) => {
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

  const handleImageUpload = (imageUrl: string) => {
    console.log('Image uploaded:', imageUrl);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PropertyTypeSection form={form} />
            <ListingTypeSection form={form} />
          </div>
        </div>

        <BasicInformationSection form={form} />
        <PropertyDetailsSection form={form} propertyType={propertyType} listingType={listingType} />

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
  );
};
