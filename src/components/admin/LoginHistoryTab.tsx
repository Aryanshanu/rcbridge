import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

interface LoginHistory {
  id: string;
  admin_id: string | null;
  username: string;
  ip_address: string | null;
  user_agent: string | null;
  login_attempt_time: string;
  login_status: 'success' | 'failed' | 'blocked';
  failure_reason: string | null;
  session_token: string | null;
  created_at: string;
}

export function LoginHistoryTab() {
  const [history, setHistory] = useState<LoginHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLoginHistory();
  }, []);

  const fetchLoginHistory = async () => {
    try {
      setIsLoading(true);
      const sessionToken = localStorage.getItem('master_admin_token');
      
      const { data, error } = await supabase.functions.invoke('admin-data', {
        body: { sessionToken, dataType: 'login_history' }
      });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Failed to fetch login history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Admin Login History</h2>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Total: {history.length}
        </Badge>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {history.map((log) => (
            <Card key={log.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {log.login_status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : log.login_status === 'blocked' ? (
                      <XCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-orange-500" />
                    )}
                    {log.username}
                  </CardTitle>
                  <Badge 
                    variant={log.login_status === 'success' ? 'default' : 'destructive'}
                  >
                    {log.login_status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {new Date(log.login_attempt_time).toLocaleString()}
                </div>
                
                {log.ip_address && (
                  <p className="text-muted-foreground">
                    <strong>IP:</strong> {log.ip_address}
                  </p>
                )}
                
                {log.user_agent && (
                  <p className="text-muted-foreground text-xs">
                    <strong>User Agent:</strong> {log.user_agent.substring(0, 80)}...
                  </p>
                )}
                
                {log.failure_reason && (
                  <p className="text-red-500">
                    <strong>Failure Reason:</strong> {log.failure_reason}
                  </p>
                )}
                
                {log.session_token && (
                  <p className="text-green-600 text-xs">
                    <strong>Session Token:</strong> {log.session_token.substring(0, 20)}...
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
