
import { UseFormReturn } from "react-hook-form";

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
  form: UseFormReturn<SellerPropertyFormData>;
  propertyType: PropertyType | string;
  listingType: ListingType | string;
}

export interface PropertyImage {
  id: string;
  url: string;
  property_id: string;
  created_at: string;
}

export interface FormSectionProps {
  form: UseFormReturn<SellerPropertyFormData>;
}

export interface BuyerFormData {
  propertyType: PropertyType;
  listingType: ListingType;
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
}

export interface ServiceCategory {
  title: string;
  description: string;
  items: string[];
  icon: JSX.Element;
  color: string;
}

export interface ClientBenefit {
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
}
