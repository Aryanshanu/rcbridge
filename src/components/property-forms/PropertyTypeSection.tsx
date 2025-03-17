
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormSectionProps, PropertyType } from "./types";

interface PropertyTypeOption {
  value: PropertyType;
  id: string;
  label: string;
}

export const PropertyTypeSection = ({ form }: FormSectionProps) => {
  const propertyTypeOptions: PropertyTypeOption[] = [
    { value: "residential", id: "s-residential", label: "Residential" },
    { value: "commercial", id: "s-commercial", label: "Commercial" },
    { value: "agricultural", id: "s-agricultural", label: "Agricultural" },
    { value: "undeveloped", id: "s-undeveloped", label: "Undeveloped Land" },
  ];

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
              {propertyTypeOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={option.id} />
                  <label htmlFor={option.id}>{option.label}</label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
