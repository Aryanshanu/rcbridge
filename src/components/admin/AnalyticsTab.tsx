import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, MessageSquare, Home, TrendingUp } from "lucide-react";

interface Analytics {
  totalUsers: number;
  activeConversations: number;
  totalProperties: number;
  totalContactMessages: number;
  totalAssistanceRequests: number;
}

export function AnalyticsTab() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [users, conversations, properties, contactMessages, assistanceRequests] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('chat_conversations').select('id', { count: 'exact', head: true }),
        supabase.from('properties').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
        supabase.from('assistance_requests').select('id', { count: 'exact', head: true }),
      ]);

      setAnalytics({
        totalUsers: users.count || 0,
        activeConversations: conversations.count || 0,
        totalProperties: properties.count || 0,
        totalContactMessages: contactMessages.count || 0,
        totalAssistanceRequests: assistanceRequests.count || 0,
      });
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
      value: analytics?.totalContactMessages || 0,
      icon: TrendingUp,
      description: "Messages received via contact form",
    },
    {
      title: "Assistance Requests",
      value: analytics?.totalAssistanceRequests || 0,
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
