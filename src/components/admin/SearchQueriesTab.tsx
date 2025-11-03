import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search } from "lucide-react";
import { format } from "date-fns";

interface SearchQuery {
  id: string;
  user_id: string | null;
  query: string;
  location: string | null;
  property_type: string | null;
  price_range: any;
  created_at: string;
}

export const SearchQueriesTab = () => {
  const [queries, setQueries] = useState<SearchQuery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSearchQueries();

    // Subscribe to new searches
    const channel = supabase
      .channel('admin_search_queries')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'search_queries' }, () => {
        fetchSearchQueries();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSearchQueries = async () => {
    try {
      const { data, error } = await supabase
        .from('search_queries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setQueries(data || []);
    } catch (error) {
      console.error('Error fetching search queries:', error);
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
        <Search className="h-6 w-6 mr-3 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Search Queries</h2>
          <p className="text-muted-foreground">All property searches performed by users</p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date/Time</TableHead>
            <TableHead>Query</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Property Type</TableHead>
            <TableHead>Price Range</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No search queries yet
              </TableCell>
            </TableRow>
          ) : (
            queries.map((query) => (
              <TableRow key={query.id}>
                <TableCell>
                  {format(new Date(query.created_at), "MMM d, yyyy h:mm a")}
                </TableCell>
                <TableCell className="font-medium">{query.query || 'N/A'}</TableCell>
                <TableCell>{query.location || 'Any'}</TableCell>
                <TableCell className="capitalize">{query.property_type || 'Any'}</TableCell>
                <TableCell>
                  {query.price_range ? 
                    `₹${query.price_range.min?.toLocaleString() || '0'} - ₹${query.price_range.max?.toLocaleString() || '∞'}` 
                    : 'Any'
                  }
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
