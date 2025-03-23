
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  Trash2, 
  Search, 
  Plus, 
  Home, 
  Building, 
  Map, 
  RefreshCcw, 
  ArrowUpDown 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserRole } from "@/types/user";
import { checkTableWithFeedback } from "@/utils/dbTableCheck";

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  property_type: string;
  listing_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  created_at: string;
  status: string;
}

interface AdminPropertiesProps {
  userRole: UserRole | null;
}

export const AdminProperties = ({ userRole }: AdminPropertiesProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [sortField, setSortField] = useState<keyof Property>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Check if table exists
  useEffect(() => {
    checkTableWithFeedback("properties", "Properties table is accessible");
  }, []);

  // Load properties
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from("properties")
          .select("*")
          .order(sortField, { ascending: sortDirection === "asc" });
        
        if (priceRange[0] > 0) {
          query = query.gte("price", priceRange[0]);
        }
        
        if (priceRange[1] < 10000000) {
          query = query.lte("price", priceRange[1]);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setProperties(data as Property[]);
      } catch (error: any) {
        console.error("Error fetching properties:", error);
        toast.error(`Failed to load properties: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, [sortField, sortDirection, priceRange]);
  
  const handleDeleteProperty = async (id: string) => {
    if (userRole !== "admin") {
      toast.error("Only admin users can delete properties");
      return;
    }
    
    if (confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      try {
        const { error } = await supabase
          .from("properties")
          .delete()
          .eq("id", id);
        
        if (error) {
          throw error;
        }
        
        setProperties(properties.filter(property => property.id !== id));
        toast.success("Property deleted successfully");
      } catch (error: any) {
        console.error("Error deleting property:", error);
        toast.error(`Failed to delete property: ${error.message}`);
      }
    }
  };
  
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  const handleSort = (field: keyof Property) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case "residential":
        return <Home size={16} />;
      case "commercial":
        return <Building size={16} />;
      default:
        return <Map size={16} />;
    }
  };
  
  const filteredProperties = properties.filter(property => 
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-auto flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search properties..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <Button onClick={() => null} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Add Property</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("");
              setPriceRange([0, 10000000]);
              setSortField("created_at");
              setSortDirection("desc");
            }}
            className="flex items-center gap-2"
          >
            <RefreshCcw size={16} />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </div>
      
      <div className="mb-6 bg-white p-4 rounded-md border">
        <h3 className="text-sm font-medium mb-3">Price Range Filter</h3>
        <Slider
          value={priceRange}
          min={0}
          max={10000000}
          step={100000}
          onValueChange={setPriceRange}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center p-12">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Map className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No properties found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <Table>
            <TableCaption>
              {filteredProperties.length} properties found
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer w-1/4"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center gap-1">
                    Property
                    {sortField === "title" && (
                      <ArrowUpDown size={14} className={`transition ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("location")}
                >
                  <div className="flex items-center gap-1">
                    Location
                    {sortField === "location" && (
                      <ArrowUpDown size={14} className={`transition ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-right"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Price
                    {sortField === "price" && (
                      <ArrowUpDown size={14} className={`transition ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center gap-1">
                    Added On
                    {sortField === "created_at" && (
                      <ArrowUpDown size={14} className={`transition ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.title}</TableCell>
                  <TableCell>{property.location}</TableCell>
                  <TableCell className="text-right">{formatPrice(property.price)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {getPropertyTypeIcon(property.property_type)}
                      <span className="capitalize text-sm">{property.property_type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(property.created_at)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={property.status === "available" ? "default" : "outline"}
                      className="capitalize"
                    >
                      {property.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setSelectedProperty(property)}
                      >
                        <Edit size={16} />
                      </Button>
                      {userRole === "admin" && (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteProperty(property.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
