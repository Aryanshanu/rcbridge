import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, MessageSquare, Home, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMasterAdmin } from "@/contexts/MasterAdminContext";

interface Analytics {
  totalUsers: number;
  activeConversations: number;
  totalProperties: number;
  contactMessages: number;
  assistanceRequests: number;
}

export function AnalyticsTab() {
  const { sessionToken } = useMasterAdmin();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-data', {
        body: { sessionToken, dataType: 'analytics' }
      });

      if (error) throw error;
      if (data?.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
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

  const stats = [
    {
      title: "Total Users",
      value: analytics?.totalUsers || 0,
      icon: Users,
      description: "Registered users on the platform",
    },
    {
      title: "Active Conversations",
      value: analytics?.activeConversations || 0,
      icon: MessageSquare,
      description: "Chat conversations created",
    },
    {
      title: "Properties Listed",
      value: analytics?.totalProperties || 0,
      icon: Home,
      description: "Total properties in database",
    },
    {
      title: "Contact Messages",
      value: analytics?.contactMessages || 0,
      icon: TrendingUp,
      description: "Messages received via contact form",
    },
    {
      title: "Assistance Requests",
      value: analytics?.assistanceRequests || 0,
      icon: TrendingUp,
      description: "Property assistance inquiries",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Platform Analytics</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
