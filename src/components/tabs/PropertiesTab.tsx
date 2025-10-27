import { useState, useEffect } from "react";
import { AdvancedSearch } from "@/components/AdvancedSearch";
import { PropertyGrid } from "@/components/PropertyGrid";
import { PropertiesTable } from "@/components/tables/PropertiesTable";
import { PropertyDetailDialog } from "@/components/PropertyDetailDialog";
import { Filter, ChevronDown, ChevronUp, LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Toggle } from "@/components/ui/toggle";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface PropertiesTabProps {
  selectedPropertyId?: string;
  filters?: Record<string, any>;
  viewMode?: "grid" | "table";
  isDarkMode?: boolean;
}

export const PropertiesTab = ({ 
  selectedPropertyId, 
  filters = {}, 
  viewMode: initialViewMode = "grid", 
  isDarkMode = false 
}: PropertiesTabProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [propertyImages, setPropertyImages] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">(initialViewMode);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 12;
  
  const { toast } = useToast();

  // Fetch properties from Supabase
  useEffect(() => {
    fetchProperties();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('properties-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties'
        },
        () => {
          fetchProperties();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filters, currentPage]);

  // Scroll to selected property
  useEffect(() => {
    if (selectedPropertyId && properties.length > 0) {
      const property = properties.find(p => p.id === selectedPropertyId);
      if (property) {
        setSelectedProperty(property);
      }
    }
  }, [selectedPropertyId, properties]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .eq('status', 'available');

      // Apply filters
      if (filters.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%,location.ilike.%${filters.searchQuery}%`);
      }

      if (filters.location && filters.location !== 'hyderabad') {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters.type) {
        const typeMap: Record<string, string> = {
          'apartment': 'residential',
          'villa': 'luxury',
          'plot': 'undeveloped',
        };
        query = query.eq('property_type', typeMap[filters.type] || filters.type);
      }

      if (filters.property_type) {
        query = query.eq('property_type', filters.property_type);
      }

      if (filters.listing_type) {
        query = query.eq('listing_type', filters.listing_type);
      }

      if (filters.min_price) {
        query = query.gte('price', filters.min_price);
      }

      if (filters.max_price) {
        query = query.lte('price', filters.max_price);
      }

      if (filters.bedrooms) {
        const bedroomValue = filters.bedrooms === '3+' ? 3 : parseInt(filters.bedrooms);
        query = query.gte('bedrooms', bedroomValue);
      }

      if (filters.min_bedrooms) {
        query = query.gte('bedrooms', filters.min_bedrooms);
      }

      if (filters.bathrooms) {
        query = query.gte('bathrooms', parseInt(filters.bathrooms));
      }

      if (filters.min_area) {
        query = query.gte('area', filters.min_area);
      }

      if (filters.max_area) {
        query = query.lte('area', filters.max_area);
      }

      // Pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      // Sort by created_at descending
      query = query.order('created_at', { ascending: false });

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      setProperties(data || []);
      setTotalCount(count || 0);

      // Fetch images for all properties
      if (data && data.length > 0) {
        await fetchPropertyImages(data.map(p => p.id));
      }
    } catch (err: any) {
      console.error('Error fetching properties:', err);
      setError(err.message || 'Failed to load properties');
      toast({
        title: "Error",
        description: "Failed to load properties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertyImages = async (propertyIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('property_images')
        .select('property_id, url, is_primary')
        .in('property_id', propertyIds)
        .order('is_primary', { ascending: false });

      if (error) throw error;

      const imageMap: Record<string, string[]> = {};
      data?.forEach(img => {
        if (!imageMap[img.property_id]) {
          imageMap[img.property_id] = [];
        }
        imageMap[img.property_id].push(img.url);
      });

      setPropertyImages(imageMap);
    } catch (err) {
      console.error('Error fetching property images:', err);
    }
  };

  const handlePropertySelect = (property: any) => {
    setSelectedProperty(property);
  };

  const handleFilterChange = (newFilters: Record<string, any>) => {
    // Parent component will update filters prop
    setCurrentPage(1); // Reset to first page when filters change
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-4"
            onClick={fetchProperties}
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {totalCount} {totalCount === 1 ? 'property' : 'properties'} found
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Toggle
            pressed={viewMode === "grid"}
            onPressedChange={() => setViewMode("grid")}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={viewMode === "table"}
            onPressedChange={() => setViewMode("table")}
            aria-label="Table view"
          >
            <LayoutList className="h-4 w-4" />
          </Toggle>
        </div>
      </div>

      {showFilters && (
        <div className="bg-muted/50 rounded-lg p-6">
          <AdvancedSearch onFilterChange={handleFilterChange} />
        </div>
      )}

      {properties.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground mb-4">No properties found matching your criteria</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Clear Filters
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <PropertyGrid 
          properties={properties.map(p => ({
            ...p,
            image_url: propertyImages[p.id]?.[0]
          }))}
          loading={loading}
        />
      ) : (
        <PropertiesTable 
          properties={properties}
          onPropertySelect={handlePropertySelect}
        />
      )}

      {totalCount > itemsPerPage && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {Math.ceil(totalCount / itemsPerPage)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= Math.ceil(totalCount / itemsPerPage)}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <PropertyDetailDialog
        property={selectedProperty}
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        images={selectedProperty ? (propertyImages[selectedProperty.id] || []) : []}
      />
    </div>
  );
};
