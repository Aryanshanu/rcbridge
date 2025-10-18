import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PropertyAlert {
  id: string;
  created_at: string;
  user_id: string | null;
  location: string;
  property_type: string | null;
  listing_type: string | null;
  min_price: number | null;
  max_price: number | null;
  is_active: boolean;
}

export function AlertsTab() {
  const [alerts, setAlerts] = useState<PropertyAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState("");
  const [filterPropertyType, setFilterPropertyType] = useState<string>("all");
  const [filterListingType, setFilterListingType] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchAlerts();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('property_alerts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'property_alerts'
        },
        (payload) => {
          console.log('Property alert change:', payload);
          fetchAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('property_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: "Error",
        description: "Failed to load property alerts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (searchLocation && !alert.location.toLowerCase().includes(searchLocation.toLowerCase())) {
      return false;
    }
    if (filterPropertyType !== "all" && alert.property_type !== filterPropertyType) {
      return false;
    }
    if (filterListingType !== "all" && alert.listing_type !== filterListingType) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Alerts ({filteredAlerts.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Select value={filterPropertyType} onValueChange={setFilterPropertyType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="agricultural">Agricultural</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterListingType} onValueChange={setFilterListingType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Listing Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Listings</SelectItem>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Created</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Property Type</TableHead>
                <TableHead>Listing Type</TableHead>
                <TableHead>Price Range</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No property alerts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="whitespace-nowrap">
                      {new Date(alert.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{alert.location}</TableCell>
                    <TableCell>
                      {alert.property_type ? (
                        <Badge variant="outline" className="capitalize">
                          {alert.property_type}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">Any</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {alert.listing_type ? (
                        <Badge variant="secondary" className="capitalize">
                          {alert.listing_type}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">Any</span>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {alert.min_price || alert.max_price ? (
                        <>
                          {alert.min_price ? `₹${(alert.min_price / 100000).toFixed(1)}L` : 'Any'}
                          {' - '}
                          {alert.max_price ? `₹${(alert.max_price / 100000).toFixed(1)}L` : 'Any'}
                        </>
                      ) : (
                        <span className="text-muted-foreground">Any</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={alert.is_active ? "default" : "secondary"}>
                        {alert.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
