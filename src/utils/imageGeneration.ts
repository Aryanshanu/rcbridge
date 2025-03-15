
import { toast } from "@/hooks/use-toast";

// Define the types of maps we support
export type MapType = 'pricing' | 'density' | 'schools' | 'amenities';

// Options for getting a geographic map
export interface GeoMapImageOptions {
  mapType: MapType;
  location: string;
  style?: 'satellite' | 'terrain' | 'standard';
}

// Pre-generated map images to use as fallbacks
const fallbackMapImages: Record<MapType, string[]> = {
  pricing: [
    'https://images.unsplash.com/photo-1572168312382-7dca5d9d5b88?q=80&w=1000',
    'https://images.unsplash.com/photo-1581922819941-6ab31ab79afc?q=80&w=1000',
  ],
  density: [
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1000',
    'https://images.unsplash.com/photo-1542359649-31e03cd4d909?q=80&w=1000',
  ],
  schools: [
    'https://images.unsplash.com/photo-1577036421869-7c8d388d2123?q=80&w=1000',
    'https://images.unsplash.com/photo-1581922814484-0b4169099403?q=80&w=1000',
  ],
  amenities: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000',
  ],
};

// Function to generate appropriate prompts for maps based on the input options
const generateMapPrompt = (options: GeoMapImageOptions): string => {
  const { mapType, location, style = 'standard' } = options;
  
  // Base prompts for different map types
  const mapTypePrompts = {
    pricing: `Real estate pricing heatmap of ${location}, showing property values with red for high prices and blue for low prices`,
    density: `Property density map of ${location}, showing areas with high concentration of buildings in darker shades`,
    schools: `School district boundaries map of ${location}, with color-coded zones for different school districts`,
    amenities: `Neighborhood amenities map of ${location}, highlighting parks, shopping centers, and public facilities`,
  };
  
  // Adjust for style variations
  const styleModifiers = {
    satellite: "satellite imagery view with data overlay",
    terrain: "3D terrain view with property data visualization",
    standard: "clean, minimalist design with clear data representation",
  };
  
  return `${mapTypePrompts[mapType]}, ${styleModifiers[style]}. Map visualization style, data visualization, GIS mapping, professional real estate data visualization`;
};

// Function to get a geographic map image
export const getGeoMapImage = async (options: GeoMapImageOptions): Promise<string> => {
  try {
    console.log(`Generating map for ${options.location} (${options.mapType})`);
    
    // In a real implementation, you would call an image generation API here
    // For now, we'll return a pre-defined fallback image
    const mapTypeImages = fallbackMapImages[options.mapType];
    const randomIndex = Math.floor(Math.random() * mapTypeImages.length);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mapTypeImages[randomIndex];
  } catch (error) {
    console.error("Error generating map image:", error);
    toast({
      title: "Error generating map",
      description: "Could not generate the map visualization. Using a fallback image.",
      variant: "destructive",
    });
    
    // Return a default fallback in case of error
    return fallbackMapImages[options.mapType][0];
  }
};
