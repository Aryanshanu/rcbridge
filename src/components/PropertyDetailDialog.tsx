import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Maximize, Share2, Heart } from "lucide-react";
import { formatPrice, formatArea, getPropertyTypeBadgeColor, capitalizeWords } from "@/utils/propertyUtils";
import { LazyImage } from "@/components/ui/LazyImage";
import { useState } from "react";
import { toast } from "sonner";

interface PropertyDetailDialogProps {
  property: any;
  isOpen: boolean;
  onClose: () => void;
  images: string[];
}

export const PropertyDetailDialog = ({ property, isOpen, onClose, images }: PropertyDetailDialogProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!property) return null;

  const handleShare = async () => {
    try {
      await navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href,
      });
      toast.success("Property shared successfully");
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{property.title}</DialogTitle>
          <DialogDescription className="flex items-center text-base">
            <MapPin className="h-4 w-4 mr-1" />
            {property.location}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {images.length > 0 && (
            <div className="relative">
              <LazyImage
                src={images[currentImageIndex]}
                alt={property.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentImageIndex ? "bg-white w-8" : "bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-primary">{formatPrice(property.price)}</div>
              <Badge className={getPropertyTypeBadgeColor(property.property_type)}>
                {capitalizeWords(property.property_type)}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={toggleFavorite}>
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {property.bedrooms && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Bed className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Bedrooms</div>
                  <div className="font-semibold">{property.bedrooms}</div>
                </div>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Bath className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Bathrooms</div>
                  <div className="font-semibold">{property.bathrooms}</div>
                </div>
              </div>
            )}
            {property.area && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Maximize className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Area</div>
                  <div className="font-semibold">{formatArea(property.area)}</div>
                </div>
              </div>
            )}
          </div>

          {property.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{property.description}</p>
            </div>
          )}

          {property.amenities && Object.keys(property.amenities).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(property.amenities).map(([key, value]) => (
                  value && (
                    <Badge key={key} variant="secondary">
                      {capitalizeWords(key.replace(/_/g, " "))}
                    </Badge>
                  )
                ))}
              </div>
            </div>
          )}

          <Button className="w-full" size="lg">
            Contact Owner
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
