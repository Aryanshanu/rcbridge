import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";

interface RawPropertyExtractorProps {
  onSuccess: () => void;
  onClose: () => void;
}

interface ExtractedData {
  title: string;
  description: string | null;
  price: number;
  location: string;
  property_type: string;
  listing_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  features: string[];
  confidence: number;
}

export function RawPropertyExtractor({ onSuccess, onClose }: RawPropertyExtractorProps) {
  const [rawText, setRawText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleExtract = async () => {
    if (!rawText.trim()) {
      toast.error("Please enter property text to extract");
      return;
    }

    setExtracting(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-reasoning-k2', {
        body: {
          prompt: `Extract property details from this text and return ONLY a JSON object with these fields:
{
  "title": "brief property title",
  "description": "detailed description or null",
  "price": number (in INR),
  "location": "area, city",
  "property_type": "residential/commercial/agricultural/undeveloped",
  "listing_type": "sale/rent/development_partnership",
  "bedrooms": number or null,
  "bathrooms": number or null,
  "area": number in sq ft or null,
  "features": ["feature1", "feature2"],
  "confidence": number between 0-1
}

Property text:
${rawText}`,
          type: 'reason'
        }
      });

      if (error) throw error;

      let extracted;
      if (typeof data === 'string') {
        // Try to extract JSON from markdown code blocks
        const jsonMatch = data.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        if (jsonMatch) {
          extracted = JSON.parse(jsonMatch[1]);
        } else {
          extracted = JSON.parse(data);
        }
      } else {
        extracted = data;
      }

      setExtractedData(extracted);
      toast.success("Property details extracted successfully");
    } catch (error: any) {
      console.error("Extraction error:", error);
      toast.error(`Failed to extract: ${error.message}`);
    } finally {
      setExtracting(false);
    }
  };

  const handleSave = async (status: 'active' | 'draft' | 'archived') => {
    if (!extractedData) return;

    setSaving(true);
    try {
      const { error } = await supabase.from("properties").insert({
        title: extractedData.title,
        description: extractedData.description,
        price: extractedData.price,
        location: extractedData.location,
        property_type: extractedData.property_type as any,
        listing_type: extractedData.listing_type as any,
        bedrooms: extractedData.bedrooms,
        bathrooms: extractedData.bathrooms,
        area: extractedData.area,
        features: extractedData.features,
        status: status,
        raw_source_data: { original_text: rawText, confidence: extractedData.confidence }
      });

      if (error) throw error;

      const statusLabel = status === 'active' ? 'published' : status === 'draft' ? 'saved as draft' : 'archived';
      toast.success(`Property ${statusLabel} successfully`);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(`Failed to save: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="raw-text">Property Description Text</Label>
          <Textarea
            id="raw-text"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste property details here... Example:
3BHK flat in Gachibowli
Price: 75 lakhs
Area: 1500 sqft
Amenities: Gym, Pool, 24/7 Security"
            rows={8}
            className="font-mono text-sm"
          />
        </div>

        <Button
          onClick={handleExtract}
          disabled={extracting || !rawText.trim()}
          className="w-full"
        >
          {extracting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Extracting with K2-Think AI...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Extract Property Details
            </>
          )}
        </Button>
      </div>

      {extractedData && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Extracted Property Details</CardTitle>
                <CardDescription>Review and edit before saving</CardDescription>
              </div>
              <Badge variant={extractedData.confidence > 0.8 ? "default" : "secondary"}>
                Confidence: {(extractedData.confidence * 100).toFixed(0)}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {extractedData.confidence < 0.7 && (
              <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <strong>Low confidence extraction.</strong> Please review all fields carefully before saving.
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={extractedData.title}
                  onChange={(e) => setExtractedData({ ...extractedData, title: e.target.value })}
                  disabled={!editMode}
                />
              </div>

              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  value={extractedData.price}
                  onChange={(e) => setExtractedData({ ...extractedData, price: parseFloat(e.target.value) })}
                  disabled={!editMode}
                />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={extractedData.location}
                  onChange={(e) => setExtractedData({ ...extractedData, location: e.target.value })}
                  disabled={!editMode}
                />
              </div>

              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select
                  value={extractedData.property_type}
                  onValueChange={(value) => setExtractedData({ ...extractedData, property_type: value })}
                  disabled={!editMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="agricultural">Agricultural</SelectItem>
                    <SelectItem value="undeveloped">Undeveloped</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Listing Type</Label>
                <Select
                  value={extractedData.listing_type}
                  onValueChange={(value) => setExtractedData({ ...extractedData, listing_type: value })}
                  disabled={!editMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="development_partnership">Development Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Bedrooms</Label>
                <Input
                  type="number"
                  value={extractedData.bedrooms || ""}
                  onChange={(e) => setExtractedData({ ...extractedData, bedrooms: e.target.value ? parseInt(e.target.value) : null })}
                  disabled={!editMode}
                />
              </div>

              <div className="space-y-2">
                <Label>Bathrooms</Label>
                <Input
                  type="number"
                  value={extractedData.bathrooms || ""}
                  onChange={(e) => setExtractedData({ ...extractedData, bathrooms: e.target.value ? parseInt(e.target.value) : null })}
                  disabled={!editMode}
                />
              </div>

              <div className="space-y-2">
                <Label>Area (sq ft)</Label>
                <Input
                  type="number"
                  value={extractedData.area || ""}
                  onChange={(e) => setExtractedData({ ...extractedData, area: e.target.value ? parseFloat(e.target.value) : null })}
                  disabled={!editMode}
                />
              </div>
            </div>

            {extractedData.description && (
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={extractedData.description}
                  onChange={(e) => setExtractedData({ ...extractedData, description: e.target.value })}
                  disabled={!editMode}
                  rows={3}
                />
              </div>
            )}

            {extractedData.features && extractedData.features.length > 0 && (
              <div className="space-y-2">
                <Label>Features</Label>
                <div className="flex flex-wrap gap-2">
                  {extractedData.features.map((feature, idx) => (
                    <Badge key={idx} variant="outline">{feature}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? "Lock" : "Edit Fields"}
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleSave('archived')}
                  disabled={saving}
                >
                  Archive
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                >
                  Save for Later
                </Button>
                <Button
                  onClick={() => handleSave('active')}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Publish Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
