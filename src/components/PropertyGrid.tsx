
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Home } from "lucide-react";

interface Property {
  id: string;
  price: number;
  property_type: string;
  location: string;
  title?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  image_url?: string;
  listing_type?: string;
}

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
}

export const PropertyGrid = ({ properties, loading = false }: PropertyGridProps) => {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const formatArea = (area: number) => {
    return `${area.toLocaleString()} sq. ft.`;
  };

  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <CardContent className="p-4">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No properties found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
          <div className="relative h-48 bg-muted overflow-hidden">
            {property.image_url ? (
              <img 
                src={property.image_url} 
                alt={property.title || `${property.property_type} in ${property.location}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                <Home className="h-16 w-16 text-primary/30" />
              </div>
            )}
            
            {property.listing_type && (
              <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                {capitalizeWords(property.listing_type)}
              </Badge>
            )}
          </div>
          
          <CardContent className="pt-4 space-y-2">
            {property.title && (
              <h3 className="text-lg font-semibold line-clamp-1">{property.title}</h3>
            )}
            <div className="text-2xl font-bold text-primary">{formatPrice(property.price)}</div>
            <Badge variant="secondary" className="capitalize">
              {capitalizeWords(property.property_type)}
            </Badge>
            
            {(property.bedrooms || property.bathrooms || property.area) && (
              <div className="flex items-center gap-3 text-sm text-muted-foreground pt-2">
                {property.bedrooms && (
                  <div className="flex items-center gap-1">
                    <Home className="h-4 w-4" />
                    <span>{property.bedrooms} Bed</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-1">
                    <Home className="h-4 w-4" />
                    <span>{property.bathrooms} Bath</span>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center gap-1">
                    <span>{formatArea(property.area)}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="pt-0 pb-4 flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{property.location}</span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PropertyGrid;
