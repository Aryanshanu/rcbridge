
import { useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PropertyImageUploadProps {
  propertyId: string;
  onUploadComplete?: (imageUrl: string) => void;
}

export const PropertyImageUpload = ({ propertyId, onUploadComplete }: PropertyImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
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
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

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
        className="flex flex-col items-center justify-center cursor-pointer"
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
      </label>
    </div>
  );
};
