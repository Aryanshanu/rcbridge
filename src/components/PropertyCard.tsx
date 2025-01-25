import { Building, MapPin, Bed, Bath, Square } from "lucide-react";

interface PropertyCardProps {
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  image: string;
}

export const PropertyCard = ({ title, location, price, bedrooms, bathrooms, area, image }: PropertyCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative h-48">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
          {price}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{bedrooms} Beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{bathrooms} Baths</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{area}</span>
          </div>
        </div>
      </div>
    </div>
  );
};