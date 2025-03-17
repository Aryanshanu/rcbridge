
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormSectionProps, ListingType } from "./types";

interface ListingTypeOption {
  value: ListingType;
  id: string;
  label: string;
}

export const ListingTypeSection = ({ form }: FormSectionProps) => {
  const listingTypeOptions: ListingTypeOption[] = [
    { value: "sale", id: "s-sale", label: "For Sale" },
    { value: "rent", id: "s-rent", label: "For Rent" },
    { value: "development_partnership", id: "s-partnership", label: "Development Partnership" },
  ];

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
              {listingTypeOptions.map((option) => (
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
