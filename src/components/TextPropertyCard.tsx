
import { Building, MapPin, Bed, Bath, Square, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyType {
  id: string;
  title: string;
  location: string;
  price: string;
  bedrooms?: number;
  bathrooms?: number;
  area: string;
}

interface TextPropertyCardProps {
  property: PropertyType;
  className?: string;
}

export const TextPropertyCard = ({ property, className }: TextPropertyCardProps) => {
  // Determine property type based on bedrooms
  const propertyType = property.bedrooms === 0 ? 'commercial' : 
                      property.bedrooms && property.bedrooms > 3 ? 'luxury' : 'residential';
  
  // Set color based on property type
  const propertyColor = propertyType === 'commercial' ? '#3B82F6' : 
                       propertyType === 'luxury' ? '#8B5CF6' : '#10B981';
  
  const handleWhatsAppInquiry = () => {
    const message = encodeURIComponent(`Hi, I'm interested in the property: ${property.title} in ${property.location}. Could you provide more information?`);
    window.open(`https://wa.me/917893871223?text=${message}`, '_blank');
  };
  
  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-300",
        className
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-gray-900">{property.title}</h3>
        <div 
          className="px-2 py-1 rounded-full text-xs font-medium text-white whitespace-nowrap"
          style={{ backgroundColor: propertyColor }}
        >
          {propertyType === 'commercial' ? (
            <span className="flex items-center"><Building className="w-3 h-3 mr-1" /> Commercial</span>
          ) : propertyType === 'luxury' ? (
            <span className="flex items-center"><Building className="w-3 h-3 mr-1" /> Luxury</span>
          ) : (
            <span className="flex items-center"><Building className="w-3 h-3 mr-1" /> Residential</span>
          )}
        </div>
      </div>
      
      <div className="flex items-start mb-3">
        <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="ml-2 text-gray-600 text-sm">{property.location}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center text-primary font-bold text-xl">
          {property.price}
        </div>
        
        <div className="flex items-center justify-end text-sm text-gray-500">
          <Square className="h-4 w-4 mr-1 text-gray-400" />
          {property.area}
        </div>
      </div>
      
      {/* Property Specs */}
      {property.bedrooms !== undefined && property.bedrooms > 0 && (
        <div className="flex justify-between pt-3 border-t border-gray-100 mb-4">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1 text-gray-400" />
            <span className="text-sm">{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
          </div>
          
          {property.bathrooms && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1 text-gray-400" />
              <span className="text-sm">{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
          )}
        </div>
      )}
      
      <button 
        onClick={handleWhatsAppInquiry}
        className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-md transition-all duration-300"
      >
        <MessageCircle className="h-4 w-4" />
        Inquire via WhatsApp
      </button>
    </div>
  );
};
