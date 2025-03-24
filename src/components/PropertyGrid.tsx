
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Instagram, MapPin, Home } from "lucide-react";

interface Property {
  id: string;
  price: number;
  property_type: string;
  location: string;
  image_url?: string;
  instagram_post_url?: string;
}

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
}

export const PropertyGrid = ({ properties, loading = false }: PropertyGridProps) => {
  // Function to format price
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
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
        <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-48 bg-gray-100 overflow-hidden">
            {property.image_url ? (
              <img 
                src={property.image_url} 
                alt={`${property.property_type} in ${property.location}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Home className="h-12 w-12 text-gray-300" />
              </div>
            )}
            
            {property.instagram_post_url && (
              <Badge className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none">
                <Instagram className="h-3 w-3 mr-1" />
                Instagram
              </Badge>
            )}
          </div>
          
          <CardContent className="pt-4">
            <h3 className="text-xl font-bold text-gray-900">{formatPrice(property.price)}</h3>
            <p className="text-gray-600 capitalize">{property.property_type}</p>
          </CardContent>
          
          <CardFooter className="pt-0 pb-4 flex items-center text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            {property.location}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PropertyGrid;
