
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { InvestmentForm, CalculatorFormData } from "@/components/InvestmentForm";
import { InvestmentResults, CalculationResult } from "@/components/InvestmentResults";
import { useAuth } from "@/contexts/AuthContext";

export function InvestmentCalculator() {
  const { toast } = useToast();
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [appreciationRate, setAppreciationRate] = useState<number>(5);
  const { user } = useAuth();

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
      
      const investmentStatus: 'good' | 'moderate' | 'poor' = 
        totalReturn >= 12 ? 'good' : 
        totalReturn >= 8 ? 'moderate' : 
        'poor';
      
      const result: CalculationResult = {
        rentalYield,
        priceAppreciation,
        totalReturn,
        rsi: marketData?.rsi || 65,
        investmentStatus
      };
      
      setCalculationResult(result);
      
      // Save calculation to database if user is logged in
      if (user) {
        try {
          // Using the table we created in Supabase
          await supabase.from('investment_calculations').insert({
            user_id: user.id,
            property_price: data.propertyPrice,
            rental_income: data.rentalIncome,
            property_type: data.propertyType,
            location: data.location,
            timeframe: data.timeframe,
            appreciation_rate: appreciationRate,
            calculation_result: result
          });
        } catch (saveError) {
          console.error("Error saving calculation:", saveError);
          // Continue even if saving fails
        }
      }
      
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
