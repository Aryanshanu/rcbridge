
// This module provides property image generation functionality
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to use browser cache for better performance
env.useBrowserCache = true;

// Initialize the image generation model
let imageModel = null;

export interface PropertyImageOptions {
  type: 'luxury' | 'residential' | 'commercial';
  style?: 'modern' | 'traditional' | 'contemporary';
  location?: string;
  isExterior?: boolean;
}

export interface GeoMapImageOptions {
  mapType: 'pricing' | 'density' | 'schools' | 'amenities';
  location: string;
  style?: 'satellite' | 'terrain' | 'standard';
}

/**
 * Initialize the image generation model
 */
export async function initializeImageModel() {
  if (!imageModel) {
    console.log('Initializing image generation model...');
    try {
      // Use a specialized model for real estate images
      // text-to-image is a valid pipeline type in the runtime but missing in TypeScript definitions
      // @ts-expect-error - text-to-image is a valid pipeline type in the runtime but missing in TypeScript definitions
      imageModel = await pipeline(
        'text-to-image',
        'stabilityai/stable-diffusion-2-1', 
        { device: 'webgpu' }
      );
      console.log('Image model initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize image model:', error);
      // Fallback to pre-generated images
      return false;
    }
  }
  return true;
}

// Pre-generated realistic property images
const preGeneratedImages = {
  luxury: [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    'https://images.unsplash.com/photo-1600607687644-4e4d6bb8804b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
  ],
  residential: [
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
  ],
  commercial: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    'https://images.unsplash.com/photo-1577760258779-e787a1733016?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    'https://images.unsplash.com/photo-1582826628006-7920ee981de1?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
  ]
};

// Pre-generated geographic map images
const preGeneratedMaps = {
  pricing: [
    'https://images.unsplash.com/photo-1569429593410-b498b3fb3387?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    'https://images.unsplash.com/photo-1572168173859-8da4046584e8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
  ],
  density: [
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    'https://images.unsplash.com/photo-1596423816181-24669eec960a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
  ],
  schools: [
    'https://images.unsplash.com/photo-1566163203583-e08d10fe71c4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    'https://images.unsplash.com/photo-1585413341423-80a14fa473a6?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
  ],
  amenities: [
    'https://images.unsplash.com/photo-1557032070-6ecd9115d5e1?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    'https://images.unsplash.com/photo-1576854531280-9087cfd26e86?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
  ]
};

/**
 * Generate a prompt for real estate property images
 */
function generatePropertyImagePrompt({ type, style = 'modern', location = 'Hyderabad', isExterior = true }: PropertyImageOptions): string {
  const typeDescriptions = {
    luxury: 'luxurious mansion, opulent, high-end finishes, premium property',
    residential: 'beautiful residential house, family home, comfortable living space',
    commercial: 'modern office building, professional business space, corporate architecture'
  };

  const viewType = isExterior ? 'exterior view' : 'interior view';
  const styleDesc = style === 'modern' ? 'contemporary architectural design' : 
                     style === 'traditional' ? 'classic architectural elements' : 'sleek contemporary design';

  return `Ultra realistic professional real estate photography of a ${typeDescriptions[type]} in ${location}, ${viewType}, ${styleDesc}, natural lighting, high resolution, photorealistic, architectural photography, no text`;
}

/**
 * Generate a prompt for geographic map images
 */
function generateGeoMapImagePrompt({ mapType, location, style = 'standard' }: GeoMapImageOptions): string {
  const mapDescriptions = {
    pricing: 'real estate heat map showing property prices',
    density: 'property density map with color-coded zones',
    schools: 'school district boundaries map with highlighted zones',
    amenities: 'neighborhood amenities map showing parks, shopping centers, and transportation'
  };

  const styleDesc = style === 'satellite' ? 'satellite view with data overlay' : 
                    style === 'terrain' ? 'terrain view with elevation data' : 'clean design with clear labels';

  return `Professional ${mapDescriptions[mapType]} of ${location}, ${styleDesc}, data visualization, urban planning, GIS map, color-coded, informative, clear labels, no text overlay, high detail`;
}

/**
 * Get a realistic property image, either generated or from pre-generated collection
 */
export async function getPropertyImage(options: PropertyImageOptions): Promise<string> {
  // First try to initialize the model
  const modelInitialized = await initializeImageModel();
  
  // Check if WebGPU is supported in the environment
  const webGPUSupported = typeof navigator !== 'undefined' && 'gpu' in navigator;
  
  // If model is initialized successfully and we're in a compatible environment, generate image
  if (modelInitialized && imageModel && webGPUSupported) {
    try {
      console.log('Generating property image...');
      const prompt = generatePropertyImagePrompt(options);
      const result = await imageModel(prompt);
      
      // Convert result to URL
      if (result && result[0]) {
        return URL.createObjectURL(result[0]);
      }
    } catch (error) {
      console.error('Error generating image:', error);
      // Fall back to pre-generated images
    }
  }
  
  // Fallback to pre-generated images
  const imageCategory = options.type;
  const randomIndex = Math.floor(Math.random() * preGeneratedImages[imageCategory].length);
  return preGeneratedImages[imageCategory][randomIndex];
}

/**
 * Get a geographic map image, either generated or from pre-generated collection
 */
export async function getGeoMapImage(options: GeoMapImageOptions): Promise<string> {
  // First try to initialize the model
  const modelInitialized = await initializeImageModel();
  
  // Check if WebGPU is supported in the environment
  const webGPUSupported = typeof navigator !== 'undefined' && 'gpu' in navigator;
  
  // If model is initialized successfully and we're in a compatible environment, generate image
  if (modelInitialized && imageModel && webGPUSupported) {
    try {
      console.log('Generating geographic map image...');
      const prompt = generateGeoMapImagePrompt(options);
      const result = await imageModel(prompt);
      
      // Convert result to URL
      if (result && result[0]) {
        return URL.createObjectURL(result[0]);
      }
    } catch (error) {
      console.error('Error generating map image:', error);
      // Fall back to pre-generated images
    }
  }
  
  // Fallback to pre-generated images
  const mapCategory = options.mapType;
  const randomIndex = Math.floor(Math.random() * preGeneratedMaps[mapCategory].length);
  return preGeneratedMaps[mapCategory][randomIndex];
}
