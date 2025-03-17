
export type PropertyType = "residential" | "commercial" | "agricultural" | "undeveloped";
export type ListingType = "sale" | "rent" | "development_partnership";

export interface PropertyAmenities {
  [key: string]: boolean;
}

export interface SellerPropertyFormData {
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
  amenities: PropertyAmenities;
}

export interface PropertyDetailsProps {
  form: any;
  propertyType: string;
  listingType: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  property_id: string;
  created_at: string;
}
