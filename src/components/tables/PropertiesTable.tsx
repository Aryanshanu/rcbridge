import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Eye, Zap, Calendar, GitCompare, Map } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: string;
  description: string;
  type?: string;
  views?: number;
  createdAt?: string;
  popularity?: number;
}

interface PropertiesTableProps {
  properties: Property[];
  onPropertySelect: (property: Property) => void;
}

export const PropertiesTable = ({ properties, onPropertySelect }: PropertiesTableProps) => {
  const [sortField, setSortField] = useState<keyof Property>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [viewsData, setViewsData] = useState<Record<string, number>>({});
  const isMobile = useIsMobile();
  const itemsPerPage = 10;

  // Calculate the total number of pages
  const totalPages = Math.ceil(properties.length / itemsPerPage);
  
  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Initialize view tracking data
  useEffect(() => {
    // Simulating loading view data from localStorage or a database
    const storedViewsData = localStorage.getItem('propertyViews');
    if (storedViewsData) {
      setViewsData(JSON.parse(storedViewsData));
    } else {
      // Initialize with random views if no data exists
      const initialViewsData: Record<string, number> = {};
      properties.forEach(property => {
        initialViewsData[property.id] = Math.floor(Math.random() * 100);
      });
      setViewsData(initialViewsData);
      localStorage.setItem('propertyViews', JSON.stringify(initialViewsData));
    }
  }, [properties]);

  // Track property views when selected
  const trackPropertyView = (propertyId: string) => {
    const updatedViews = { ...viewsData };
    updatedViews[propertyId] = (updatedViews[propertyId] || 0) + 1;
    setViewsData(updatedViews);
    localStorage.setItem('propertyViews', JSON.stringify(updatedViews));
  };
  
  // Enhanced sort function with additional fields
  const sortProperties = (a: Property, b: Property) => {
    // Handle special sort fields
    if (sortField === "views") {
      const viewsA = viewsData[a.id] || 0;
      const viewsB = viewsData[b.id] || 0;
      return sortDirection === "asc" ? viewsA - viewsB : viewsB - viewsA;
    }
    
    if (sortField === "popularity") {
      const popA = a.popularity || 0;
      const popB = b.popularity || 0;
      return sortDirection === "asc" ? popA - popB : popB - popA;
    }
    
    if (sortField === "createdAt") {
      const dateA = new Date(a.createdAt || "").getTime();
      const dateB = new Date(b.createdAt || "").getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
    
    // Default sorting logic for other fields
    let fieldA = a[sortField];
    let fieldB = b[sortField];
    
    // Handle null values
    if (fieldA === null) fieldA = "";
    if (fieldB === null) fieldB = "";
    
    // Convert to string for comparison
    const strA = String(fieldA).toLowerCase();
    const strB = String(fieldB).toLowerCase();
    
    if (sortDirection === "asc") {
      return strA.localeCompare(strB);
    } else {
      return strB.localeCompare(strA);
    }
  };
  
  // Sort and paginate the data
  const sortedProperties = [...properties].sort(sortProperties);
  const currentProperties = sortedProperties.slice(indexOfFirstItem, indexOfLastItem);
  
  const handleSort = (field: keyof Property) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const handlePropertyClick = (property: Property) => {
    onPropertySelect(property);
    trackPropertyView(property.id);
    toast.success(`Selected: ${property.title}`);
  };
  
  const togglePropertySelection = (e: React.MouseEvent, property: Property) => {
    e.stopPropagation();
    
    setSelectedProperties(prev => {
      const isSelected = prev.includes(property.id);
      if (isSelected) {
        toast.info(`Removed ${property.title} from comparison`);
        return prev.filter(id => id !== property.id);
      } else {
        if (prev.length >= 3) {
          toast.error("You can compare up to 3 properties at once");
          return prev;
        }
        toast.success(`Added ${property.title} to comparison`);
        return [...prev, property.id];
      }
    });
  };
  
  const compareProperties = () => {
    if (selectedProperties.length < 2) {
      toast.error("Please select at least 2 properties to compare");
      return;
    }
    
    const selectedPropsData = properties.filter(p => selectedProperties.includes(p.id));
    // Here you would normally navigate to a comparison page
    // For now, we'll just show a toast with the properties
    toast.success(`Comparing ${selectedProperties.length} properties`, {
      description: selectedPropsData.map(p => p.title).join(", "),
      duration: 5000,
    });
  };
  
  const viewMapForProperty = (e: React.MouseEvent, property: Property) => {
    e.stopPropagation();
    toast.success(`Viewing map for ${property.title}`, {
      description: `Location: ${property.location}`,
      duration: 3000,
    });
    // Here you would normally open a map view dialog
  };
  
  const SortIndicator = ({ field }: { field: keyof Property }) => {
    if (sortField !== field) return null;
    
    return sortDirection === "asc" 
      ? <ArrowUp className="h-3 w-3 ml-1 inline" /> 
      : <ArrowDown className="h-3 w-3 ml-1 inline" />;
  };
  
  // Render mobile view
  if (isMobile) {
    return (
      <div className="w-full space-y-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium text-gray-500">
            {properties.length} properties found
          </div>
          
          <div className="flex space-x-2">
            {selectedProperties.length > 0 && (
              <Button 
                size="sm" 
                onClick={compareProperties}
                className="flex items-center gap-1"
              >
                <GitCompare className="h-4 w-4" />
                Compare ({selectedProperties.length})
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 flex-nowrap">
          <Button 
            variant="outline" 
            size="sm" 
            className={sortField === "title" ? "bg-gray-100" : ""}
            onClick={() => handleSort("title")}
          >
            Name {sortField === "title" && (sortDirection === "asc" ? "↑" : "↓")}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={sortField === "price" ? "bg-gray-100" : ""}
            onClick={() => handleSort("price")}
          >
            Price {sortField === "price" && (sortDirection === "asc" ? "↑" : "↓")}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={sortField === "views" ? "bg-gray-100" : ""}
            onClick={() => handleSort("views")}
          >
            Views {sortField === "views" && (sortDirection === "asc" ? "↑" : "↓")}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={sortField === "createdAt" ? "bg-gray-100" : ""}
            onClick={() => handleSort("createdAt")}
          >
            Newest {sortField === "createdAt" && (sortDirection === "asc" ? "↑" : "↓")}
          </Button>
        </div>
        
        <div className="space-y-3">
          {currentProperties.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              No properties found matching your criteria
            </div>
          ) : (
            currentProperties.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`border rounded-lg p-3 bg-white ${
                  selectedProperties.includes(property.id) ? "border-primary ring-1 ring-primary" : ""
                }`}
                onClick={() => handlePropertyClick(property)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{property.title}</h3>
                  <div className="text-right text-primary font-bold">{property.price}</div>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">{property.location}</div>
                
                <div className="flex justify-between mb-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {property.type || 'Residential'}
                    </Badge>
                    {property.bedrooms && (
                      <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                    )}
                    {property.bathrooms && (
                      <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
                    )}
                  </div>
                  <span>{property.area}</span>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {viewsData[property.id] || 0} views
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={(e) => viewMapForProperty(e, property)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <Map className="h-3 w-3" /> Map
                    </button>
                    <button 
                      onClick={(e) => togglePropertySelection(e, property)}
                      className={`flex items-center gap-1 ${
                        selectedProperties.includes(property.id) 
                          ? "text-primary" 
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      <GitCompare className="h-3 w-3" /> 
                      {selectedProperties.includes(property.id) ? "Selected" : "Compare"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
        
        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              <PaginationItem>
                <span className="px-4">{currentPage} / {totalPages}</span>
              </PaginationItem>
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    );
  }
  
  // Desktop view
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium text-gray-500">
          {properties.length} properties found
        </div>
        
        <div className="flex space-x-2">
          {selectedProperties.length > 0 && (
            <Button 
              onClick={compareProperties}
              className="flex items-center gap-1"
              variant="outline"
            >
              <GitCompare className="h-4 w-4" />
              Compare Selected ({selectedProperties.length})
            </Button>
          )}
        </div>
      </div>
      
      <Table>
        <TableCaption>
          List of available properties
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50 w-10" 
            >
              Select
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50" 
              onClick={() => handleSort("title")}
            >
              Property <SortIndicator field="title" />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50" 
              onClick={() => handleSort("location")}
            >
              Location <SortIndicator field="location" />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50 text-right" 
              onClick={() => handleSort("price")}
            >
              Price <SortIndicator field="price" />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50 text-center" 
              onClick={() => handleSort("bedrooms")}
            >
              Beds <SortIndicator field="bedrooms" />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50 text-center" 
              onClick={() => handleSort("bathrooms")}
            >
              Baths <SortIndicator field="bathrooms" />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50" 
              onClick={() => handleSort("area")}
            >
              Area <SortIndicator field="area" />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50" 
              onClick={() => handleSort("type")}
            >
              Type <SortIndicator field="type" />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50 text-center" 
              onClick={() => handleSort("views")}
            >
              <div className="flex items-center justify-center">
                <Eye className="h-4 w-4 mr-1" />
                Views <SortIndicator field="views" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50 text-center"
              onClick={() => handleSort("createdAt")}
            >
              <div className="flex items-center justify-center">
                <Calendar className="h-4 w-4 mr-1" />
                Listed <SortIndicator field="createdAt" />
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentProperties.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-8">
                No properties found matching your criteria
              </TableCell>
            </TableRow>
          ) : (
            currentProperties.map((property) => (
              <TableRow 
                key={property.id} 
                className={`hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                  selectedProperties.includes(property.id) ? "bg-blue-50" : ""
                }`}
                onClick={() => handlePropertyClick(property)}
              >
                <TableCell>
                  <button
                    onClick={(e) => togglePropertySelection(e, property)}
                    className={`w-5 h-5 rounded-sm border ${
                      selectedProperties.includes(property.id) 
                        ? "bg-primary border-primary text-white" 
                        : "border-gray-300"
                    } flex items-center justify-center`}
                  >
                    {selectedProperties.includes(property.id) && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </TableCell>
                <TableCell className="font-medium">{property.title}</TableCell>
                <TableCell>{property.location}</TableCell>
                <TableCell className="text-right">{property.price}</TableCell>
                <TableCell className="text-center">{property.bedrooms || '-'}</TableCell>
                <TableCell className="text-center">{property.bathrooms || '-'}</TableCell>
                <TableCell>{property.area}</TableCell>
                <TableCell>{property.type || 'N/A'}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {viewsData[property.id] || 0}
                    {(viewsData[property.id] || 0) > 50 && (
                      <Zap className="h-3 w-3 text-amber-500" aria-label="Popular property" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {property.createdAt 
                    ? new Date(property.createdAt).toLocaleDateString() 
                    : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        viewMapForProperty(e, property);
                      }}
                    >
                      <Map className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePropertyClick(property);
                      }}
                    >
                      Details
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
              // Display pages around the current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = index + 1;
              } else if (currentPage <= 3) {
                pageNum = index + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + index;
              } else {
                pageNum = currentPage - 2 + index;
              }
              
              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <PaginationItem key={`page-${pageNum}`}>
                    <PaginationLink
                      isActive={pageNum === currentPage}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return null;
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
