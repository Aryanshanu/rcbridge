
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/SEO";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home, Bell, BellOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const SavedSearches = () => {
  const { toast } = useToast();
  
  // Mock data for saved searches
  const [savedSearches, setSavedSearches] = useState([
    {
      id: "search1",
      name: "3BHK in Gachibowli",
      criteria: {
        propertyType: "Residential",
        location: "Gachibowli, Hyderabad",
        bedrooms: "3",
        minPrice: "₹80L",
        maxPrice: "₹1.2Cr"
      },
      notifications: true,
      createdAt: "2023-07-10"
    },
    {
      id: "search2",
      name: "Office Space HITEC City",
      criteria: {
        propertyType: "Commercial",
        location: "HITEC City, Hyderabad",
        area: "1000-3000 sq.ft",
        minPrice: "₹1.5Cr",
        maxPrice: "₹3Cr"
      },
      notifications: false,
      createdAt: "2023-08-05"
    },
    {
      id: "search3",
      name: "Agricultural Land",
      criteria: {
        propertyType: "Agricultural",
        location: "Outer Hyderabad",
        area: "5+ acres",
        minPrice: "₹50L",
        maxPrice: "₹2Cr"
      },
      notifications: true,
      createdAt: "2023-09-15"
    }
  ]);

  const toggleNotifications = (searchId: string) => {
    setSavedSearches(prevSearches => 
      prevSearches.map(search => 
        search.id === searchId 
          ? { ...search, notifications: !search.notifications } 
          : search
      )
    );
    
    const search = savedSearches.find(s => s.id === searchId);
    const newStatus = !search?.notifications;
    
    toast({
      title: newStatus ? "Notifications Enabled" : "Notifications Disabled",
      description: newStatus 
        ? "You will receive alerts for this saved search." 
        : "You will no longer receive alerts for this saved search.",
    });
  };

  const deleteSearch = (searchId: string) => {
    setSavedSearches(prevSearches => prevSearches.filter(search => search.id !== searchId));
    
    toast({
      title: "Search Deleted",
      description: "Your saved search has been deleted successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="Saved Searches | RC Bridge" description="Manage your saved property searches" />
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4 mr-1" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Saved Searches</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Searches</h1>
            <p className="text-gray-600">
              Manage your saved property searches and notifications
            </p>
          </div>
          <Button className="mt-4 sm:mt-0">
            New Property Search
          </Button>
        </div>
        
        <div className="space-y-6">
          {savedSearches.length > 0 ? (
            savedSearches.map((search) => (
              <div key={search.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{search.name}</h2>
                      <p className="text-sm text-gray-500">Created on {new Date(search.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                      <div className="flex items-center space-x-2">
                        {search.notifications ? (
                          <Bell className="h-5 w-5 text-primary" />
                        ) : (
                          <BellOff className="h-5 w-5 text-gray-400" />
                        )}
                        <Switch 
                          checked={search.notifications} 
                          onCheckedChange={() => toggleNotifications(search.id)}
                          id={`notifications-${search.id}`}
                        />
                        <label 
                          htmlFor={`notifications-${search.id}`} 
                          className="text-sm font-medium cursor-pointer"
                        >
                          {search.notifications ? "Alerts On" : "Alerts Off"}
                        </label>
                      </div>
                      <button
                        onClick={() => deleteSearch(search.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Search Criteria</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(search.criteria).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="font-medium text-gray-700">
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                          </span>{" "}
                          <span className="text-gray-600">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-4">
                    <Button variant="outline" size="sm">Edit Search</Button>
                    <Button size="sm">View Matching Properties</Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">No Saved Searches</h2>
              <p className="text-gray-600 mb-4">You haven't saved any property searches yet.</p>
              <Button>Create Your First Search</Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SavedSearches;
