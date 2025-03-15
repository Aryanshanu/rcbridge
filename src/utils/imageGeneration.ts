
import { toast } from "@/hooks/use-toast";

// Define the types of maps we support
export type MapType = 'pricing' | 'density' | 'schools' | 'amenities';

// Options for getting a geographic map
export interface GeoMapImageOptions {
  mapType: MapType;
  location: string;
  style?: 'satellite' | 'terrain' | 'standard';
}

// Options for getting a property image
export interface PropertyImageOptions {
  type: 'luxury' | 'residential' | 'commercial';
  location: string;
  isExterior?: boolean;
}

// Pre-generated map images to use as fallbacks - using publicly accessible Unsplash images
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

// Pre-generated property images to use as fallbacks - using publicly accessible Unsplash images
const fallbackPropertyImages: Record<'luxury' | 'residential' | 'commercial', string[]> = {
  luxury: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000',
    'https://images.unsplash.com/photo-1609347744417-539d247640d1?q=80&w=1000',
  ],
  residential: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1000',
  ],
  commercial: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000',
    'https://images.unsplash.com/photo-1577164258643-2a066da7e0e3?q=80&w=1000',
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

// Function to generate appropriate prompts for property images based on the input options
const generatePropertyImagePrompt = (options: PropertyImageOptions): string => {
  const { type, location, isExterior = true } = options;
  
  // Base prompts for different property types
  const propertyTypePrompts = {
    luxury: `Luxury ${isExterior ? 'exterior' : 'interior'} of a high-end property in ${location}`,
    residential: `Residential ${isExterior ? 'home exterior' : 'home interior'} in ${location}`,
    commercial: `Commercial ${isExterior ? 'building exterior' : 'office space'} in ${location}`,
  };
  
  return `${propertyTypePrompts[type]}, professional real estate photography, high resolution, wide angle, well-lit, modern architecture`;
};

// Function to get a geographic map image
export const getGeoMapImage = async (options: GeoMapImageOptions): Promise<string> => {
  try {
    console.log(`Generating map for ${options.location} (${options.mapType})`);
    
    // In a real implementation, you would call an image generation API here
    // For now, we'll return a pre-defined fallback image with direct https URLs
    const mapTypeImages = fallbackMapImages[options.mapType];
    const randomIndex = Math.floor(Math.random() * mapTypeImages.length);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
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

// Function to get a property image
export const getPropertyImage = async (options: PropertyImageOptions): Promise<string> => {
  try {
    console.log(`Generating property image for ${options.location} (${options.type})`);
    
    // In a real implementation, you would call an image generation API here
    // For now, we'll return a pre-defined fallback image with direct https URLs
    const propertyTypeImages = fallbackPropertyImages[options.type];
    const randomIndex = Math.floor(Math.random() * propertyTypeImages.length);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return propertyTypeImages[randomIndex];
  } catch (error) {
    console.error("Error generating property image:", error);
    toast({
      title: "Error generating property image",
      description: "Could not generate the property image. Using a fallback image.",
      variant: "destructive",
    });
    
    // Return a default fallback in case of error
    return fallbackPropertyImages[options.type][0];
  }
};
