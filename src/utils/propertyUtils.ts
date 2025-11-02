export const formatPrice = (price: number): string => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} L`;
  } else {
    return `₹${price.toLocaleString()}`;
  }
};

export const formatArea = (area: number): string => {
  return `${area.toLocaleString()} sq. ft.`;
};

export const getPropertyTypeBadgeColor = (type: string): string => {
  const colors: Record<string, string> = {
    residential: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    commercial: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    agricultural: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    undeveloped: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  };
  return colors[type] || colors.residential;
};

export const getListingTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    sale: "For Sale",
    rent: "For Rent",
    development: "Under Development",
  };
  return labels[type] || type;
};

export const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};
