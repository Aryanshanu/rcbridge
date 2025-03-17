
import { useState } from "react";
import { Building, MapPin, Bed, Bath, Square, Heart, Bookmark, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PropertyType {
  id: string;
  title: string;
  location: string;
  price: string;
  bedrooms?: number;
  bathrooms?: number;
  area: string;
}

interface TextPropertyCardProps {
  property: PropertyType;
  className?: string;
  onWantToKnowMore?: (property: PropertyType) => void;
  hideActions?: boolean;
}

export const TextPropertyCard = ({ 
  property, 
  className, 
  onWantToKnowMore,
  hideActions = false
}: TextPropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Determine property type based on bedrooms
  const propertyType = property.bedrooms === 0 ? 'commercial' : 
                      property.bedrooms && property.bedrooms > 3 ? 'luxury' : 'residential';
  
  // Set color based on property type
  const propertyColor = propertyType === 'commercial' ? '#3B82F6' : // Commercial (blue)
                       propertyType === 'luxury' ? '#8B5CF6' : // Luxury (purple)
                       '#10B981'; // Residential (green)
  
  const requireAuth = (callback: () => void) => {
    if (user) {
      callback();
    } else {
      setShowAuthDialog(true);
    }
  };
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click
    requireAuth(() => {
      setIsLiked(!isLiked);
      toast({
        title: isLiked ? "Removed from likes" : "Added to likes",
        description: isLiked ? "Property removed from your liked properties" : "Property added to your liked properties",
        duration: 3000,
      });
    });
  };
  
  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click
    requireAuth(() => {
      setIsSaved(!isSaved);
      toast({
        title: isSaved ? "Removed from saved" : "Saved property",
        description: isSaved ? "Property removed from your saved list" : "Property saved for future reference",
        duration: 3000,
      });
    });
  };
  
  const handleWantToKnowMore = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click
    requireAuth(() => {
      if (onWantToKnowMore) {
        onWantToKnowMore(property);
      }
    });
  };
  
  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-300",
        className
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{property.title}</h3>
        <div 
          className="px-2 py-1 rounded-full text-xs font-medium text-white whitespace-nowrap ml-2 flex-shrink-0"
          style={{ backgroundColor: propertyColor }}
        >
          {propertyType === 'commercial' ? (
            <span className="flex items-center"><Building className="w-3 h-3 mr-1" /> Commercial</span>
          ) : propertyType === 'luxury' ? (
            <span className="flex items-center"><Building className="w-3 h-3 mr-1" /> Luxury</span>
          ) : (
            <span className="flex items-center"><Building className="w-3 h-3 mr-1" /> Residential</span>
          )}
        </div>
      </div>
      
      <div className="flex items-start mb-3">
        <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="ml-2 text-gray-600 text-sm">{property.location}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center text-[#1e40af] font-bold text-xl">
          {property.price}
        </div>
        
        <div className="flex items-center justify-end text-sm text-gray-500">
          <Square className="h-4 w-4 mr-1 text-gray-400" />
          {property.area}
        </div>
      </div>
      
      {/* Property Specs */}
      {property.bedrooms !== undefined && property.bedrooms > 0 && (
        <div className="flex justify-between pt-3 border-t border-gray-100 mb-4">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1 text-gray-400" />
            <span className="text-sm">{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
          </div>
          
          {property.bathrooms && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1 text-gray-400" />
              <span className="text-sm">{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
          )}
        </div>
      )}
      
      {/* Action Buttons - Only show when not hidden */}
      {!hideActions && (
        <>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button 
              onClick={handleLike}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-md transition-colors duration-200",
                isLiked ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              )}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-red-500")} />
              <span className="text-xs mt-1">Like</span>
            </button>
            
            <button 
              onClick={handleSave}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-md transition-colors duration-200",
                isSaved ? "bg-blue-50 text-blue-500" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              )}
            >
              <Bookmark className={cn("h-4 w-4", isSaved && "fill-blue-500")} />
              <span className="text-xs mt-1">Save</span>
            </button>
            
            <button 
              className="flex flex-col items-center justify-center p-2 rounded-md bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors duration-200"
              onClick={handleWantToKnowMore}
            >
              <Info className="h-4 w-4" />
              <span className="text-xs mt-1">More Info</span>
            </button>
          </div>
          
          <Button 
            onClick={handleWantToKnowMore}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition-all duration-300"
          >
            <Info className="h-4 w-4" />
            Want to Know More
          </Button>
          
          {/* Authentication Dialog */}
          <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Authentication Required</DialogTitle>
                <DialogDescription>
                  You need to be signed in to perform this action.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setShowAuthDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  window.location.href = "/login";
                }}>
                  Sign In
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};
