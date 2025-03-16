
import { useState } from "react";
import { ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
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
}

interface PropertiesTableProps {
  properties: Property[];
  onPropertySelect: (property: Property) => void;
}

export const PropertiesTable = ({ properties, onPropertySelect }: PropertiesTableProps) => {
  const [sortField, setSortField] = useState<keyof Property>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate the total number of pages
  const totalPages = Math.ceil(properties.length / itemsPerPage);
  
  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Sort function
  const sortProperties = (a: Property, b: Property) => {
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
    toast.success(`Selected: ${property.title}`);
  };
  
  const SortIndicator = ({ field }: { field: keyof Property }) => {
    if (sortField !== field) return null;
    
    return sortDirection === "asc" 
      ? <ArrowUp className="h-3 w-3 ml-1 inline" /> 
      : <ArrowDown className="h-3 w-3 ml-1 inline" />;
  };
  
  return (
    <div className="w-full">
      <Table>
        <TableCaption>
          List of available properties
        </TableCaption>
        <TableHeader>
          <TableRow>
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
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentProperties.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                No properties found matching your criteria
              </TableCell>
            </TableRow>
          ) : (
            currentProperties.map((property) => (
              <TableRow 
                key={property.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handlePropertyClick(property)}
              >
                <TableCell className="font-medium">{property.title}</TableCell>
                <TableCell>{property.location}</TableCell>
                <TableCell className="text-right">{property.price}</TableCell>
                <TableCell className="text-center">{property.bedrooms || '-'}</TableCell>
                <TableCell className="text-center">{property.bathrooms || '-'}</TableCell>
                <TableCell>{property.area}</TableCell>
                <TableCell>{property.type || 'N/A'}</TableCell>
                <TableCell className="text-right">
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
