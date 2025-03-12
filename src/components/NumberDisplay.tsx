
import { formatIndianPrice, convertNumberToWords } from "@/utils/numberFormatting";

interface NumberDisplayProps {
  value: number;
  type: 'currency' | 'percentage';
  showWords?: boolean;
}

export function NumberDisplay({ value, type, showWords = true }: NumberDisplayProps) {
  if (type === 'currency') {
    return (
      <div className="text-sm">
        <span>{formatIndianPrice(value)}</span>
        {showWords && value >= 1000 && (
          <span className="text-muted-foreground italic ml-1">
            ({convertNumberToWords(value)})
          </span>
        )}
      </div>
    );
  } else {
    return (
      <div className="text-sm">
        <span>{value.toFixed(2)}%</span>
        {showWords && (
          <span className="text-xs ml-1">
            ({convertNumberToWords(parseFloat(value.toFixed(2)))})
          </span>
        )}
      </div>
    );
  }
}
