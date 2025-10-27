import { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
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
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatArea, capitalizeWords } from "@/utils/propertyUtils";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number;
  description: string;
  property_type?: string;
  listing_type?: string;
  created_at?: string;
}

interface PropertiesTableProps {
  properties: Property[];
  onPropertySelect: (property: Property) => void;
}

export const PropertiesTable = ({ properties, onPropertySelect }: PropertiesTableProps) => {
  const [sortField, setSortField] = useState<keyof Property>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const isMobile = useIsMobile();

  const sortProperties = (a: Property, b: Property) => {
    if (sortField === "price" || sortField === "area") {
      const valA = Number(a[sortField]) || 0;
      const valB = Number(b[sortField]) || 0;
      return sortDirection === "asc" ? valA - valB : valB - valA;
    }
    
    if (sortField === "created_at") {
      const dateA = new Date(a.created_at || "").getTime();
      const dateB = new Date(b.created_at || "").getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
    
    let fieldA = a[sortField];
    let fieldB = b[sortField];
    
    if (fieldA === null) fieldA = "";
    if (fieldB === null) fieldB = "";
    
    const strA = String(fieldA).toLowerCase();
    const strB = String(fieldB).toLowerCase();
    
    return sortDirection === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
  };
  
  const sortedProperties = [...properties].sort(sortProperties);
  
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
    toast.success(`Viewing: ${property.title}`);
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
          <div className="text-sm font-medium text-muted-foreground">
            {properties.length} properties found
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 flex-nowrap">
          <Button 
            variant="outline" 
            size="sm" 
            className={sortField === "title" ? "bg-muted" : ""}
            onClick={() => handleSort("title")}
          >
            Name {sortField === "title" && (sortDirection === "asc" ? "↑" : "↓")}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={sortField === "price" ? "bg-muted" : ""}
            onClick={() => handleSort("price")}
          >
            Price {sortField === "price" && (sortDirection === "asc" ? "↑" : "↓")}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={sortField === "created_at" ? "bg-muted" : ""}
            onClick={() => handleSort("created_at")}
          >
            Newest {sortField === "created_at" && (sortDirection === "asc" ? "↑" : "↓")}
          </Button>
        </div>
        
        <div className="space-y-3">
          {sortedProperties.length === 0 ? (
            <div className="text-center py-8 bg-muted rounded-lg">
              No properties found matching your criteria
            </div>
          ) : (
            sortedProperties.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border rounded-lg p-3 bg-card hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handlePropertyClick(property)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{property.title}</h3>
                  <div className="text-right text-primary font-bold">{formatPrice(property.price)}</div>
                </div>
                
                <div className="text-sm text-muted-foreground mb-2">{property.location}</div>
                
                <div className="flex justify-between mb-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {capitalizeWords(property.property_type || 'residential')}
                    </Badge>
                    {property.bedrooms && (
                      <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                    )}
                    {property.bathrooms && (
                      <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
                    )}
                  </div>
                  <span>{formatArea(property.area)}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    );
  }
  
  // Desktop view
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium text-muted-foreground">
          {properties.length} properties found
        </div>
      </div>
      
      <Table>
        <TableCaption>
          List of available properties
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-muted" 
              onClick={() => handleSort("title")}
            >
              Property <SortIndicator field="title" />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted" 
              onClick={() => handleSort("location")}
            >
              Location <SortIndicator field="location" />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted text-right" 
              onClick={() => handleSort("price")}
            >
              Price <SortIndicator field="price" />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted text-center" 
              onClick={() => handleSort("bedrooms")}
            >
              Beds <SortIndicator field="bedrooms" />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted text-center" 
              onClick={() => handleSort("bathrooms")}
            >
              Baths <SortIndicator field="bathrooms" />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted" 
              onClick={() => handleSort("area")}
            >
              Area <SortIndicator field="area" />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted" 
              onClick={() => handleSort("property_type")}
            >
              Type <SortIndicator field="property_type" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProperties.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No properties found matching your criteria
              </TableCell>
            </TableRow>
          ) : (
            sortedProperties.map((property) => (
              <TableRow 
                key={property.id} 
                className="hover:bg-muted cursor-pointer transition-colors duration-200"
                onClick={() => handlePropertyClick(property)}
              >
                <TableCell className="font-medium">{property.title}</TableCell>
                <TableCell>{property.location}</TableCell>
                <TableCell className="text-right font-semibold text-primary">
                  {formatPrice(property.price)}
                </TableCell>
                <TableCell className="text-center">
                  {property.bedrooms || '-'}
                </TableCell>
                <TableCell className="text-center">
                  {property.bathrooms || '-'}
                </TableCell>
                <TableCell>{formatArea(property.area)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {capitalizeWords(property.property_type || 'residential')}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
