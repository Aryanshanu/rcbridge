
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { SellerPropertyFormData } from "./types";

interface ListingTypeSectionProps {
  form: UseFormReturn<SellerPropertyFormData>;
}

export const ListingTypeSection = ({ form }: ListingTypeSectionProps) => {
  return (
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
  );
};
