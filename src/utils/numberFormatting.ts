
export const convertNumberToWords = (num: number): string => {
  if (!num) return '';
  
  const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  
  const convertLessThanOneThousand = (n: number): string => {
    if (n === 0) return '';
    
    if (n < 20) return units[n];
    
    const digit = n % 10;
    if (n < 100) return tens[Math.floor(n / 10)] + (digit ? '-' + units[digit] : '');
    
    return units[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' and ' + convertLessThanOneThousand(n % 100) : '');
  };
  
  if (num < 0) return 'negative ' + convertNumberToWords(Math.abs(num));
  
  if (num === 0) return 'zero';
  
  let numStr = num.toString();
  
  if (numStr.includes('.')) {
    const parts = numStr.split('.');
    let words = convertLessThanOneThousand(parseInt(parts[0]));
    
    if (parseInt(parts[1]) > 0) {
      words += ' point ';
      for (let i = 0; i < parts[1].length; i++) {
        words += units[parseInt(parts[1][i])] + ' ';
      }
    }
    return words.trim();
  }
  
  if (num < 1000) {
    return convertLessThanOneThousand(num);
  }
  
  if (num < 100000) { // Less than one lakh
    return convertLessThanOneThousand(Math.floor(num / 1000)) + ' thousand' + 
           (num % 1000 !== 0 ? ' ' + convertLessThanOneThousand(num % 1000) : '');
  }
  
  if (num < 10000000) { // Less than one crore
    return convertLessThanOneThousand(Math.floor(num / 100000)) + ' lakh' + 
           (num % 100000 !== 0 ? ' ' + convertNumberToWords(num % 100000) : '');
  }
  
  return convertLessThanOneThousand(Math.floor(num / 10000000)) + ' crore' + 
         (num % 10000000 !== 0 ? ' ' + convertNumberToWords(num % 10000000) : '');
};

export const formatIndianPrice = (price: number): string => {
  if (price >= 10000000) { // 1 crore or more
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) { // 1 lakh or more
    return `₹${(price / 100000).toFixed(2)} L`;
  } else {
    return `₹${price.toLocaleString('en-IN')}`;
  }
};

// New utility function to determine if we should show words
export const shouldShowWords = (num: number): boolean => {
  return num >= 10000; // Show words for numbers with 5 or more digits
};
