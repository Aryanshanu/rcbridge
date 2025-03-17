
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BuyerPropertyForm } from "./property-forms/BuyerPropertyForm";
import { SellerPropertyForm } from "./property-forms/SellerPropertyForm";
import { Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const steps = [
  { id: "intent", label: "Purpose" },
  { id: "details", label: "Details" },
];

export const PropertyForm = () => {
  const [userIntent, setUserIntent] = useState<"buy" | "sell">("buy");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Handle direct navigation with query parameters
  useEffect(() => {
    const intentParam = searchParams.get("intent");
    if (intentParam === "buy" || intentParam === "sell") {
      setUserIntent(intentParam);
      // Auto-advance to step 2 if we have an intent parameter
      setCurrentStep(1);
    }
    
    // Check for hash in URL to jump to specific section
    if (location.hash === "#property-form") {
      // Smooth scroll to the form
      const formElement = document.getElementById("property-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location, searchParams]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="space-y-8" id="property-form">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              {index > 0 && (
                <ChevronRight 
                  className={cn(
                    "mx-2", 
                    index <= currentStep ? "text-primary" : "text-gray-300"
                  )} 
                />
              )}
              <div 
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                  currentStep >= index 
                    ? "border-primary bg-primary text-white" 
                    : "border-gray-300 bg-white text-gray-300"
                )}
                onClick={() => {
                  // Only allow going to previous steps
                  if (index < currentStep) {
                    setCurrentStep(index);
                  }
                }}
                role="button"
                tabIndex={index < currentStep ? 0 : -1}
              >
                {currentStep > index ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div 
                className={cn(
                  "ml-2 text-sm font-medium",
                  currentStep >= index ? "text-primary" : "text-gray-500"
                )}
              >
                {step.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: User Intent Selection */}
      {currentStep === 0 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-xl font-semibold text-gray-900">What are you looking for?</h3>
          <p className="text-gray-600">Select your purpose to get started with RCBridge services.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div
              className={cn(
                "flex flex-col p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                userIntent === "buy" 
                  ? "border-primary bg-primary/5" 
                  : "border-gray-200 bg-white"
              )}
              onClick={() => setUserIntent("buy")}
            >
              <RadioGroup
                onValueChange={(value: "buy" | "sell") => setUserIntent(value)}
                defaultValue={userIntent}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="buy" id="buy" />
                  <label htmlFor="buy" className="text-lg font-medium cursor-pointer">I want to Buy/Rent</label>
                </div>
              </RadioGroup>
              <p className="mt-3 text-gray-600">
                Browse listings, set alerts for your property requirements, and connect directly with sellers.
              </p>
            </div>
            
            <div
              className={cn(
                "flex flex-col p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                userIntent === "sell" 
                  ? "border-primary bg-primary/5" 
                  : "border-gray-200 bg-white"
              )}
              onClick={() => setUserIntent("sell")}
            >
              <RadioGroup
                onValueChange={(value: "buy" | "sell") => setUserIntent(value)}
                defaultValue={userIntent}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sell" id="sell" />
                  <label htmlFor="sell" className="text-lg font-medium cursor-pointer">I want to Sell/List</label>
                </div>
              </RadioGroup>
              <p className="mt-3 text-gray-600">
                List your property, showcase its features, and connect directly with potential buyers.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end mt-8">
            <Button 
              onClick={handleNext} 
              className="bg-primary hover:bg-primary/90"
            >
              Continue <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Form Details */}
      {currentStep === 1 && (
        <div className="animate-in fade-in duration-300">
          <div className="flex items-center mb-6">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="mr-4"
            >
              Back
            </Button>
            <h3 className="text-xl font-semibold text-gray-900">
              {userIntent === "buy" ? "Property Requirements" : "Property Details"}
            </h3>
          </div>
          
          {userIntent === "buy" ? (
            <BuyerPropertyForm />
          ) : (
            <SellerPropertyForm />
          )}
        </div>
      )}
    </div>
  );
};
