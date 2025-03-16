
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { TextPropertyCard } from "@/components/TextPropertyCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Search, Filter, ArrowUpDown, Loader2, Home } from "lucide-react";
import { SEO } from "@/components/SEO";
import { NotificationButton } from "@/components/ui/NotificationButton";
import { ChatBot } from "@/components/ChatBot";

const Properties = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [listingType, setListingType] = useState("all");
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | "">("");
  
  const { toast } = useToast();
  
  useEffect(() => {
    document.title = "All Properties | Real Estate";
    
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          console.log("Fetched all properties:", data);
          
          // Format the properties for display
          const formattedProperties = data.map(property => ({
            id: property.id,
            title: property.title,
            location: property.location,
            price: formatPrice(property.price, property.listing_type),
            numericPrice: property.price, // Keep original price for sorting
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area: `${property.area} sq.ft`,
            description: property.description,
            propertyType: property.property_type,
            listingType: property.listing_type
          }));
          
          setProperties(formattedProperties);
          setFilteredProperties(formattedProperties);
        } else {
          console.log("No properties found");
          setProperties([]);
          setFilteredProperties([]);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast({
          title: "Error",
          description: "Failed to load properties. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, [toast]);
  
  useEffect(() => {
    // Apply filters whenever filter criteria change
    let results = [...properties];
    
    // Filter by search term (title or location)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(property => 
        property.title.toLowerCase().includes(term) || 
        property.location.toLowerCase().includes(term)
      );
    }
    
    // Filter by property type
    if (propertyType !== "all") {
      results = results.filter(property => property.propertyType === propertyType);
    }
    
    // Filter by listing type
    if (listingType !== "all") {
      results = results.filter(property => property.listingType === listingType);
    }
    
    // Apply price sorting
    if (priceSort) {
      results.sort((a, b) => {
        const priceA = a.numericPrice;
        const priceB = b.numericPrice;
        return priceSort === "asc" ? priceA - priceB : priceB - priceA;
      });
    }
    
    setFilteredProperties(results);
  }, [searchTerm, propertyType, listingType, priceSort, properties]);
  
  const formatPrice = (price: number, listingType: string) => {
    if (listingType === 'rent') {
      return `₹${price.toLocaleString('en-IN')}/month`;
    }
    
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(0)}L`;
    } else {
      return `₹${price.toLocaleString('en-IN')}`;
    }
  };
  
  const handleSortToggle = () => {
    setPriceSort(priceSort === "" ? "desc" : priceSort === "desc" ? "asc" : "");
  };
  
  const resetFilters = () => {
    setSearchTerm("");
    setPropertyType("all");
    setListingType("all");
    setPriceSort("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="All Properties | Real Estate"
        description="Browse our complete collection of properties across Hyderabad"
      />
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-center justify-center mb-8">
          <Building className="h-7 w-7 text-[#1e40af] mr-3" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">All Properties</h1>
        </div>
        
        {/* Filters Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                type="text"
                placeholder="Search by title or location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Property Type */}
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Property Types</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="agricultural">Agricultural</SelectItem>
                <SelectItem value="undeveloped">Undeveloped</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Listing Type */}
            <Select value={listingType} onValueChange={setListingType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Listing Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Listing Types</SelectItem>
                <SelectItem value="sale">For Sale</SelectItem>
                <SelectItem value="rent">For Rent</SelectItem>
                <SelectItem value="development_partnership">Development</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Price Sort + Reset */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 flex items-center justify-center"
                onClick={handleSortToggle}
              >
                <ArrowUpDown className={`h-4 w-4 mr-2 ${priceSort ? "text-[#1e40af]" : "text-gray-400"}`} />
                Price {priceSort === "asc" ? "↑" : priceSort === "desc" ? "↓" : ""}
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-center"
                onClick={resetFilters}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Properties Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#1e40af]" />
            <span className="ml-2 text-lg text-gray-600">Loading properties...</span>
          </div>
        ) : filteredProperties.length > 0 ? (
          <>
            <div className="mb-4 text-gray-600">
              Showing {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <TextPropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <Home className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">No properties match your current filter criteria.</p>
            <Button onClick={resetFilters}>Clear Filters</Button>
          </div>
        )}
      </main>

      {/* Fixed position components */}
      <div className="fixed bottom-6 right-6 z-50">
        <NotificationButton />
      </div>
      <div className="fixed bottom-6 right-20 z-50">
        <ChatBot />
      </div>
      <Footer />
    </div>
  );
};

export default Properties;
