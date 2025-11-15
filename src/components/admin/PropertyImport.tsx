import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";
import { ImportReview } from "./ImportReview";

export const PropertyImport = () => {
  const [rawData, setRawData] = useState("");
  const [importing, setImporting] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewData, setReviewData] = useState<any>(null);

  const parseRawData = (data: string) => {
    const posts = [];
    const lines = data.split('\n');
    let currentPost: any = {};
    let currentField = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (/^\d+$/.test(line)) {
        if (currentPost.text) posts.push(currentPost);
        currentPost = {};
        currentField = 'text';
        continue;
      }
      if (line.startsWith('https://www.instagram.com')) {
        currentPost.url = line;
        continue;
      }
      if (line.match(/^\d{4}-\d{2}-\d{2}T/)) continue;
      if (/^-?\d+$/.test(line) || line.includes('items')) continue;
      if (currentField === 'text' && line) {
        currentPost.text = (currentPost.text || '') + line + ' ';
      }
    }
    if (currentPost.text) posts.push(currentPost);
    return posts.filter(p => p.text && p.url);
  };

  const handleImport = async () => {
    if (!rawData.trim()) {
      toast.error("Please paste Instagram data");
      return;
    }

    setImporting(true);

    try {
      const posts = parseRawData(rawData);
      if (posts.length === 0) {
        toast.error("No valid posts found in the pasted data");
        setImporting(false);
        return;
      }

      toast.info(`Found ${posts.length} posts, processing with K2-Think...`);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to import properties");
        setImporting(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke("import-instagram-properties", {
        body: { posts },
      });

      if (error) throw error;

      console.log("Import response:", data);
      setReviewData(data);
      setShowReview(true);
      toast.success(`Processed ${data.summary.total} posts with K2-Think AI`);
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to process Instagram data");
    } finally {
      setImporting(false);
    }
  };

  const handleApproveAll = (approvedRecords: any[]) => {
    setRawData("");
    setShowReview(false);
    setReviewData(null);
    toast.success(`Import complete! ${approvedRecords.length} properties added.`);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Instagram Properties
          </CardTitle>
          <CardDescription>
            Paste raw Instagram data. K2-Think AI will extract, normalize, and detect duplicates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste Instagram raw data here..."
            value={rawData}
            onChange={(e) => setRawData(e.target.value)}
            rows={10}
            className="font-mono text-sm"
          />
          <Button onClick={handleImport} disabled={importing || !rawData.trim()} className="w-full">
            {importing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing with K2-Think AI...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Process with K2-Think AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {reviewData && (
        <ImportReview
          open={showReview}
          onClose={() => setShowReview(false)}
          jobId={reviewData.job_id}
          records={reviewData.records}
          summary={reviewData.summary}
          onApproveAll={handleApproveAll}
        />
      )}
    </>
  );
};
