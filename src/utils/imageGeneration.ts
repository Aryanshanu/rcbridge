
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
  const [imageUrl, setImageUrl] = React.useState<string>('/placeholder.svg');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  
  React.useEffect(() => {
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
