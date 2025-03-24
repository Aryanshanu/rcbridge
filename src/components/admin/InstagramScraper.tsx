
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Instagram, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { scrapeInstagramProperties, storeScrapedProperties } from "@/utils/admin";
import { toast } from "sonner";
import { UserRole } from "@/types/user";

interface InstagramScraperProps {
  userRole: UserRole | null;
}

export const InstagramScraper = ({ userRole }: InstagramScraperProps) => {
  const [instagramProfiles, setInstagramProfiles] = useState("");
  const [maxPosts, setMaxPosts] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const isAuthorized = userRole === "admin" || userRole === "developer";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthorized) {
      toast.error("You don't have permission to run the scraper");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Split and trim Instagram profile names
      const profiles = instagramProfiles
        .split(',')
        .map(profile => profile.trim())
        .filter(profile => profile);
      
      if (profiles.length === 0) {
        setError("Please enter at least one Instagram profile");
        return;
      }
      
      // Scrape Instagram properties
      const scrapeResult = await scrapeInstagramProperties(profiles, maxPosts);
      
      if (!scrapeResult.success) {
        throw new Error(scrapeResult.message || "Failed to scrape properties");
      }
      
      // Store properties in Supabase
      const storeResult = await storeScrapedProperties(scrapeResult.properties);
      
      setResult({
        message: "Properties scraped and stored successfully",
        count: storeResult.count || scrapeResult.properties.length,
        properties: scrapeResult.properties
      });
      
      toast.success("Instagram properties scraped and stored successfully");
    } catch (error: any) {
      console.error("Error in Instagram scraper:", error);
      setError(error.message || "An error occurred while scraping Instagram");
      toast.error("Failed to scrape Instagram properties");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <Alert className="bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Access Restricted</AlertTitle>
        <AlertDescription className="text-amber-700">
          Only Admin and Developer users can access the Instagram property scraper.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Instagram className="mr-2 h-5 w-5 text-pink-500" />
          Instagram Property Scraper
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instagramProfiles">Instagram Profiles (comma-separated)</Label>
            <Input
              id="instagramProfiles"
              value={instagramProfiles}
              onChange={(e) => setInstagramProfiles(e.target.value)}
              placeholder="e.g. realtor1, property_agent2, luxury_homes"
              disabled={isLoading}
              required
            />
            <p className="text-sm text-gray-500">
              Enter the Instagram usernames of property listings you want to scrape.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxPosts">Maximum Posts to Scrape (per profile)</Label>
            <Input
              id="maxPosts"
              type="number"
              value={maxPosts}
              onChange={(e) => setMaxPosts(parseInt(e.target.value))}
              min={1}
              max={100}
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500">
              Limit the number of posts to scrape from each profile.
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {result && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">
                {result.message}. {result.count} properties were scraped and stored.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scraping Properties...
              </>
            ) : (
              "Start Instagram Scraper"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default InstagramScraper;
