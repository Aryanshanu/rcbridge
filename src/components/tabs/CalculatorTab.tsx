
import { Card } from "@/components/ui/card";
import { InvestmentCalculator } from "@/components/InvestmentCalculator";
import { Calculator } from "lucide-react";

export const CalculatorTab = () => {
  return (
    <section className="w-full max-w-4xl mx-auto">
      <Card className="p-4 sm:p-6 bg-white border border-gray-200">
        <div className="flex items-center mb-6">
          <Calculator className="h-6 w-6 mr-3 text-[#1e40af]" />
          <h2 className="text-2xl font-bold">Investment Calculator</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Our investment calculator helps you evaluate the potential return on investment for properties.
          Calculate rental yield, price appreciation, and determine if a property meets the 12% annual return threshold.
        </p>
        <InvestmentCalculator />
      </Card>
    </section>
  );
};
