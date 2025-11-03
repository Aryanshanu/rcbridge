
import { Building, MapPin, Bed, Bath, Square, Share2, Heart, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { LazyImage } from "@/components/ui/LazyImage";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { getPropertyImage, createImagePrompt } from "@/utils/imageGeneration";
import { logActivity } from "@/utils/activityLogger";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  const [propertyImage, setPropertyImage] = useState<string>(image);
  const [imageLoading, setImageLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const [viewLogged, setViewLogged] = useState(false);

  const propertyType = bedrooms === 0 ? 'commercial' : 
                       bedrooms > 3 ? 'luxury' : 'residential';

  useEffect(() => {
    const loadImage = async () => {
      try {
        setImageLoading(true);
        const imageType = propertyType === 'commercial' ? 'commercial' : 
                          propertyType === 'luxury' ? 'luxury' : 'residential';
        
        const prompt = createImagePrompt({
          title,
          location,
          bedrooms,
          type: imageType
        });
        
        const imageUrl = await getPropertyImage(prompt);
        
        const img = new Image();
        img.onload = () => {
          setPropertyImage(imageUrl);
        };
        img.onerror = () => {
          console.error('Failed to load image from URL:', imageUrl);
          toast({
            title: "Image Loading Error",
            description: "Could not load the property image. Using a placeholder.",
            variant: "destructive",
          });
        };
        img.src = imageUrl;
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
  }, [location, propertyType, toast, title, bedrooms]);

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
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this property with others",
        duration: 3000,
      });
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleWhatsAppInquiry = async () => {
    // Log property view/inquiry activity
    if (!viewLogged && id) {
      await logActivity('property_inquiry', {
        property_id: id,
        property_title: title,
        property_location: location,
        property_price: price,
        inquiry_method: 'whatsapp',
        timestamp: new Date().toISOString()
      }, {
        customer_id: user?.id,
        customer_email: user?.email,
        customer_name: user?.user_metadata?.full_name
      });

      // Log to property_views table
      await supabase.from('property_views').insert({
        property_id: id,
        viewer_id: user?.id || null,
        viewer_email: user?.email || null
      });

      // Increment view count - get current count first
      const { data: property } = await supabase
        .from('properties')
        .select('view_count')
        .eq('id', id)
        .single();
      
      if (property) {
        await supabase
          .from('properties')
          .update({ view_count: (property.view_count || 0) + 1 })
          .eq('id', id);
      }

      setViewLogged(true);
    }

    const message = encodeURIComponent(`Hi, I'm interested in the property: ${title} in ${location}. Could you provide more information?`);
    window.open(`https://wa.me/917893871223?text=${message}`, '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-900/70 group border border-gray-100 dark:border-gray-700">
      <div className="relative h-48 overflow-hidden">
        <LazyImage 
          src={propertyImage} 
          alt={title} 
          aspectRatio="video"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-primary dark:bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {price}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full flex justify-between items-center">
            <button 
              onClick={handleFavoriteToggle}
              className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/40 transition-colors duration-200 transform hover:scale-110"
              aria-label="Add to favorites"
            >
              <Heart className={cn("h-5 w-5", isFavorite ? "fill-red-500 text-red-500" : "text-white")} />
            </button>
            <button 
              onClick={handleShare}
              className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/40 transition-colors duration-200 transform hover:scale-110"
              aria-label="Share property"
            >
              <Share2 className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-1 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors duration-300">{title}</h3>
        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
          <MapPin className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
          <span className="text-sm line-clamp-1">{location}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
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
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-md transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          <MessageCircle className="h-4 w-4" />
          Inquire via WhatsApp
        </button>
      </div>
    </div>
  );
};
