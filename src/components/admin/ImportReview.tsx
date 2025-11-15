import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle, AlertTriangle, Edit2, X } from "lucide-react";
import { formatPrice } from "@/utils/propertyUtils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProcessedRecord {
  index: number;
  raw_text: string;
  raw_data?: any;
  property?: any;
  status: "valid" | "warning" | "error";
  warnings: string[];
  errors: string[];
  duplicate?: {
    confidence: number;
    matches: Array<{
      id: string;
      confidence: number;
      reason: string;
      existing?: any;
    }>;
  };
  confidence: number;
}

interface ImportReviewProps {
  open: boolean;
  onClose: () => void;
  jobId: string;
  records: ProcessedRecord[];
  summary: {
    total: number;
    valid: number;
    warnings: number;
    errors: number;
    duplicates: number;
  };
  onApproveAll: (approvedRecords: any[]) => void;
}

export function ImportReview({
  open,
  onClose,
  jobId,
  records,
  summary,
  onApproveAll,
}: ImportReviewProps) {
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);
  const [editedProperties, setEditedProperties] = useState<Record<number, any>>({});
  const [approvedRecords, setApprovedRecords] = useState<Set<number>>(new Set());
  const [rejectedRecords, setRejectedRecords] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (index: number, field: string, value: any) => {
    setEditedProperties((prev) => ({
      ...prev,
      [index]: {
        ...(prev[index] || records[index].property),
        [field]: value,
      },
    }));
  };

  const handleApprove = (index: number) => {
    setApprovedRecords((prev) => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
    setRejectedRecords((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const handleReject = (index: number) => {
    setRejectedRecords((prev) => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
    setApprovedRecords((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const handleBulkApproveValid = () => {
    const validIndices = records
      .filter((r) => r.status === "valid" && !r.duplicate)
      .map((r) => r.index);
    
    setApprovedRecords((prev) => {
      const newSet = new Set(prev);
      validIndices.forEach((i) => newSet.add(i));
      return newSet;
    });
  };

  const handleSubmit = async () => {
    const approvedList = Array.from(approvedRecords)
      .map((index) => {
        const record = records.find((r) => r.index === index);
        if (!record || !record.property) return null;

        const edited = editedProperties[index];
        return {
          ...record.property,
          ...edited,
          raw_data: record.raw_data,
          duplicate_of: record.duplicate?.matches[0]?.id || null,
          duplicate_confidence: record.duplicate?.confidence || null,
        };
      })
      .filter(Boolean);

    if (approvedList.length === 0) {
      toast.error("No properties approved for import");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("finalize-import", {
        body: {
          job_id: jobId,
          approved_records: approvedList,
        },
      });

      if (error) throw error;

      toast.success(`Successfully imported ${data.inserted} properties`);
      
      if (data.errors > 0) {
        toast.warning(`${data.errors} properties failed to import`);
      }

      onApproveAll(approvedList);
      onClose();
    } catch (error) {
      console.error("Import finalization error:", error);
      toast.error("Failed to finalize import");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30">Valid</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30">Warning</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30">Error</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Review Import ({summary.total} properties)</DialogTitle>
          <DialogDescription>
            Review extracted properties before importing. Edit any incorrect fields.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm">Valid: {summary.valid}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm">Warnings: {summary.warnings}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm">Errors: {summary.errors}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <span className="text-sm">Duplicates: {summary.duplicates}</span>
          </div>
        </div>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {records.map((record) => {
              const isApproved = approvedRecords.has(record.index);
              const isRejected = rejectedRecords.has(record.index);
              const isEditing = selectedRecord === record.index;
              const property = editedProperties[record.index] || record.property;

              return (
                <div
                  key={record.index}
                  className={`border rounded-lg p-4 ${
                    isApproved
                      ? "border-green-500 bg-green-50 dark:bg-green-900/10"
                      : isRejected
                      ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(record.status)}
                      <span className="font-medium">Property {record.index + 1}</span>
                      {getStatusBadge(record.status)}
                      {record.duplicate && (
                        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30">
                          Duplicate ({(record.duplicate.confidence * 100).toFixed(0)}%)
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedRecord(isEditing ? null : record.index)}
                      >
                        {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                      </Button>
                      {!isRejected && (
                        <Button
                          size="sm"
                          variant={isApproved ? "default" : "outline"}
                          onClick={() => handleApprove(record.index)}
                          disabled={record.status === "error"}
                        >
                          {isApproved ? "Approved" : "Approve"}
                        </Button>
                      )}
                      {!isApproved && (
                        <Button
                          size="sm"
                          variant={isRejected ? "destructive" : "outline"}
                          onClick={() => handleReject(record.index)}
                        >
                          {isRejected ? "Rejected" : "Reject"}
                        </Button>
                      )}
                    </div>
                  </div>

                  {property && (
                    <div className="space-y-2">
                      {isEditing ? (
                        <>
                          <Input
                            value={property.title || ""}
                            onChange={(e) => handleEdit(record.index, "title", e.target.value)}
                            placeholder="Property title"
                          />
                          <Input
                            value={property.location || ""}
                            onChange={(e) => handleEdit(record.index, "location", e.target.value)}
                            placeholder="Location"
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <Input
                              type="number"
                              value={property.price || ""}
                              onChange={(e) => handleEdit(record.index, "price", parseFloat(e.target.value))}
                              placeholder="Price"
                            />
                            <Input
                              type="number"
                              value={property.bedrooms || ""}
                              onChange={(e) => handleEdit(record.index, "bedrooms", parseInt(e.target.value))}
                              placeholder="Bedrooms"
                            />
                            <Input
                              type="number"
                              value={property.area || ""}
                              onChange={(e) => handleEdit(record.index, "area", parseFloat(e.target.value))}
                              placeholder="Area (sq ft)"
                            />
                          </div>
                          <Textarea
                            value={property.description || ""}
                            onChange={(e) => handleEdit(record.index, "description", e.target.value)}
                            placeholder="Description"
                            rows={3}
                          />
                        </>
                      ) : (
                        <>
                          <p className="font-medium">{property.title}</p>
                          <p className="text-sm text-muted-foreground">{property.location}</p>
                          <div className="flex gap-4 text-sm">
                            <span className="font-semibold">{formatPrice(property.price)}</span>
                            {property.bedrooms && <span>{property.bedrooms} BHK</span>}
                            {property.area && <span>{property.area} sq ft</span>}
                          </div>
                          {property.source_contact_phone && (
                            <p className="text-sm">Contact: {property.source_contact_phone}</p>
                          )}
                        </>
                      )}

                      {record.warnings.length > 0 && (
                        <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm">
                          <p className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Warnings:</p>
                          <ul className="list-disc list-inside space-y-1 text-yellow-700 dark:text-yellow-400">
                            {record.warnings.map((w, i) => (
                              <li key={i}>{w}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {record.errors.length > 0 && (
                        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm">
                          <p className="font-medium text-red-800 dark:text-red-300 mb-1">Errors:</p>
                          <ul className="list-disc list-inside space-y-1 text-red-700 dark:text-red-400">
                            {record.errors.map((e, i) => (
                              <li key={i}>{e}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {record.duplicate && (
                        <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-sm">
                          <p className="font-medium text-orange-800 dark:text-orange-300 mb-1">
                            Possible Duplicate:
                          </p>
                          {record.duplicate.matches[0]?.existing && (
                            <div className="text-orange-700 dark:text-orange-400">
                              <p>Match: {record.duplicate.matches[0].existing.title}</p>
                              <p className="text-xs">{record.duplicate.matches[0].reason}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <Separator />

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {approvedRecords.size} approved, {rejectedRecords.size} rejected
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBulkApproveValid}>
              Approve All Valid
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={approvedRecords.size === 0 || isSubmitting}
            >
              {isSubmitting ? "Importing..." : `Import ${approvedRecords.size} Properties`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
