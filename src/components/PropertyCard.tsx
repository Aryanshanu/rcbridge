
import { Building, MapPin, Bed, Bath, Square, Share2, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { LazyImage } from "@/components/ui/LazyImage";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface PropertyCardProps {
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  image: string;
  id?: string;
}

export const PropertyCard = ({ 
  title, 
  location, 
  price, 
  bedrooms, 
  bathrooms, 
  area, 
  image,
  id = "property-1" 
}: PropertyCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? "Property removed from your saved list" : "Property added to your saved list",
      duration: 3000,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this property: ${title} in ${location}`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support sharing
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this property with others",
        duration: 3000,
      });
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleWhatsAppInquiry = () => {
    const message = encodeURIComponent(`Hi, I'm interested in the property: ${title} in ${location}. Could you provide more information?`);
    window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl group">
      <div className="relative h-48">
        <LazyImage 
          src={image} 
          alt={title} 
          aspectRatio="video"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
          {price}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full flex justify-between items-center">
            <button 
              onClick={handleFavoriteToggle}
              className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/40 transition-colors duration-200"
              aria-label="Add to favorites"
            >
              <Heart className={cn("h-5 w-5", isFavorite ? "fill-red-500 text-red-500" : "text-white")} />
            </button>
            <button 
              onClick={handleShare}
              className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/40 transition-colors duration-200"
              aria-label="Share property"
            >
              <Share2 className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{title}</h3>
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
          <span className="text-sm line-clamp-1">{location}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1 text-gray-400" />
            <span>{bedrooms} {bedrooms === 1 ? 'Bed' : 'Beds'}</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1 text-gray-400" />
            <span>{bathrooms} {bathrooms === 1 ? 'Bath' : 'Baths'}</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1 text-gray-400" />
            <span>{area}</span>
          </div>
        </div>
        <button 
          onClick={handleWhatsAppInquiry}
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-md transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          Inquire via WhatsApp
        </button>
      </div>
    </div>
  );
};
