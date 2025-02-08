
export type PropertyType = "residential" | "commercial" | "agricultural" | "undeveloped";
export type ListingType = "sale" | "rent" | "development_partnership";

export type SellerPropertyFormData = {
  title: string;
  description: string;
  location: string;
  price: number;
  size: number;
  landSize: number;
  bedrooms: number;
  bathrooms: number;
  possession: string;
  expectedRoi: number;
  propertyType: PropertyType;
  listingType: ListingType;
  rentalDuration?: string;
  rentalTerms?: string;
  features: string[];
  amenities: Record<string, boolean>;
};
