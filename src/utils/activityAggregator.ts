/**
 * Activity Aggregator
 * Groups customer activities by session (conversation_id or IP+user_agent within time window)
 */

export interface CustomerActivity {
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

export interface AggregatedSession {
  id: string;
  conversation_id: string | null;
  ip_address: string;
  user_agent: string | null;
  session_start: string;
  session_end: string;
  duration_seconds: number;
  message_count: number;
  customer_email: string | null;
  customer_name: string | null;
  activity_type: string;
  aggregated_entities: Record<string, any>;
  messages: Array<{
    id: string;
    content: string;
    timestamp: string;
    entities: Record<string, any>;
  }>;
}

/**
 * Aggregates activities into sessions based on conversation_id or IP+user_agent within time window
 */
export function aggregateActivitySessions(
  activities: CustomerActivity[],
  timeWindowMinutes: number = 10
): AggregatedSession[] {
  // Group by conversation_id or (ip_address + user_agent)
  const grouped = new Map<string, CustomerActivity[]>();
  
  activities.forEach(activity => {
    const conversationId = activity.activity_details?.conversation_id;
    const key = conversationId || `${activity.ip_address}_${activity.user_agent}`;
    
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(activity);
  });
  
  // Merge activities within time window
  const sessions: AggregatedSession[] = [];
  
  grouped.forEach((group) => {
    // Sort by timestamp
    const sorted = group.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    
    let currentSession: CustomerActivity[] = [sorted[0]];
    
    for (let i = 1; i < sorted.length; i++) {
      const prevTime = new Date(currentSession[currentSession.length - 1].created_at);
      const currTime = new Date(sorted[i].created_at);
      const diffMinutes = (currTime.getTime() - prevTime.getTime()) / 1000 / 60;
      
      if (diffMinutes <= timeWindowMinutes) {
        currentSession.push(sorted[i]);
      } else {
        sessions.push(createAggregatedSession(currentSession));
        currentSession = [sorted[i]];
      }
    }
    
    if (currentSession.length > 0) {
      sessions.push(createAggregatedSession(currentSession));
    }
  });
  
  return sessions.sort((a, b) => 
    new Date(b.session_start).getTime() - new Date(a.session_start).getTime()
  );
}

function createAggregatedSession(activities: CustomerActivity[]): AggregatedSession {
  const first = activities[0];
  const last = activities[activities.length - 1];
  
  const allEntities = activities.reduce((acc, activity) => {
    const entities = activity.activity_details?.entities || {};
    return { ...acc, ...entities };
  }, {});
  
  const sessionStart = new Date(first.created_at);
  const sessionEnd = new Date(last.created_at);
  
  return {
    id: first.id,
    conversation_id: first.activity_details?.conversation_id || null,
    ip_address: first.ip_address || 'Unknown',
    user_agent: first.user_agent || null,
    session_start: first.created_at,
    session_end: last.created_at,
    duration_seconds: Math.floor((sessionEnd.getTime() - sessionStart.getTime()) / 1000),
    message_count: activities.length,
    customer_email: first.customer_email,
    customer_name: first.customer_name,
    activity_type: first.activity_type,
    aggregated_entities: allEntities,
    messages: activities.map(a => ({
      id: a.id,
      content: a.activity_details?.message || JSON.stringify(a.activity_details),
      timestamp: a.created_at,
      entities: a.activity_details?.entities || {}
    }))
  };
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
}

export function formatTimeRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  const startTime = startDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false 
  });
  
  const endTime = endDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false 
  });
  
  return `${startTime} - ${endTime}`;
}
