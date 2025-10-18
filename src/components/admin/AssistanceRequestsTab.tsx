import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Phone, User, Building2, DollarSign, FileText, Loader2, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useMasterAdmin } from "@/contexts/MasterAdminContext";

interface AssistanceRequest {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  requirement: string;
  property_type: string;
  budget: string;
  status: string;
}

export function AssistanceRequestsTab() {
  const { sessionToken } = useMasterAdmin();
  const [requests, setRequests] = useState<AssistanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-data', {
        body: { sessionToken, dataType: 'assistance' }
      });

      if (error) throw error;
      if (data?.success) {
        setRequests(data.data.requests || []);
      }
    } catch (error) {
      console.error('Error fetching assistance requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Assistance Requests</h2>
        <Badge variant="secondary">{requests.length} Total</Badge>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{req.name}</CardTitle>
                    <CardDescription>
                      {format(new Date(req.created_at), 'PPpp')}
                    </CardDescription>
                  </div>
                  <Badge variant={req.status === 'pending' ? 'default' : 'secondary'}>
                    {req.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{req.email}</span>
                  </div>
                  {req.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{req.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span>{req.property_type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{req.budget}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm font-medium mb-1">Requirements:</p>
                  <p className="text-sm text-muted-foreground">{req.requirement}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
