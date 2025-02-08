
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BuyerPropertyForm } from "./property-forms/BuyerPropertyForm";
import { SellerPropertyForm } from "./property-forms/SellerPropertyForm";

export const PropertyForm = () => {
  const [userIntent, setUserIntent] = useState<"buy" | "sell">("buy");

  return (
    <div className="space-y-8">
      {/* User Intent Selection */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">What are you looking for?</h3>
        <RadioGroup
          onValueChange={(value: "buy" | "sell") => setUserIntent(value)}
          defaultValue={userIntent}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="buy" id="buy" />
            <label htmlFor="buy">I want to Buy/Rent</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sell" id="sell" />
            <label htmlFor="sell">I want to Sell/List</label>
          </div>
        </RadioGroup>
      </div>

      {/* Render the appropriate form based on user intent */}
      {userIntent === "buy" ? (
        <BuyerPropertyForm />
      ) : (
        <SellerPropertyForm />
      )}
    </div>
  );
};
