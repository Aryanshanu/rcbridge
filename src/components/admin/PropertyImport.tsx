import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ImportSummary {
  total: number;
  added: number;
  updated: number;
  skipped: number;
  errors: number;
}

export const PropertyImport = () => {
  const [rawData, setRawData] = useState("");
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const parseRawData = (data: string) => {
    const posts = [];
    const lines = data.split('\n');
    let currentPost: any = {};
    let currentField = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Detect start of new entry (numbered entry)
      if (/^\d+$/.test(line)) {
        if (currentPost.description) {
          posts.push(currentPost);
        }
        currentPost = {};
        currentField = 'description';
        continue;
      }

      // Detect account name (lines without URLs, hashtags at start)
      if (line && !line.startsWith('http') && !line.includes('@') && currentPost.description && !currentPost.account_name) {
        currentPost.account_name = line;
        continue;
      }

      // Detect Instagram handle
      if (line && !line.startsWith('http') && !line.startsWith('#') && currentPost.account_name && !currentPost.instagram_handle) {
        currentPost.instagram_handle = line;
        continue;
      }

      // Detect Instagram URL
      if (line.startsWith('https://www.instagram.com')) {
        currentPost.post_url = line;
        continue;
      }

      // Detect timestamp (ISO format)
      if (line.match(/^\d{4}-\d{2}-\d{2}T/)) {
        currentPost.timestamp = line;
        continue;
      }

      // Skip numeric only lines (engagement metrics)
      if (/^-?\d+$/.test(line)) {
        continue;
      }

      // Skip "items" lines
      if (line.includes('items')) {
        continue;
      }

      // Accumulate description
      if (currentField === 'description' && line) {
        currentPost.description = (currentPost.description || '') + line + ' ';
      }
    }

    // Add last post
    if (currentPost.description) {
      posts.push(currentPost);
    }

    return posts.filter(p => p.description && p.post_url);
  };

  const handleImport = async () => {
    if (!rawData.trim()) {
      toast.error("Please paste Instagram data");
      return;
    }

    setImporting(true);
    setProgress(0);
    setSummary(null);
    setErrors([]);

    try {
      // Parse raw data
      setProgress(10);
      const posts = parseRawData(rawData);
      
      if (posts.length === 0) {
        toast.error("No valid posts found in the pasted data");
        setImporting(false);
        return;
      }

      toast.success(`Found ${posts.length} posts, starting import...`);
      setProgress(30);

      // Call edge function
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("You must be logged in to import properties");
        setImporting(false);
        return;
      }

      const SUPABASE_URL = "https://hchtekfbtcbfsfxkjyfi.supabase.co";
      
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/import-instagram-properties`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ posts }),
        }
      );

      setProgress(70);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Import failed');
      }

      const result = await response.json();
      setProgress(100);
      
      setSummary(result.summary);
      if (result.errors) {
        setErrors(result.errors);
      }

      toast.success(`Import completed! Added ${result.summary.added}, Updated ${result.summary.updated}`);
      
      // Clear data on success
      setRawData("");

    } catch (error) {
      console.error('Import error:', error);
      toast.error(error.message || "Failed to import properties");
      setErrors([error.message]);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Instagram Properties
          </CardTitle>
          <CardDescription>
            Paste raw Instagram data below. The system will automatically parse and import properties.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Instagram Data (Paste raw text)
            </label>
            <Textarea
              value={rawData}
              onChange={(e) => setRawData(e.target.value)}
              placeholder="Paste Instagram data here...&#10;&#10;Example:&#10;1&#10;🏡✨ Premium Plotting @ Elkatta...&#10;Silicon homes&#10;siliconhomeshyd&#10;https://www.instagram.com/p/..."
              className="min-h-[300px] font-mono text-sm"
              disabled={importing}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Paste the entire Instagram export data including descriptions, account names, handles, and URLs.
            </p>
          </div>

          {importing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Processing...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          <Button 
            onClick={handleImport} 
            disabled={importing || !rawData.trim()}
            className="w-full"
          >
            {importing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing Properties...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Import Properties
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Import Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Posts</p>
                <p className="text-2xl font-bold">{summary.total}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Added</p>
                <p className="text-2xl font-bold text-green-600">{summary.added}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Updated</p>
                <p className="text-2xl font-bold text-blue-600">{summary.updated}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Skipped</p>
                <p className="text-2xl font-bold text-muted-foreground">{summary.skipped}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold">Errors occurred during import:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {errors.slice(0, 10).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
                {errors.length > 10 && (
                  <li className="text-muted-foreground">
                    ... and {errors.length - 10} more errors
                  </li>
                )}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
