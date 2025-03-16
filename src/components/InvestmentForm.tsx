
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { convertNumberToWords, formatIndianPrice } from "@/utils/numberFormatting";

export type CalculatorFormData = {
  propertyPrice: number;
  rentalIncome: number;
  propertyType: string;
  location: string;
  timeframe: string;
};

interface InvestmentFormProps {
  form: UseFormReturn<CalculatorFormData>;
  appreciationRate: number;
  setAppreciationRate: (value: number) => void;
  onSubmit: (data: CalculatorFormData) => void;
  isCalculating: boolean;
}

export function InvestmentForm({ 
  form, 
  appreciationRate, 
  setAppreciationRate, 
  onSubmit, 
  isCalculating 
}: InvestmentFormProps) {
  const [propertyPriceInWords, setPropertyPriceInWords] = useState<string>('');
  const [rentalIncomeInWords, setRentalIncomeInWords] = useState<string>('');
  const [appreciationRateInWords, setAppreciationRateInWords] = useState<string>('');

  useEffect(() => {
    const propertyPrice = form.watch("propertyPrice");
    const rentalIncome = form.watch("rentalIncome");
    
    setPropertyPriceInWords(convertNumberToWords(propertyPrice));
    setRentalIncomeInWords(convertNumberToWords(rentalIncome));
    setAppreciationRateInWords(convertNumberToWords(appreciationRate));
  }, [form.watch("propertyPrice"), form.watch("rentalIncome"), appreciationRate, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="propertyPrice" className="text-gray-700">Property Price (₹)</Label>
          <Input
            id="propertyPrice"
            type="number"
            className="border-gray-300 focus:border-[#1e40af] focus:ring-[#1e40af]/20"
            {...form.register("propertyPrice", { 
              valueAsNumber: true,
              onChange: (e) => setPropertyPriceInWords(convertNumberToWords(Number(e.target.value)))
            })}
            required
          />
          {propertyPriceInWords && (
            <p className="text-sm text-gray-500 italic mt-1">
              {formatIndianPrice(form.watch("propertyPrice"))} ({propertyPriceInWords})
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="rentalIncome" className="text-gray-700">Monthly Rental (₹)</Label>
          <Input
            id="rentalIncome"
            type="number"
            className="border-gray-300 focus:border-[#1e40af] focus:ring-[#1e40af]/20"
            {...form.register("rentalIncome", { 
              valueAsNumber: true,
              onChange: (e) => setRentalIncomeInWords(convertNumberToWords(Number(e.target.value)))
            })}
            required
          />
          {rentalIncomeInWords && (
            <p className="text-sm text-gray-500 italic mt-1">
              ₹{form.watch("rentalIncome").toLocaleString('en-IN')} ({rentalIncomeInWords})
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2 p-3 bg-gray-50 rounded-md border border-gray-200">
        <Label className="text-gray-700">Price Appreciation Rate: {appreciationRate}%</Label>
        <Slider
          value={[appreciationRate]}
          min={0}
          max={15}
          step={0.5}
          onValueChange={(value) => {
            setAppreciationRate(value[0]);
            setAppreciationRateInWords(convertNumberToWords(value[0]));
          }}
          className="mt-2"
        />
        <p className="text-sm text-gray-500 italic mt-1">
          {appreciationRate}% ({appreciationRateInWords} percent) per year
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="propertyType" className="text-gray-700">Property Type</Label>
          <Select
            value={form.watch("propertyType")}
            onValueChange={(value) => form.setValue("propertyType", value)}
          >
            <SelectTrigger className="border-gray-300 focus:border-[#1e40af] focus:ring-[#1e40af]/20">
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="agricultural">Agricultural</SelectItem>
              <SelectItem value="undeveloped">Undeveloped Land</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-gray-700">Location</Label>
          <Select
            value={form.watch("location")}
            onValueChange={(value) => form.setValue("location", value)}
          >
            <SelectTrigger className="border-gray-300 focus:border-[#1e40af] focus:ring-[#1e40af]/20">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hyderabad">Hyderabad</SelectItem>
              <SelectItem value="bangalore">Bangalore</SelectItem>
              <SelectItem value="mumbai">Mumbai</SelectItem>
              <SelectItem value="delhi">Delhi</SelectItem>
              <SelectItem value="chennai">Chennai</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeframe" className="text-gray-700">Time Frame</Label>
        <Select
          value={form.watch("timeframe")}
          onValueChange={(value) => form.setValue("timeframe", value)}
        >
          <SelectTrigger className="border-gray-300 focus:border-[#1e40af] focus:ring-[#1e40af]/20">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1year">1 Year</SelectItem>
            <SelectItem value="3years">3 Years</SelectItem>
            <SelectItem value="5years">5 Years</SelectItem>
            <SelectItem value="10years">10 Years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#1e40af] hover:bg-[#1e40af]/90 text-white"
        disabled={isCalculating}
      >
        {isCalculating ? "Calculating..." : "Calculate Investment Potential"}
      </Button>
    </form>
  );
}
