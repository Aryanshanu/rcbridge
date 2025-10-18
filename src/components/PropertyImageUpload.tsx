
import { useState } from "react";
import { Upload, Image as ImageIcon, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PropertyImageUploadProps {
  propertyId: string;
  onUploadComplete?: (imageUrl: string) => void;
}

export const PropertyImageUpload = ({ propertyId, onUploadComplete }: PropertyImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to sign in to upload property images.",
        variant: "destructive",
      });
      navigate("/login", { state: { returnTo: window.location.pathname } });
      return;
    }

    // Security: Validate file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File Too Large",
        description: "Image must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    // Security: Validate MIME type
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Only JPG, PNG, WEBP, and GIF images are allowed",
        variant: "destructive",
      });
      return;
    }

    // Security: Validate file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    if (!fileExt || !ALLOWED_EXTENSIONS.includes(fileExt)) {
      toast({
        title: "Invalid File Extension",
        description: "Only .jpg, .png, .webp, and .gif files are allowed",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload image to Supabase Storage
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${propertyId}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('property_images')
        .upload(filePath, file, {
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('property_images')
        .getPublicUrl(filePath);

      // Save image metadata to database
      const { error: dbError } = await supabase
        .from('property_images')
        .insert({
          property_id: propertyId,
          url: publicUrl,
          is_primary: false,
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      onUploadComplete?.(publicUrl);
    } catch (error: any) {
      // Image upload failed - show user-friendly message
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>
          You need to sign in before you can upload property images.
        </AlertDescription>
        <div className="mt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/login", { state: { returnTo: window.location.pathname } })}
          >
            Sign In Now
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <input
        type="file"
        id="property-image"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        disabled={isUploading}
      />
      <label
        htmlFor="property-image"
        className="flex flex-col items-center justify-center cursor-pointer w-full"
      >
        {isUploading ? (
          <div className="animate-pulse">
            <Upload className="w-12 h-12 text-gray-400" />
          </div>
        ) : (
          <ImageIcon className="w-12 h-12 text-gray-400" />
        )}
        <span className="mt-2 text-sm text-gray-500">
          {isUploading ? "Uploading..." : "Click to upload property image"}
        </span>
        <p className="mt-1 text-xs text-gray-400">
          Supported formats: JPG, PNG, WEBP, GIF (Max 10MB)
        </p>
      </label>
    </div>
  );
};
