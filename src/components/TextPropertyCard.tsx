
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, BedDouble, Bath, Home, ArrowRight, Building, Ruler } from "lucide-react";
import { Link } from "react-router-dom";

interface PropertyType {
  id: string;
  title: string;
  location: string;
  price: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  description?: string;
  propertyType?: string;
  listingType?: string;
}

export const TextPropertyCard = ({ property }: { property: PropertyType }) => {
  const getPropertyTypeIcon = () => {
    switch (property.propertyType) {
      case 'commercial':
        return <Building className="h-4 w-4" />;
      case 'undeveloped':
        return <Ruler className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };
  
  const getListingTypeColor = () => {
    switch (property.listingType) {
      case 'rent':
        return "bg-blue-100 text-blue-800";
      case 'development_partnership':
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };
  
  const getListingTypeLabel = () => {
    switch (property.listingType) {
      case 'rent':
        return "For Rent";
      case 'development_partnership':
        return "Development";
      default:
        return "For Sale";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow bg-white">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
          
          <Badge className={getListingTypeColor()}>
            <span className="flex items-center gap-1">
              {getPropertyTypeIcon()}
              {getListingTypeLabel()}
            </span>
          </Badge>
        </div>
        
        <div className="flex items-start gap-1 mb-2 text-gray-600">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p className="text-sm line-clamp-1">{property.location}</p>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-3">
          {property.bedrooms !== undefined && property.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <BedDouble className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
          )}
          
          {property.bathrooms !== undefined && property.bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
          )}
          
          {property.area && (
            <div className="flex items-center gap-1">
              <Ruler className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{property.area}</span>
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{property.description}</p>
        
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-[#1e40af]">{property.price}</p>
          
          <Link to={`/property/${property.id}`} className="text-sm text-[#1e40af] hover:underline flex items-center">
            View Details <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </div>
    </Card>
  );
};
