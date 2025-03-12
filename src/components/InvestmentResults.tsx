
import { ArrowUp, TrendingUp, Gauge } from "lucide-react";
import { convertNumberToWords } from "@/utils/numberFormatting";

export type CalculationResult = {
  rentalYield: number;
  priceAppreciation: number;
  totalReturn: number;
  rsi: number;
  investmentStatus: 'good' | 'moderate' | 'poor';
};

interface InvestmentResultsProps {
  result: CalculationResult;
}

export function InvestmentResults({ result }: InvestmentResultsProps) {
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
    <div className="mt-6 space-y-4">
      <div className="rounded-lg p-4 bg-gray-100">
        <h4 className="font-semibold text-lg mb-3">Investment Analysis</h4>
        
        <div className="flex justify-center mb-6">
          <div className={`${getStatusColor(result.investmentStatus)} w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-xl`}>
            {result.totalReturn.toFixed(1)}%
            <span className="text-xs block mt-1">
              ({convertNumberToWords(parseFloat(result.totalReturn.toFixed(1)))} percent)
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Rental Yield</p>
            <div className="flex items-center">
              <span className="text-lg font-semibold">{result.rentalYield.toFixed(2)}%</span>
              <ArrowUp className="h-4 w-4 ml-1 text-green-500" />
              <span className="text-xs ml-1">
                ({convertNumberToWords(parseFloat(result.rentalYield.toFixed(2)))})
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">Price Appreciation</p>
            <div className="flex items-center">
              <span className="text-lg font-semibold">{result.priceAppreciation.toFixed(2)}%</span>
              <TrendingUp className="h-4 w-4 ml-1 text-blue-500" />
              <span className="text-xs ml-1">
                ({convertNumberToWords(parseFloat(result.priceAppreciation.toFixed(2)))})
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">RSI Indicator</p>
            <div className="flex items-center">
              <span className="text-lg font-semibold">{result.rsi.toFixed(0)}</span>
              <span className={`ml-2 text-xs ${getRSIStatus(result.rsi).color}`}>
                {getRSIStatus(result.rsi).text}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 px-4 py-3 bg-gray-200 rounded-md">
          <div className="flex items-center justify-between">
            <span className="font-medium">Investment Quality:</span>
            <span className={`font-bold ${
              result.investmentStatus === 'good' ? 'text-green-600' : 
              result.investmentStatus === 'moderate' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {result.investmentStatus === 'good' ? 'Good Investment' : 
               result.investmentStatus === 'moderate' ? 'Moderate Investment' : 'Poor Investment'}
            </span>
          </div>
          <p className="text-sm mt-1 text-gray-600">
            {result.totalReturn >= 12 
              ? "This property meets the 12% annual return threshold." 
              : "This property does not meet the 12% annual return threshold."}
          </p>
        </div>
      </div>
    </div>
  );
}
