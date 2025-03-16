
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building, MapPin, Home, IndianRupee, SlidersHorizontal, MessageCircle, Heart, Bookmark, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LazyImage } from '@/components/ui/LazyImage';
import { getPropertyImage, createImagePrompt } from '@/utils/imageGeneration';
import { useToast } from '@/hooks/use-toast';

interface PropertyType {
  id: string;
  title: string;
  location: string;
  price: string;
  bedrooms?: number;
  bathrooms?: number;
  area: string;
  image?: string;
}

interface AbstractPropertyCardProps {
  property: PropertyType;
  className?: string;
}

export const AbstractPropertyCard = ({ property, className }: AbstractPropertyCardProps) => {
  const [propertyImage, setPropertyImage] = useState<string>(property.image || '/placeholder.svg');
  const [imageLoading, setImageLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();
  
  // Determine property type based on bedrooms
  const propertyType = property.bedrooms === 0 ? 'commercial' : 
                      property.bedrooms && property.bedrooms > 3 ? 'luxury' : 'residential';
  
  // Set color based on property type
  const propertyColor = propertyType === 'commercial' ? '#3B82F6' : 
                       propertyType === 'luxury' ? '#8B5CF6' : '#10B981';
  
  useEffect(() => {
    // Load a realistic property image
    const loadImage = async () => {
      try {
        setImageLoading(true);
        const imageType = propertyType === 'commercial' ? 'commercial' : 
                          propertyType === 'luxury' ? 'luxury' : 'residential';
        
        const prompt = createImagePrompt({
          ...property,
          type: imageType
        });
        
        const imageUrl = await getPropertyImage(prompt);
        setPropertyImage(imageUrl);
      } catch (error) {
        console.error('Error loading property image:', error);
        toast({
          title: "Image Loading Error",
          description: "Could not load the property image. Using a placeholder.",
          variant: "destructive",
        });
      } finally {
        setImageLoading(false);
      }
    };
    
    loadImage();
  }, [property, propertyType, toast]);

  const handleWhatsAppInquiry = () => {
    const message = encodeURIComponent(`Hi, I'm interested in the property: ${property.title} in ${property.location}. Could you provide more information?`);
    window.open(`https://wa.me/917893871223?text=${message}`, '_blank');
    
    toast({
      title: "WhatsApp Inquiry",
      description: "Opening WhatsApp with your inquiry message",
      duration: 3000,
    });
  };
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from likes" : "Added to likes",
      description: isLiked ? "Property removed from your liked properties" : "Property added to your liked properties",
      duration: 3000,
    });
  };
  
  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from saved" : "Saved property",
      description: isSaved ? "Property removed from your saved list" : "Property saved for future reference",
      duration: 3000,
    });
  };
  
  const handleCall = () => {
    window.location.href = "tel:+917893871223";
    toast({
      title: "Call Agent",
      description: "Connecting you with our property agent",
      duration: 3000,
    });
  };
  
  return (
    <motion.div
      className={cn(
        "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {/* Property Image */}
      <div className="relative w-full h-48 bg-gray-50">
        <LazyImage 
          src={propertyImage} 
          alt={property.title}
          aspectRatio="video"
          className="w-full h-full object-cover"
        />
        
        {/* Property Type Badge */}
        <div 
          className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: propertyColor }}
        >
          {propertyType === 'commercial' ? (
            <span className="flex items-center"><Building className="w-3 h-3 mr-1" /> Commercial</span>
          ) : propertyType === 'luxury' ? (
            <span className="flex items-center"><Home className="w-3 h-3 mr-1" /> Luxury</span>
          ) : (
            <span className="flex items-center"><Home className="w-3 h-3 mr-1" /> Residential</span>
          )}
        </div>
        
        {/* Action Buttons Overlay */}
        <div className="absolute bottom-2 left-2 right-2 flex space-x-2">
          <button 
            onClick={handleLike}
            className={cn(
              "flex items-center justify-center p-1.5 rounded-full backdrop-blur-sm transition-colors duration-200",
              isLiked ? "bg-red-500/80 text-white" : "bg-white/70 text-gray-700 hover:bg-white/90"
            )}
            aria-label="Like property"
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-white")} />
          </button>
          
          <button 
            onClick={handleSave}
            className={cn(
              "flex items-center justify-center p-1.5 rounded-full backdrop-blur-sm transition-colors duration-200",
              isSaved ? "bg-blue-500/80 text-white" : "bg-white/70 text-gray-700 hover:bg-white/90"
            )}
            aria-label="Save property"
          >
            <Bookmark className={cn("h-4 w-4", isSaved && "fill-white")} />
          </button>
          
          <div className="flex-grow"></div>
          
          <button 
            onClick={handleCall}
            className="flex items-center justify-center p-1.5 rounded-full bg-white/70 text-gray-700 hover:bg-white/90 backdrop-blur-sm transition-colors duration-200"
            aria-label="Call agent"
          >
            <Phone className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Property Details */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2 transition-colors duration-200 hover:text-primary">{property.title}</h3>
        
        <div className="flex items-start mb-3">
          <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="ml-2 text-gray-600">{property.location}</p>
        </div>
        
        <div className="flex justify-between mb-3">
          <div className="flex items-center text-primary font-bold text-xl">
            <IndianRupee className="h-4 w-4 mr-1" /> {property.price}
          </div>
          
          <div className="text-sm text-gray-500">
            {property.area}
          </div>
        </div>
        
        {/* Property Specs */}
        {property.bedrooms !== undefined && (
          <div className="flex justify-between pt-3 border-t border-gray-100 mb-4">
            {property.bedrooms > 0 && (
              <div className="text-center">
                <span className="block text-lg font-semibold">{property.bedrooms}</span>
                <span className="text-xs text-gray-500">Beds</span>
              </div>
            )}
            
            {property.bathrooms && (
              <div className="text-center">
                <span className="block text-lg font-semibold">{property.bathrooms}</span>
                <span className="text-xs text-gray-500">Baths</span>
              </div>
            )}
            
            <div className="text-center">
              <SlidersHorizontal className="h-5 w-5 mx-auto text-gray-400" />
              <span className="text-xs text-gray-500">Customize</span>
            </div>
          </div>
        )}
        
        <button 
          onClick={handleWhatsAppInquiry}
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-md transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          <MessageCircle className="h-4 w-4" />
          Inquire via WhatsApp
        </button>
      </div>
    </motion.div>
  );
};
