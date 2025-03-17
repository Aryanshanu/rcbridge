
import { formatIndianPrice, convertNumberToWords, shouldShowWords } from "@/utils/numberFormatting";

interface NumberDisplayProps {
  value: number;
  type: 'currency' | 'percentage' | 'number';
  showWords?: boolean;
  className?: string;
  wordClassName?: string;
}

export function NumberDisplay({ 
  value, 
  type, 
  showWords = true, 
  className = "text-sm",
  wordClassName = "text-muted-foreground italic ml-1 text-xs"
}: NumberDisplayProps) {
  // Determine if we should show words based on the value
  const displayWords = showWords && shouldShowWords(value);
  
  let formattedValue: string;
  let valueInWords: string | null = null;
  
  if (type === 'currency') {
    formattedValue = formatIndianPrice(value);
    if (displayWords) {
      valueInWords = convertNumberToWords(value);
    }
  } else if (type === 'percentage') {
    formattedValue = `${value.toFixed(2)}%`;
    if (displayWords) {
      valueInWords = convertNumberToWords(parseFloat(value.toFixed(2)));
    }
  } else {
    formattedValue = value.toLocaleString('en-IN');
    if (displayWords) {
      valueInWords = convertNumberToWords(value);
    }
  }

  return (
    <div className={className}>
      <span>{formattedValue}</span>
      {displayWords && valueInWords && (
        <span className={wordClassName}>
          ({valueInWords})
        </span>
      )}
    </div>
  );
}
