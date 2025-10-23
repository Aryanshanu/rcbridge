import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, MessageSquare, Home, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Analytics {
  totalUsers: number;
  activeConversations: number;
  totalProperties: number;
  contactMessages: number;
  assistanceRequests: number;
}

export function AnalyticsTab() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();

    // Subscribe to real-time changes in all relevant tables
    const conversationsChannel = supabase
      .channel('analytics-conversations')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'chat_conversations' },
        () => {
          console.log('📊 New conversation detected, refreshing analytics...');
          fetchAnalytics();
        }
      )
      .subscribe();

    const messagesChannel = supabase
      .channel('analytics-messages')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        () => {
          console.log('📊 New message detected, refreshing analytics...');
          fetchAnalytics();
        }
      )
      .subscribe();

    const propertiesChannel = supabase
      .channel('analytics-properties')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'properties' },
        () => {
          console.log('📊 New property detected, refreshing analytics...');
          fetchAnalytics();
        }
      )
      .subscribe();

    const contactsChannel = supabase
      .channel('analytics-contacts')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'contact_messages' },
        () => {
          console.log('📊 New contact message detected, refreshing analytics...');
          fetchAnalytics();
        }
      )
      .subscribe();

    const assistanceChannel = supabase
      .channel('analytics-assistance')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'assistance_requests' },
        () => {
          console.log('📊 New assistance request detected, refreshing analytics...');
          fetchAnalytics();
        }
      )
      .subscribe();

    const profilesChannel = supabase
      .channel('analytics-profiles')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'profiles' },
        () => {
          console.log('📊 New profile detected, refreshing analytics...');
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsChannel);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(propertiesChannel);
      supabase.removeChannel(contactsChannel);
      supabase.removeChannel(assistanceChannel);
      supabase.removeChannel(profilesChannel);
    };
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-data', {
        body: { dataType: 'analytics' }
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
