
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { LazyImage } from "@/components/ui/LazyImage";

interface PropertyImage {
  id: string;
  url: string;
  is_primary: boolean;
}

interface PropertyImageGalleryProps {
  propertyId: string;
}

export const PropertyImageGallery = ({ propertyId }: PropertyImageGalleryProps) => {
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from('property_images')
          .select('*')
          .eq('property_id', propertyId)
          .order('is_primary', { ascending: false });

        if (error) throw error;
        setImages(data || []);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('property_images_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'property_images',
          filter: `property_id=eq.${propertyId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setImages((current) => [...current, payload.new as PropertyImage]);
          } else if (payload.eventType === 'DELETE') {
            setImages((current) => current.filter((img) => img.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [propertyId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-lg">
        <ImageIcon className="w-12 h-12 text-gray-400" />
        <span className="mt-2 text-sm text-gray-500">No images available</span>
      </div>
    );
  }

  // Find the primary image first
  const primaryImage = images.find(img => img.is_primary);
  const otherImages = images.filter(img => !img.is_primary);
  const orderedImages = primaryImage ? [primaryImage, ...otherImages] : images;

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative rounded-lg overflow-hidden aspect-[16/9]">
        <LazyImage
          src={orderedImages[activeIndex].url}
          alt={`Property image ${activeIndex + 1}`}
          aspectRatio="auto"
          className="w-full h-full"
        />
        {orderedImages[activeIndex].is_primary && (
          <div className="absolute top-2 left-2 bg-accent text-white px-2 py-1 rounded-full text-xs">
            Primary Image
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        {orderedImages.map((image, index) => (
          <div 
            key={image.id}
            className={`relative cursor-pointer rounded-md overflow-hidden aspect-square border-2 transition-all ${
              index === activeIndex ? 'border-primary' : 'border-transparent hover:border-gray-300'
            }`}
            onClick={() => setActiveIndex(index)}
          >
            <LazyImage
              src={image.url}
              alt={`Property thumbnail ${index + 1}`}
              aspectRatio="square"
              className="w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
