import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

type SellerPropertyFormData = {
  title: string;
  description: string;
  location: string;
  price: number;
  size: number;
  landSize: number;
  bedrooms: number;
  bathrooms: number;
  possession: string;
  expectedRoi: number;
  propertyType: "residential" | "commercial" | "agricultural" | "undeveloped";
  listingType: "sale" | "rent" | "development_partnership";
  rentalDuration?: string;
  rentalTerms?: string;
  features: string[];
  amenities: Record<string, boolean>;
};

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
    // You can add additional logic here if needed when an image is uploaded
    console.log('Image uploaded:', imageUrl);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                        <RadioGroupItem value="residential" id="s-residential" />
                        <label htmlFor="s-residential">Residential</label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="commercial" id="s-commercial" />
                        <label htmlFor="s-commercial">Commercial</label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="agricultural" id="s-agricultural" />
                        <label htmlFor="s-agricultural">Agricultural</label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="undeveloped" id="s-undeveloped" />
                        <label htmlFor="s-undeveloped">Undeveloped Land</label>
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
                  <FormLabel>Listing Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="sale" id="s-sale" />
                        <label htmlFor="s-sale">For Sale</label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="rent" id="s-rent" />
                        <label htmlFor="s-rent">For Rent</label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="development_partnership" id="s-partnership" />
                        <label htmlFor="s-partnership">Development Partnership</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Basic Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter property title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter property location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Property Details */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Property Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{listingType === 'rent' ? 'Monthly Rent (₹)' : 'Price (₹)'}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={listingType === 'rent' ? "Enter monthly rent" : "Enter price"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Built-up Area (sq.ft)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter built-up area" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="landSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Land Size (sq.ft)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter land size" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {propertyType === 'residential' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Number of bedrooms" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Number of bathrooms" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {listingType === 'sale' && (
                <FormField
                  control={form.control}
                  name="possession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Possession</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}

          {listingType === 'rent' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="rentalDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rental Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 11 months, 1 year" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rentalTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rental Terms</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter rental terms and conditions"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        {/* Description */}
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
