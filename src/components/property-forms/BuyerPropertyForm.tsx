
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
  const { toast } = useToast();
  
  const form = useForm<BuyerPropertyFormData>({
    defaultValues: {
      propertyType: "residential",
      listingType: "sale",
    },
  });

  const propertyType = form.watch("propertyType");
  const listingType = form.watch("listingType");

  const onSubmit = async (data: BuyerPropertyFormData) => {
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
                    <Input type="number" placeholder="Enter minimum price" {...field} />
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
                    <Input type="number" placeholder="Enter maximum price" {...field} />
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
                  <FormLabel>Minimum Size (sq.ft)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter minimum size" {...field} />
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
                  <FormLabel>Maximum Size (sq.ft)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter maximum size" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Save Requirements"}
        </Button>
      </form>
    </Form>
  );
};
