import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LogIn, LogOut } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface LoginHistory {
  id: string;
  user_id: string;
  user_email: string;
  action: 'login' | 'logout';
  login_method: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export const LoginHistoryTab = () => {
  const [history, setHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoginHistory();

    const channel = supabase
      .channel('admin_login_history')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'admin_login_history' }, () => {
        fetchLoginHistory();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLoginHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_login_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setHistory((data as LoginHistory[]) || []);
    } catch (error) {
      console.error('Error fetching login history:', error);
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
        <LogIn className="h-6 w-6 mr-3 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Login History</h2>
          <p className="text-muted-foreground">Track all user login and logout events</p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date/Time</TableHead>
            <TableHead>User Email</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>IP Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No login history yet
              </TableCell>
            </TableRow>
          ) : (
            history.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  {format(new Date(entry.created_at), "MMM d, yyyy h:mm a")}
                </TableCell>
                <TableCell className="font-medium">{entry.user_email}</TableCell>
                <TableCell>
                  <Badge variant={entry.action === 'login' ? 'default' : 'secondary'}>
                    {entry.action === 'login' ? (
                      <><LogIn className="h-3 w-3 mr-1" /> Login</>
                    ) : (
                      <><LogOut className="h-3 w-3 mr-1" /> Logout</>
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">{entry.login_method || 'N/A'}</TableCell>
                <TableCell className="font-mono text-sm">{entry.ip_address || 'N/A'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
