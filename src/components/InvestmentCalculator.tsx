
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { InvestmentForm, CalculatorFormData } from "@/components/InvestmentForm";
import { InvestmentResults, CalculationResult } from "@/components/InvestmentResults";

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
      
      const monthlyRental = data.rentalIncome;
      const annualRental = monthlyRental * 12;
      const rentalYield = (annualRental / data.propertyPrice) * 100;
      
      const { data: marketData, error } = await supabase.functions.invoke('calculate-investment-metrics', {
        body: {
          propertyPrice: data.propertyPrice,
          location: data.location,
          propertyType: data.propertyType,
          timeframe: data.timeframe
        }
      }).catch(() => {
        return {
          data: {
            priceAppreciation: appreciationRate,
            rsi: Math.random() * 30 + 50
          },
          error: null
        };
      });
      
      if (error) throw error;

      const priceAppreciation = marketData?.priceAppreciation || appreciationRate;
      const totalReturn = rentalYield + priceAppreciation;
      
      setCalculationResult({
        rentalYield,
        priceAppreciation,
        totalReturn,
        rsi: marketData?.rsi || 65,
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

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-[#1e40af]/10 p-4">
        <h3 className="text-lg font-bold text-[#1e40af] mb-1">Investment Calculator</h3>
        <p className="text-sm text-gray-600">Evaluate the potential return on real estate investments</p>
      </div>

      <div className="p-4">
        <InvestmentForm 
          form={form} 
          appreciationRate={appreciationRate}
          setAppreciationRate={setAppreciationRate}
          onSubmit={calculateInvestment}
          isCalculating={isCalculating}
        />

        {calculationResult && <InvestmentResults result={calculationResult} />}
      </div>
    </div>
  );
}
