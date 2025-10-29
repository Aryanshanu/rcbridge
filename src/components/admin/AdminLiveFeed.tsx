import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Bell } from "lucide-react";

/**
 * AdminLiveFeed - Real-time notification system for admins
 * Subscribes to all relevant database events and displays toast notifications
 * Should be mounted in Admin.tsx and Navbar.tsx for system-wide coverage
 */
export const AdminLiveFeed = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Subscribe to chat messages (user only)
    const chatMessagesChannel = supabase
      .channel('admin_live_chat_messages')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages',
          filter: 'sender_type=eq.user'
        },
        (payload) => {
          console.log('New user message:', payload);
          toast.info('💬 New message from user', {
            description: 'A user has sent a new chat message',
            action: {
              label: 'View',
              onClick: () => window.location.href = '/admin?tab=chat'
            }
          });
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    // Subscribe to new conversations
    const conversationsChannel = supabase
      .channel('admin_live_conversations')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_conversations' },
        (payload) => {
          console.log('New conversation:', payload);
          toast.info('🆕 New chat conversation started', {
            description: 'A user has initiated a new conversation',
            action: {
              label: 'View',
              onClick: () => window.location.href = '/admin?tab=chat'
            }
          });
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    // Subscribe to contact messages
    const contactChannel = supabase
      .channel('admin_live_contact')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'contact_messages' },
        (payload) => {
          console.log('New contact message:', payload);
          const data = payload.new as any;
          toast.info('📧 New contact message', {
            description: `From: ${data.name || 'Unknown'} - ${data.subject || 'No subject'}`,
            action: {
              label: 'View',
              onClick: () => window.location.href = '/admin?tab=contact'
            }
          });
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    // Subscribe to assistance requests
    const assistanceChannel = supabase
      .channel('admin_live_assistance')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'assistance_requests' },
        (payload) => {
          console.log('New assistance request:', payload);
          const data = payload.new as any;
          toast.info('🙋 New assistance request', {
            description: `${data.name || 'Unknown'} - ${data.property_type || 'Property'} inquiry`,
            action: {
              label: 'View',
              onClick: () => window.location.href = '/admin?tab=assistance'
            }
          });
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    // Subscribe to new properties
    const propertiesChannel = supabase
      .channel('admin_live_properties')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'properties' },
        (payload) => {
          console.log('New property added:', payload);
          const data = payload.new as any;
          toast.info('🏠 New property added', {
            description: data.title || 'Property listing created',
            action: {
              label: 'View',
              onClick: () => window.location.href = '/admin?tab=properties'
            }
          });
        }
      )
      .subscribe();

    // Subscribe to customer activity
    const activityChannel = supabase
      .channel('admin_live_activity')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'customer_activity_history' },
        (payload) => {
          console.log('New customer activity:', payload);
          // Silent update - just increment counter
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(chatMessagesChannel);
      supabase.removeChannel(conversationsChannel);
      supabase.removeChannel(contactChannel);
      supabase.removeChannel(assistanceChannel);
      supabase.removeChannel(propertiesChannel);
      supabase.removeChannel(activityChannel);
    };
  }, []);

  // This component doesn't render anything visible - it just handles notifications
  return null;
};
