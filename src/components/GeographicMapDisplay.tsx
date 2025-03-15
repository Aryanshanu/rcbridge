
import { useState, useEffect } from 'react';
import { Loader2, MapPin, Info } from 'lucide-react';
import { LazyImage } from '@/components/ui/LazyImage';
import { getGeoMapImage } from '@/utils/imageGeneration';

export interface GeographicMapProps {
  location: string;
  mapType: 'pricing' | 'density' | 'schools' | 'amenities';
  style?: 'satellite' | 'terrain' | 'standard';
  title?: string;
  description?: string;
  className?: string;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
}

export const GeographicMapDisplay = ({
  location,
  mapType,
  style = 'standard',
  title,
  description,
  className = '',
  aspectRatio = 'video'
}: GeographicMapProps) => {
  const [mapImage, setMapImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMapImage = async () => {
      setIsLoading(true);
      try {
        const imageUrl = await getGeoMapImage({
          mapType,
          location,
          style
        });
        setMapImage(imageUrl);
      } catch (error) {
        console.error('Error loading map image:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMapImage();
  }, [location, mapType, style]);

  const mapTypeLabels = {
    pricing: 'Property Pricing Heatmap',
    density: 'Property Density Map',
    schools: 'School District Boundaries',
    amenities: 'Neighborhood Amenities'
  };

  const mapTypeColor = {
    pricing: 'bg-indigo-500',
    density: 'bg-emerald-500',
    schools: 'bg-amber-500',
    amenities: 'bg-rose-500'
  };

  return (
    <div className={`relative overflow-hidden rounded-lg shadow-md ${className}`}>
      {isLoading ? (
        <div className={`flex items-center justify-center ${aspectRatio === 'square' ? 'aspect-square' : aspectRatio === 'video' ? 'aspect-video' : aspectRatio === 'portrait' ? 'aspect-[3/4]' : ''} bg-gray-100`}>
          <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          <LazyImage
            src={mapImage}
            alt={title || `${mapTypeLabels[mapType]} of ${location}`}
            aspectRatio={aspectRatio}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1.5" 
               style={{ backgroundColor: mapTypeColor[mapType].replace('bg-', '') }}>
            <MapPin className="h-3.5 w-3.5" />
            {mapTypeLabels[mapType]}
          </div>
          
          {(title || description) && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
              {title && <h3 className="font-semibold">{title}</h3>}
              {description && <p className="text-sm text-white/90">{description}</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
};
