import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Phone, User, Loader2, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useMasterAdmin } from "@/contexts/MasterAdminContext";

interface ContactMessage {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
}

export function ContactMessagesTab() {
  const { sessionToken } = useMasterAdmin();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-data', {
        body: { sessionToken, dataType: 'contacts' }
      });

      if (error) throw error;
      if (data?.success) {
        setMessages(data.data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching contact messages:', error);
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
        <h2 className="text-2xl font-bold">Contact Messages</h2>
        <Badge variant="secondary">{messages.length} Total</Badge>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card key={msg.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{msg.subject}</CardTitle>
                    <CardDescription>
                      {format(new Date(msg.created_at), 'PPpp')}
                    </CardDescription>
                  </div>
                  <Badge>New</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{msg.name}</span>
                  <span className="text-muted-foreground">({msg.email})</span>
                </div>
                {msg.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{msg.phone}</span>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{msg.message}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
