import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Activity, Mail, MessageSquare, Search, User, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { aggregateActivitySessions, formatDuration, formatTimeRange, type AggregatedSession, type CustomerActivity } from "@/utils/activityAggregator";
import { event } from "@/utils/eventLogger";

export function CustomerActivityTab() {
  const [activities, setActivities] = useState<CustomerActivity[]>([]);
  const [sessions, setSessions] = useState<AggregatedSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCustomerActivity();

    // Phase 3: Subscribe to real-time customer activity inserts
    const channel = supabase
      .channel('customer-activity-realtime')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'customer_activity_history' },
        (payload) => {
          console.log('👤 New customer activity recorded:', payload.new);
          event.info('new_customer_activity_detected', {
            activity_type: (payload.new as any).activity_type,
            customer_email: (payload.new as any).customer_email
          });
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
      const fetchedActivities = data?.data || [];
      setActivities(fetchedActivities);
      
      // Aggregate activities into sessions
      const aggregated = aggregateActivitySessions(fetchedActivities, 10);
      setSessions(aggregated);
    } catch (error) {
      console.error('Failed to fetch customer activity:', error);
      event.error('fetch_customer_activity_failed', error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSession = (sessionId: string) => {
    setExpandedSessions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sessionId)) {
        newSet.delete(sessionId);
      } else {
        newSet.add(sessionId);
      }
      return newSet;
    });
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Customer Activity History</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Sessions grouped by 10-minute intervals
          </p>
        </div>
        <div className="flex gap-3">
          <Badge variant="outline" className="text-base px-4 py-2">
            {sessions.length} Sessions
          </Badge>
          <Badge variant="secondary" className="text-base px-4 py-2">
            {activities.length} Total Activities
          </Badge>
        </div>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {sessions.map((session) => (
            <Collapsible key={session.id} open={expandedSessions.has(session.id)}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <div className={`p-2 rounded-full ${getActivityColor(session.activity_type)} text-white`}>
                          {getActivityIcon(session.activity_type)}
                        </div>
                        <div>
                          <div>{session.customer_name || session.customer_email || 'Anonymous'}</div>
                          <div className="text-sm font-normal text-muted-foreground">
                            {formatTimeRange(session.session_start, session.session_end)}
                          </div>
                        </div>
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {session.message_count} {session.message_count === 1 ? 'message' : 'messages'}
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDuration(session.duration_seconds)}
                      </Badge>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSession(session.id)}
                        >
                          {expandedSessions.has(session.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3 text-sm">
                  {session.customer_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{session.customer_email}</span>
                    </div>
                  )}
                  
                  {session.ip_address && session.ip_address !== 'Unknown' && (
                    <div className="text-muted-foreground">
                      <strong>IP:</strong> {session.ip_address}
                    </div>
                  )}
                  
                  {session.conversation_id && (
                    <div className="text-muted-foreground text-xs">
                      <strong>Conversation ID:</strong> {session.conversation_id}
                    </div>
                  )}
                  
                  {Object.keys(session.aggregated_entities).length > 0 && (
                    <div className="mt-3 p-3 bg-muted rounded-md">
                      <strong>Extracted Information:</strong>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                        {Object.entries(session.aggregated_entities).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium capitalize">{key}:</span>{' '}
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <CollapsibleContent>
                    <div className="mt-4 space-y-3 border-t pt-3">
                      <div className="font-medium">Session Messages:</div>
                      {session.messages.map((msg, idx) => (
                        <div key={msg.id} className="p-3 bg-muted/50 rounded-md space-y-2">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Message {idx + 1}</span>
                            <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <div className="text-sm">{msg.content}</div>
                          {Object.keys(msg.entities).length > 0 && (
                            <div className="text-xs">
                              <strong>Entities:</strong> {JSON.stringify(msg.entities)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </CardContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
