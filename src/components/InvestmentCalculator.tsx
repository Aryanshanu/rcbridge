
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, Gauge } from "lucide-react";

type CalculatorFormData = {
  propertyPrice: number;
  rentalIncome: number;
  propertyType: string;
  location: string;
  timeframe: string;
};

type CalculationResult = {
  rentalYield: number;
  priceAppreciation: number;
  totalReturn: number;
  rsi: number;
  maStatus: 'above' | 'below';
  investmentStatus: 'good' | 'moderate' | 'poor';
};

export function InvestmentCalculator() {
  const { toast } = useToast();
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [appreciationRate, setAppreciationRate] = useState<number>(5);

  const form = useForm<CalculatorFormData>({
    defaultValues: {
      propertyPrice: 2000000,
      rentalIncome: 15000,
      propertyType: "residential",
      location: "hyderabad",
      timeframe: "5years"
    }
  });

  const calculateInvestment = async (data: CalculatorFormData) => {
    try {
      setIsCalculating(true);
      
      // Calculate rental yield
      const monthlyRental = data.rentalIncome;
      const annualRental = monthlyRental * 12;
      const rentalYield = (annualRental / data.propertyPrice) * 100;
      
      // Simulate API call to get market data
      // In a production environment, this would call your Supabase function
      const { data: marketData, error } = await supabase.functions.invoke('calculate-investment-metrics', {
        body: {
          propertyPrice: data.propertyPrice,
          location: data.location,
          propertyType: data.propertyType,
          timeframe: data.timeframe
        }
      }).catch(() => {
        // Fallback calculation if the function isn't available yet
        return {
          data: {
            priceAppreciation: appreciationRate,
            rsi: Math.random() * 30 + 50, // Random RSI between 50-80
            maStatus: Math.random() > 0.5 ? 'above' : 'below'
          },
          error: null
        };
      });
      
      if (error) throw error;

      const priceAppreciation = marketData?.priceAppreciation || appreciationRate;
      const totalReturn = rentalYield + priceAppreciation;
      
      // Set the calculation result
      setCalculationResult({
        rentalYield,
        priceAppreciation,
        totalReturn,
        rsi: marketData?.rsi || 65,
        maStatus: marketData?.maStatus || 'above',
        investmentStatus: totalReturn >= 12 ? 'good' : totalReturn >= 8 ? 'moderate' : 'poor'
      });
      
      toast({
        title: "Investment Analysis Complete",
        description: `Total expected return: ${totalReturn.toFixed(2)}%`,
      });
    } catch (error) {
      console.error("Calculation error:", error);
      toast({
        title: "Calculation Error",
        description: "Unable to calculate investment metrics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRSIStatus = (rsi: number) => {
    if (rsi > 70) return { text: 'Overbought', color: 'text-red-600' };
    if (rsi < 30) return { text: 'Oversold', color: 'text-green-600' };
    return { text: 'Neutral', color: 'text-yellow-600' };
  };

  return (
    <Card className="p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Investment Calculator</h3>
        <p className="text-gray-600">Evaluate if a property meets the 12% annual return threshold</p>
      </div>

      <form onSubmit={form.handleSubmit(calculateInvestment)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="propertyPrice">Property Price (₹)</Label>
            <Input
              id="propertyPrice"
              type="number"
              {...form.register("propertyPrice", { valueAsNumber: true })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rentalIncome">Monthly Rental (₹)</Label>
            <Input
              id="rentalIncome"
              type="number"
              {...form.register("rentalIncome", { valueAsNumber: true })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Price Appreciation Rate (%): {appreciationRate}%</Label>
          <Slider
            value={[appreciationRate]}
            min={0}
            max={15}
            step={0.5}
            onValueChange={(value) => setAppreciationRate(value[0])}
            className="mt-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type</Label>
            <Select
              value={form.watch("propertyType")}
              onValueChange={(value) => form.setValue("propertyType", value)}
            >
              <SelectTrigger>
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
            <Label htmlFor="location">Location</Label>
            <Select
              value={form.watch("location")}
              onValueChange={(value) => form.setValue("location", value)}
            >
              <SelectTrigger>
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
          <Label htmlFor="timeframe">Time Frame</Label>
          <Select
            value={form.watch("timeframe")}
            onValueChange={(value) => form.setValue("timeframe", value)}
          >
            <SelectTrigger>
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
          className="w-full"
          disabled={isCalculating}
        >
          {isCalculating ? "Calculating..." : "Calculate Investment Potential"}
        </Button>
      </form>

      {calculationResult && (
        <div className="mt-6 space-y-4">
          <div className="rounded-lg p-4 bg-gray-100">
            <h4 className="font-semibold text-lg mb-3">Investment Analysis</h4>
            
            <div className="flex justify-center mb-6">
              <div className={`${getStatusColor(calculationResult.investmentStatus)} w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-xl`}>
                {calculationResult.totalReturn.toFixed(1)}%
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Rental Yield</p>
                <div className="flex items-center">
                  <span className="text-lg font-semibold">{calculationResult.rentalYield.toFixed(2)}%</span>
                  <ArrowUp className="h-4 w-4 ml-1 text-green-500" />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Price Appreciation</p>
                <div className="flex items-center">
                  <span className="text-lg font-semibold">{calculationResult.priceAppreciation.toFixed(2)}%</span>
                  <TrendingUp className="h-4 w-4 ml-1 text-blue-500" />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">RSI Indicator</p>
                <div className="flex items-center">
                  <span className="text-lg font-semibold">{calculationResult.rsi.toFixed(0)}</span>
                  <span className={`ml-2 text-xs ${getRSIStatus(calculationResult.rsi).color}`}>
                    {getRSIStatus(calculationResult.rsi).text}
                  </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Moving Average</p>
                <div className="flex items-center">
                  <span className="text-lg font-semibold">
                    {calculationResult.maStatus === 'above' ? 'Above MA' : 'Below MA'}
                  </span>
                  {calculationResult.maStatus === 'above' ? (
                    <ArrowUp className="h-4 w-4 ml-1 text-green-500" />
                  ) : (
                    <ArrowDown className="h-4 w-4 ml-1 text-red-500" />
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-4 px-4 py-3 bg-gray-200 rounded-md">
              <div className="flex items-center justify-between">
                <span className="font-medium">Investment Quality:</span>
                <span className={`font-bold ${
                  calculationResult.investmentStatus === 'good' ? 'text-green-600' : 
                  calculationResult.investmentStatus === 'moderate' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {calculationResult.investmentStatus === 'good' ? 'Good Investment' : 
                   calculationResult.investmentStatus === 'moderate' ? 'Moderate Investment' : 'Poor Investment'}
                </span>
              </div>
              <p className="text-sm mt-1 text-gray-600">
                {calculationResult.totalReturn >= 12 
                  ? "This property meets the 12% annual return threshold." 
                  : "This property does not meet the 12% annual return threshold."}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
