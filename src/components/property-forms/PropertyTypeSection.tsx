
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { SellerPropertyFormData } from "./types";

interface PropertyTypeSectionProps {
  form: UseFormReturn<SellerPropertyFormData>;
}

export const PropertyTypeSection = ({ form }: PropertyTypeSectionProps) => {
  return (
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
  );
};
