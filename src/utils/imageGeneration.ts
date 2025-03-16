
import React, { useState, useEffect } from 'react';
import { generatePropertyImage } from './chatbotUtils';
import { useToast } from '@/hooks/use-toast';

// Cache for generated images to avoid repeated API calls
const imageCache = new Map();

export async function getPropertyImage(description: string): Promise<string> {
  try {
    // Check cache first
    if (imageCache.has(description)) {
      return imageCache.get(description);
    }
    
    // Use placeholder while generating
    const placeholder = '/placeholder.svg';
    
    // Start generating image in background
    generatePropertyImage(description).then(imageData => {
      if (imageData) {
        console.log('Successfully generated image for:', description);
        imageCache.set(description, imageData);
        // Force re-render by dispatching a custom event
        window.dispatchEvent(new CustomEvent('property-image-ready', { detail: { description } }));
      }
    }).catch(error => {
      console.error('Failed to generate property image:', error);
    });
    
    // Return placeholder initially
    return placeholder;
  } catch (error) {
    console.error('Error in getPropertyImage:', error);
    return '/placeholder.svg';
  }
}

// Geographic map image generation function
export async function getGeoMapImage(options: {
  location: string;
  mapType: 'pricing' | 'density' | 'schools' | 'amenities';
  style?: 'satellite' | 'terrain' | 'standard';
}): Promise<string> {
  const { location, mapType, style = 'standard' } = options;
  
  // Create a unique key for caching
  const cacheKey = `geomap-${location}-${mapType}-${style}`;
  
  try {
    // Check cache first
    if (imageCache.has(cacheKey)) {
      return imageCache.get(cacheKey);
    }
    
    // Create a descriptive prompt for the map image
    let mapPrompt = '';
    
    switch (mapType) {
      case 'pricing':
        mapPrompt = `Real estate price heatmap of ${location}, ${style} style map view, property pricing visualization, color gradient indicating price ranges`;
        break;
      case 'density':
        mapPrompt = `Property density map of ${location}, ${style} style map view, concentration of buildings and development, urban planning visualization`;
        break;
      case 'schools':
        mapPrompt = `School district map of ${location}, ${style} style map view, education zones, school location markers, district boundaries`;
        break;
      case 'amenities':
        mapPrompt = `Neighborhood amenities map of ${location}, ${style} style map view, parks, shopping centers, restaurants, and public facilities`;
        break;
    }
    
    // Use placeholder while generating
    const placeholder = '/placeholder.svg';
    
    // Generate the map image in background
    generatePropertyImage(mapPrompt).then(imageData => {
      if (imageData) {
        console.log('Successfully generated map image for:', cacheKey);
        imageCache.set(cacheKey, imageData);
        // Force re-render by dispatching a custom event
        window.dispatchEvent(new CustomEvent('geomap-image-ready', { detail: { cacheKey } }));
      }
    }).catch(error => {
      console.error('Failed to generate map image:', error);
    });
    
    // Return placeholder initially
    return placeholder;
  } catch (error) {
    console.error('Error in getGeoMapImage:', error);
    return '/placeholder.svg';
  }
}

// Utility function to help create a property image description from property data
export function createImagePrompt(property: any): string {
  let prompt = '';
  
  if (property.type) {
    prompt += property.type + ' ';
  }
  
  if (property.bedrooms) {
    prompt += property.bedrooms + ' bedroom ';
  }
  
  if (property.title) {
    // Extract key features from title
    const titleWords = property.title.toLowerCase().split(' ');
    const keyFeatures = ['modern', 'luxury', 'spacious', 'cozy', 'waterfront', 'garden', 'view', 'penthouse', 'villa', 'apartment'];
    
    keyFeatures.forEach(feature => {
      if (titleWords.includes(feature)) {
        prompt += feature + ' ';
      }
    });
  }
  
  if (property.location) {
    prompt += 'in ' + property.location;
  } else {
    prompt += 'in Hyderabad';
  }
  
  return prompt.trim();
}

// Hook to handle image loading with feedback
export function usePropertyImage(propertyDescription: string) {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string>('/placeholder.svg');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    let isMounted = true;
    
    const loadImage = async () => {
      if (!propertyDescription) return;
      
      setIsLoading(true);
      try {
        // Check cache first
        if (imageCache.has(propertyDescription)) {
          if (isMounted) {
            setImageUrl(imageCache.get(propertyDescription));
            setIsLoading(false);
          }
          return;
        }
        
        // Start request for image generation
        const result = await generatePropertyImage(propertyDescription);
        
        if (result && isMounted) {
          setImageUrl(result);
          imageCache.set(propertyDescription, result);
        }
      } catch (error) {
        console.error('Error loading property image:', error);
        if (isMounted) {
          toast({
            title: "Image Generation Failed",
            description: "Using placeholder image instead",
            variant: "destructive"
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadImage();
    
    // Listen for image ready events
    const handleImageReady = (event: CustomEvent) => {
      if (event.detail.description === propertyDescription && isMounted) {
        setImageUrl(imageCache.get(propertyDescription));
      }
    };
    
    window.addEventListener('property-image-ready', handleImageReady as EventListener);
    
    return () => {
      isMounted = false;
      window.removeEventListener('property-image-ready', handleImageReady as EventListener);
    };
  }, [propertyDescription, toast]);
  
  return { imageUrl, isLoading };
}
