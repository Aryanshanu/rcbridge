
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { SellerPropertyFormData } from "./types";

interface PropertyDetailsSectionProps {
  form: UseFormReturn<SellerPropertyFormData>;
  propertyType: string;
  listingType: string;
}

export const PropertyDetailsSection = ({ form, propertyType, listingType }: PropertyDetailsSectionProps) => {
  // Helper function to determine size unit
  const getSizeUnit = () => {
    return propertyType === 'agricultural' ? 'acres' : 'sq.ft';
  };

  return (
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
              <FormLabel>Built-up Area ({getSizeUnit()})</FormLabel>
              <FormControl>
                <Input type="number" placeholder={`Enter built-up area (${getSizeUnit()})`} {...field} />
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
              <FormLabel>Land Size ({getSizeUnit()})</FormLabel>
              <FormControl>
                <Input type="number" placeholder={`Enter land size (${getSizeUnit()})`} {...field} />
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
  );
};
