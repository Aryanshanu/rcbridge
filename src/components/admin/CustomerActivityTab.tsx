import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Activity, Mail, MessageSquare, Search, User } from "lucide-react";

interface CustomerActivity {
  id: string;
  customer_id: string | null;
  customer_email: string | null;
  customer_name: string | null;
  activity_type: string;
  activity_details: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
  created_at: string;
}

export function CustomerActivityTab() {
  const [activities, setActivities] = useState<CustomerActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCustomerActivity();

    // Subscribe to real-time customer activity inserts
    const channel = supabase
      .channel('customer-activity-realtime')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'customer_activity_history' },
        (payload) => {
          console.log('👤 New customer activity recorded:', payload.new);
          setActivities(prev => [payload.new as CustomerActivity, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCustomerActivity = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No session token');
      }

      const { data, error } = await supabase.functions.invoke('admin-data', {
        body: { dataType: 'customer_activity' },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;
      setActivities(data?.data || []);
    } catch (error) {
      console.error('Failed to fetch customer activity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contact_form': return <Mail className="h-5 w-5" />;
      case 'assistance_request': return <User className="h-5 w-5" />;
      case 'chat_conversation': return <MessageSquare className="h-5 w-5" />;
      case 'search_query': return <Search className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'contact_form': return 'bg-blue-500';
      case 'assistance_request': return 'bg-green-500';
      case 'chat_conversation': return 'bg-purple-500';
      case 'search_query': return 'bg-orange-500';
      default: return 'bg-gray-500';
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
        <h2 className="text-2xl font-bold">Customer Activity History</h2>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Total: {activities.length}
        </Badge>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {activities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className={`p-2 rounded-full ${getActivityColor(activity.activity_type)} text-white`}>
                      {getActivityIcon(activity.activity_type)}
                    </div>
                    {activity.customer_name || activity.customer_email || 'Anonymous'}
                  </CardTitle>
                  <Badge variant="secondary">
                    {activity.activity_type.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  {new Date(activity.created_at).toLocaleString()}
                </p>
                
                {activity.customer_email && (
                  <p className="text-muted-foreground">
                    <strong>Email:</strong> {activity.customer_email}
                  </p>
                )}
                
                {activity.ip_address && (
                  <p className="text-muted-foreground">
                    <strong>IP:</strong> {activity.ip_address}
                  </p>
                )}
                
                {activity.referrer && activity.referrer !== 'direct' && (
                  <p className="text-muted-foreground text-xs">
                    <strong>Referrer:</strong> {activity.referrer}
                  </p>
                )}
                
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <strong>Activity Details:</strong>
                  <pre className="text-xs mt-1 overflow-auto max-h-32">
                    {JSON.stringify(activity.activity_details, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
