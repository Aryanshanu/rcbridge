
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Globe, 
  Building, 
  Home, 
  Clock, 
  Activity,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Instagram
} from "lucide-react";
import { triggerApifyScraper } from "@/utils/admin";
import { UserRole } from "@/types/user";
import { toast } from "sonner";
import { InstagramScraper } from "./InstagramScraper";

interface AdminScraperProps {
  userRole: UserRole | null;
}

export const AdminScraper = ({ userRole }: AdminScraperProps) => {
  const [activeTab, setActiveTab] = useState("residential");
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    residential: false,
    commercial: false,
    rental: false,
    instagram: false
  });
  const [lastRun, setLastRun] = useState<Record<string, string | null>>({
    residential: null,
    commercial: null,
    rental: null,
    instagram: null
  });

  const isAuthorized = userRole === "admin" || userRole === "developer";

  const handleTriggerScraper = async (scraperType: string) => {
    if (!isAuthorized) {
      toast.error("You don't have permission to trigger the scraper");
      return;
    }

    setIsLoading(prev => ({ ...prev, [scraperType]: true }));
    
    try {
      await triggerApifyScraper(scraperType);
      
      setLastRun(prev => ({ 
        ...prev, 
        [scraperType]: new Date().toISOString() 
      }));
      
      toast.success(`${scraperType} scraper triggered successfully`);
    } catch (error) {
      console.error(`Error triggering ${scraperType} scraper:`, error);
    } finally {
      setIsLoading(prev => ({ ...prev, [scraperType]: false }));
    }
  };

  const scraperConfigs = [
    {
      id: "residential",
      title: "Residential Properties",
      description: "Scrape residential properties from major real estate portals",
      icon: <Home className="h-5 w-5 text-blue-500" />,
      sources: ["99acres.com", "magicbricks.com", "housing.com"],
      interval: "Every 12 hours",
      dataPoints: ["Price", "Location", "Bedrooms", "Bathrooms", "Area", "Amenities"]
    },
    {
      id: "commercial",
      title: "Commercial Properties",
      description: "Scrape commercial properties and office spaces",
      icon: <Building className="h-5 w-5 text-indigo-500" />,
      sources: ["commercialpeople.com", "jll.co.in", "squareyards.com"],
      interval: "Every 24 hours",
      dataPoints: ["Price", "Location", "Area", "Floor", "Parking", "Facilities"]
    },
    {
      id: "rental",
      title: "Rental Properties",
      description: "Scrape rental properties from local websites",
      icon: <Globe className="h-5 w-5 text-green-500" />,
      sources: ["nobroker.in", "nestaway.com", "zolo.com"],
      interval: "Every 12 hours",
      dataPoints: ["Rent", "Location", "Deposit", "Furnishing", "Available From"]
    },
    {
      id: "instagram",
      title: "Instagram Properties",
      description: "Scrape property listings from Instagram profiles",
      icon: <Instagram className="h-5 w-5 text-pink-500" />,
      sources: ["Instagram profiles with property listings"],
      interval: "Manual trigger only",
      dataPoints: ["Price", "Property Type", "Location", "Description", "Hashtags"]
    }
  ];

  if (!isAuthorized) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Only Admin and Developer users can access and trigger the data scrapers.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          <Database className="mr-2 h-5 w-5 text-primary" />
          Property Data Scrapers
        </h2>
        <p className="text-gray-600">
          Trigger data scrapers to collect property listings from various sources
        </p>
      </div>
      
      <Tabs defaultValue="residential" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="residential">Residential</TabsTrigger>
          <TabsTrigger value="commercial">Commercial</TabsTrigger>
          <TabsTrigger value="rental">Rental</TabsTrigger>
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
        </TabsList>
        
        {scraperConfigs.map(config => (
          <TabsContent key={config.id} value={config.id}>
            {config.id === "instagram" ? (
              <InstagramScraper userRole={userRole} />
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        {config.icon}
                        <span className="ml-2">{config.title}</span>
                      </CardTitle>
                      <CardDescription>{config.description}</CardDescription>
                    </div>
                    <Button 
                      onClick={() => handleTriggerScraper(config.id)}
                      disabled={isLoading[config.id]}
                    >
                      {isLoading[config.id] ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Running...
                        </>
                      ) : (
                        <>
                          Run Scraper
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Data Sources</h4>
                      <div className="flex flex-wrap gap-2">
                        {config.sources.map(source => (
                          <Badge 
                            key={source} 
                            className="flex items-center bg-blue-50 text-blue-700 border-blue-200"
                          >
                            <Globe className="mr-1 h-3 w-3" />
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Scheduled Interval</h4>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="mr-1 h-4 w-4 text-gray-400" />
                          {config.interval}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Last Run</h4>
                        <div className="flex items-center text-sm text-gray-600">
                          {lastRun[config.id] ? (
                            <>
                              <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                              {new Date(lastRun[config.id]!).toLocaleString()}
                            </>
                          ) : (
                            <>
                              <Activity className="mr-1 h-4 w-4 text-gray-400" />
                              Never run
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Data Points Collected</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {config.dataPoints.map(point => (
                          <div key={point} className="flex items-center text-sm text-gray-600">
                            <CheckCircle2 className="mr-1 h-3 w-3 text-green-500" />
                            {point}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 text-xs text-gray-500">
                  Note: Running the scraper may take several minutes to complete. Results will be automatically imported.
                </CardFooter>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
