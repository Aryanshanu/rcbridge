
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { SellerPropertyFormData } from "./types";
import { Checkbox } from "@/components/ui/checkbox";
import { Car, Shield, Dumbbell, Bath, LandPlot, ArrowUpFromDot, Wifi, Wind } from "lucide-react";

interface FeaturesAmenitiesSectionProps {
  form: UseFormReturn<SellerPropertyFormData>;
}

interface Amenity {
  key: string;
  label: string;
  icon: React.ReactNode;
}

export const FeaturesAmenitiesSection = ({ form }: FeaturesAmenitiesSectionProps) => {
  const commonAmenities: Amenity[] = [
    { key: "parking", label: "Parking", icon: <Car className="h-5 w-5 text-gray-600" /> },
    { key: "security", label: "24/7 Security", icon: <Shield className="h-5 w-5 text-gray-600" /> },
    { key: "gym", label: "Gym", icon: <Dumbbell className="h-5 w-5 text-gray-600" /> },
    { key: "pool", label: "Swimming Pool", icon: <Bath className="h-5 w-5 text-gray-600" /> },
    { key: "garden", label: "Garden/Terrace", icon: <LandPlot className="h-5 w-5 text-gray-600" /> },
    { key: "elevator", label: "Elevator", icon: <ArrowUpFromDot className="h-5 w-5 text-gray-600" /> },
    { key: "internet", label: "High-speed Internet", icon: <Wifi className="h-5 w-5 text-gray-600" /> },
    { key: "ac", label: "Air Conditioning", icon: <Wind className="h-5 w-5 text-gray-600" /> },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Features & Amenities</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {commonAmenities.map(({ key, label, icon }) => (
          <FormField
            key={key}
            control={form.control}
            name={`amenities.${key}`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-1"
                  />
                </FormControl>
                <div className="flex items-center space-x-2">
                  {icon}
                  <FormLabel className="font-medium cursor-pointer">{label}</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
};
