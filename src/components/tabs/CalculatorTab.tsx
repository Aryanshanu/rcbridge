
import { Card } from "@/components/ui/card";
import { InvestmentCalculator } from "@/components/InvestmentCalculator";
import { Calculator } from "lucide-react";

export const CalculatorTab = () => {
  return (
    <section className="w-full max-w-4xl mx-auto py-8">
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-white to-[#f5f7ff] border border-[#e0e7ff] shadow-lg rounded-xl">
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-r from-[#9b87f5] to-[#7a63f5] p-3 rounded-lg shadow-md mr-4">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6]">Investment Calculator</h2>
        </div>
        <p className="text-gray-600 mb-8 border-l-4 border-[#9b87f5] pl-4 italic">
          Our investment calculator helps you evaluate the potential return on investment for properties.
          Calculate rental yield, price appreciation, and determine if a property meets our investment criteria.
        </p>
        <div className="bg-[#f8f9ff] p-6 rounded-xl border border-[#e0e7ff] shadow-inner">
          <InvestmentCalculator />
        </div>
      </Card>
    </section>
  );
};
