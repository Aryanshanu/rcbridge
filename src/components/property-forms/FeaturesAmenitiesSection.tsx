
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { SellerPropertyFormData } from "./types";
import { Checkbox } from "@/components/ui/checkbox";

interface FeaturesAmenitiesSectionProps {
  form: UseFormReturn<SellerPropertyFormData>;
}

export const FeaturesAmenitiesSection = ({ form }: FeaturesAmenitiesSectionProps) => {
  const commonAmenities = {
    parking: "Parking",
    security: "24/7 Security",
    gym: "Gym",
    pool: "Swimming Pool",
    garden: "Garden/Terrace",
    elevator: "Elevator",
    internet: "High-speed Internet",
    ac: "Air Conditioning",
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Features & Amenities</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(commonAmenities).map(([key, label]) => (
          <FormField
            key={key}
            control={form.control}
            name={`amenities.${key}`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">{label}</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
};
