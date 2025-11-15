import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, TrendingUp, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TopProperty {
  id: string;
  title: string;
  location: string;
  view_count: number;
}

interface ActiveUser {
  email: string;
  name: string | null;
  activity_count: number;
}

interface PeakTime {
  hour: number;
  count: number;
}

export const AnalyticsWidget = () => {
  const [topProperties, setTopProperties] = useState<TopProperty[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [peakTimes, setPeakTimes] = useState<PeakTime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('analytics_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'property_views' }, () => {
        fetchAnalytics();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customer_activity_history' }, () => {
        fetchAnalytics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch top viewed properties
      const { data: propsData } = await supabase
        .from('properties')
        .select('id, title, location, view_count')
        .order('view_count', { ascending: false })
        .limit(5);

      setTopProperties(propsData || []);

      // Fetch most active users from customer_activity_history
      const { data: activityData } = await supabase
        .from('customer_activity_history')
        .select('customer_email, customer_name')
        .not('customer_email', 'is', null);

      if (activityData) {
        const userActivity = activityData.reduce((acc: Record<string, { name: string | null; count: number }>, curr) => {
          const email = curr.customer_email!;
          if (!acc[email]) {
            acc[email] = { name: curr.customer_name, count: 0 };
          }
          acc[email].count++;
          return acc;
        }, {});

        const sortedUsers = Object.entries(userActivity)
          .map(([email, data]) => ({
            email,
            name: data.name,
            activity_count: data.count
          }))
          .sort((a, b) => b.activity_count - a.activity_count)
          .slice(0, 5);

        setActiveUsers(sortedUsers);
      }

      // Analyze peak activity times from property_views
      const { data: viewsData } = await supabase
        .from('property_views')
        .select('viewed_at');

      if (viewsData) {
        const hourCounts = viewsData.reduce((acc: Record<number, number>, curr) => {
          if (curr.viewed_at) {
            const hour = new Date(curr.viewed_at).getHours();
            acc[hour] = (acc[hour] || 0) + 1;
          }
          return acc;
        }, {});

        const sortedTimes = Object.entries(hourCounts)
          .map(([hour, count]) => ({
            hour: parseInt(hour),
            count
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setPeakTimes(sortedTimes);
      }

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Top Viewed Properties */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          <h3 className="text-lg font-semibold">Top Viewed Properties</h3>
        </div>
        <div className="space-y-3">
          {topProperties.length === 0 ? (
            <p className="text-sm text-muted-foreground">No property views yet</p>
          ) : (
            topProperties.map((property, index) => (
              <div key={property.id} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                    <p className="font-medium text-sm truncate">{property.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{property.location}</p>
                </div>
                <Badge className="ml-2 shrink-0">{property.view_count || 0} views</Badge>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Most Active Users */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Users className="h-5 w-5 mr-2 text-primary" />
          <h3 className="text-lg font-semibold">Most Active Users</h3>
        </div>
        <div className="space-y-3">
          {activeUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No user activity yet</p>
          ) : (
            activeUsers.map((user, index) => (
              <div key={user.email} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                    <p className="font-medium text-sm truncate">
                      {user.name || 'Anonymous'}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <Badge className="ml-2 shrink-0">{user.activity_count} actions</Badge>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Peak Activity Times */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Clock className="h-5 w-5 mr-2 text-primary" />
          <h3 className="text-lg font-semibold">Peak Activity Times</h3>
        </div>
        <div className="space-y-3">
          {peakTimes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity data yet</p>
          ) : (
            peakTimes.map((time, index) => (
              <div key={time.hour} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                  <p className="font-medium text-sm">{formatHour(time.hour)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-primary rounded-full" style={{ width: `${Math.min(time.count * 10, 60)}px` }} />
                  <Badge className="shrink-0">{time.count} views</Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
