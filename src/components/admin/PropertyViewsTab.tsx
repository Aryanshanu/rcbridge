import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Eye } from "lucide-react";
import { format } from "date-fns";

interface PropertyView {
  id: string;
  property_id: string;
  viewer_email: string | null;
  viewer_ip: string | null;
  viewed_at: string;
  properties?: {
    title: string;
    location: string;
  };
}

export const PropertyViewsTab = () => {
  const [views, setViews] = useState<PropertyView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPropertyViews();

    // Subscribe to new views
    const channel = supabase
      .channel('admin_property_views')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'property_views' }, () => {
        fetchPropertyViews();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPropertyViews = async () => {
    try {
      const { data, error } = await supabase
        .from('property_views')
        .select('*, properties(title, location)')
        .order('viewed_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setViews(data || []);
    } catch (error) {
      console.error('Error fetching property views:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center mb-6">
        <Eye className="h-6 w-6 mr-3 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Property Views</h2>
          <p className="text-muted-foreground">Track which properties users are viewing</p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date/Time</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Viewer Email</TableHead>
            <TableHead>IP Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {views.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No property views yet
              </TableCell>
            </TableRow>
          ) : (
            views.map((view) => (
              <TableRow key={view.id}>
                <TableCell>
                  {format(new Date(view.viewed_at), "MMM d, yyyy h:mm a")}
                </TableCell>
                <TableCell className="font-medium">
                  {view.properties?.title || 'Unknown Property'}
                </TableCell>
                <TableCell>{view.properties?.location || 'N/A'}</TableCell>
                <TableCell>{view.viewer_email || 'Anonymous'}</TableCell>
                <TableCell className="font-mono text-sm">{view.viewer_ip || 'N/A'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
