
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  MessageSquare,
  Send,
  Settings,
  Users,
  Clock,
  User,
  Bot,
  RefreshCcw,
  AlertTriangle,
  Check,
  X
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRole } from "@/types/user";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'admin' | 'bot';
  timestamp: string;
  userName?: string;
  userEmail?: string;
  read?: boolean;
}

interface Conversation {
  id: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'active' | 'resolved' | 'pending';
}

interface AdminChatbotProps {
  userRole: UserRole | null;
}

export const AdminChatbot = ({ userRole }: AdminChatbotProps) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState('conversations');
  const [botSettings, setBotSettings] = useState({
    enabled: true,
    autoRespond: true,
    forwardToAdmin: true,
    workingHours: true
  });
  
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // Mock data for conversations
  useEffect(() => {
    // This would be replaced with a real API call in production
    const mockConversations: Conversation[] = [
      {
        id: '1',
        userName: 'John Smith',
        userEmail: 'john.smith@example.com',
        lastMessage: 'I need help finding a 3BHK property in Hyderabad',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        unreadCount: 3,
        status: 'active'
      },
      {
        id: '2',
        userName: 'Rani Patel',
        userEmail: 'rani.patel@gmail.com',
        lastMessage: 'What documents do I need for home loan?',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
        unreadCount: 0,
        status: 'pending'
      },
      {
        id: '3',
        userName: 'Ahmed Khan',
        userEmail: 'ahmed.k@outlook.com',
        lastMessage: 'Thanks for the information! I will check out those properties.',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
        unreadCount: 0,
        status: 'resolved'
      },
      {
        id: '4',
        userName: 'Priya Singh',
        userEmail: 'priya.singh@hotmail.com',
        lastMessage: 'Is the Jubilee Hills property still available?',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        unreadCount: 1,
        status: 'active'
      }
    ];
    
    setConversations(mockConversations);
  }, []);
  
  // Mock data for messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      setLoading(true);
      
      // This would be replaced with a real API call in production
      setTimeout(() => {
        const mockMessages: Message[] = [
          {
            id: '1',
            content: 'Hello, I need help finding a 3BHK property in Hyderabad',
            sender: 'user',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            userName: 'John Smith',
            userEmail: 'john.smith@example.com'
          },
          {
            id: '2',
            content: 'Hi John! I\'d be happy to help you find a 3BHK property in Hyderabad. Could you please let me know your preferred areas and budget range?',
            sender: 'bot',
            timestamp: new Date(Date.now() - 1000 * 60 * 29).toISOString()
          },
          {
            id: '3',
            content: 'I\'m looking for something in Banjara Hills or Jubilee Hills. My budget is around ₹1.5 crore',
            sender: 'user',
            timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
            userName: 'John Smith',
            userEmail: 'john.smith@example.com'
          },
          {
            id: '4',
            content: 'Great! We have several properties matching your criteria. Here are a few options:\n\n1. Luxury 3BHK in Banjara Hills - ₹1.45 crore\n2. Modern Apartment in Jubilee Hills - ₹1.38 crore\n3. Spacious Villa in Banjara Hills - ₹1.62 crore\n\nWould you like more details about any of these?',
            sender: 'bot',
            timestamp: new Date(Date.now() - 1000 * 60 * 24).toISOString()
          },
          {
            id: '5',
            content: 'I\'m interested in options 1 and 2. Can you send me more details?',
            sender: 'user',
            timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
            userName: 'John Smith',
            userEmail: 'john.smith@example.com'
          },
          {
            id: '6',
            content: 'This conversation requires specific property knowledge. Let me connect you with one of our property specialists.',
            sender: 'bot',
            timestamp: new Date(Date.now() - 1000 * 60 * 19).toISOString()
          },
          {
            id: '7',
            content: 'Hello John, I\'m Rahul from RC Bridge. I can help you with detailed information about those properties. The Luxury 3BHK in Banjara Hills is a newly constructed property with premium fittings, 3 bathrooms, a modern kitchen, and a beautiful view of the city. The Modern Apartment in Jubilee Hills is part of a gated community with amenities like a swimming pool, gym, and 24x7 security.',
            sender: 'admin',
            timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString()
          },
          {
            id: '8',
            content: 'I\'d like to visit both properties. When can I schedule a viewing?',
            sender: 'user',
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            userName: 'John Smith',
            userEmail: 'john.smith@example.com',
            read: false
          }
        ];
        
        if (selectedConversation === '1') {
          setMessages(mockMessages);
        } else {
          // For other conversations, generate generic messages
          setMessages([
            {
              id: '101',
              content: 'Hello, I have a question about RC Bridge properties',
              sender: 'user',
              timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
              userName: conversations.find(c => c.id === selectedConversation)?.userName,
              userEmail: conversations.find(c => c.id === selectedConversation)?.userEmail
            },
            {
              id: '102',
              content: 'Hi there! How can I assist you with RC Bridge properties today?',
              sender: 'bot',
              timestamp: new Date(Date.now() - 1000 * 60 * 29).toISOString()
            },
            {
              id: '103',
              content: conversations.find(c => c.id === selectedConversation)?.lastMessage || '',
              sender: 'user',
              timestamp: conversations.find(c => c.id === selectedConversation)?.lastMessageTime || '',
              userName: conversations.find(c => c.id === selectedConversation)?.userName,
              userEmail: conversations.find(c => c.id === selectedConversation)?.userEmail
            }
          ]);
        }
        
        setLoading(false);
        
        // Mark conversation as read when opened
        setConversations(prev => prev.map(conv => 
          conv.id === selectedConversation 
            ? { ...conv, unreadCount: 0 } 
            : conv
        ));
      }, 1000);
    }
  }, [selectedConversation]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedConversation) return;
    
    // Get admin name
    const adminName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin';
    
    // Add new message to the conversation
    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'admin',
      timestamp: new Date().toISOString(),
      userName: adminName
    };
    
    setMessages([...messages, newMessage]);
    setInputMessage('');
    
    // Update conversation with last message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation 
        ? { 
            ...conv, 
            lastMessage: inputMessage,
            lastMessageTime: new Date().toISOString(),
            status: 'active'
          } 
        : conv
    ));
    
    // In production, you would send this message to a backend API
    toast.success("Message sent to user");
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  const handleResolveConversation = () => {
    if (!selectedConversation) return;
    
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation 
        ? { ...conv, status: 'resolved' } 
        : conv
    ));
    
    toast.success("Conversation marked as resolved");
  };
  
  const handleToggleSetting = (setting: keyof typeof botSettings) => {
    setBotSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
    toast.success(`${setting} setting updated`);
  };
  
  return (
    <div className="p-6">
      <Tabs defaultValue="conversations" value={tabValue} onValueChange={setTabValue}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="conversations">
            <MessageSquare className="w-4 h-4 mr-2" />
            Conversations
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Chatbot Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="conversations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <Card className="lg:col-span-1 h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  User Conversations
                </CardTitle>
                <CardDescription>
                  {conversations.filter(c => c.status === 'active').length} active conversations
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No conversations found
                  </div>
                ) : (
                  <div className="space-y-2">
                    {conversations.map(conversation => (
                      <div 
                        key={conversation.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          conversation.id === selectedConversation 
                            ? 'bg-primary/10 border border-primary/20' 
                            : 'hover:bg-gray-100 border border-transparent'
                        }`}
                        onClick={() => setSelectedConversation(conversation.id)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>
                                {conversation.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{conversation.userName}</div>
                              <div className="text-xs text-gray-500 truncate max-w-[150px]">
                                {conversation.userEmail}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            {conversation.unreadCount > 0 && (
                              <Badge 
                                className="bg-primary rounded-full h-5 min-w-[20px] flex items-center justify-center text-xs mr-1"
                              >
                                {conversation.unreadCount}
                              </Badge>
                            )}
                            <Badge 
                              variant="outline"
                              className={`text-xs capitalize ${
                                conversation.status === 'active' 
                                  ? 'bg-green-50 text-green-700 border-green-200' 
                                  : conversation.status === 'pending'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-gray-50 text-gray-700 border-gray-200'
                              }`}
                            >
                              {conversation.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="text-sm truncate text-gray-600 mb-1 pl-10">
                          {conversation.lastMessage}
                        </div>
                        
                        <div className="text-xs text-gray-500 flex items-center pl-10">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTimestamp(conversation.lastMessageTime)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Chat Window */}
            <Card className="lg:col-span-2 h-[600px] flex flex-col">
              {selectedConversation ? (
                <>
                  <CardHeader className="pb-3 border-b">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>
                            {conversations.find(c => c.id === selectedConversation)?.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">
                            {conversations.find(c => c.id === selectedConversation)?.userName}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {conversations.find(c => c.id === selectedConversation)?.userEmail}
                          </CardDescription>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleResolveConversation}
                          className="h-8"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setSelectedConversation(null)}
                          className="h-8 w-8 text-gray-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-grow overflow-y-auto pt-4 pb-0">
                    {loading ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div 
                            key={message.id} 
                            className={`flex ${
                              message.sender === 'user' ? 'justify-start' : 'justify-end'
                            }`}
                          >
                            <div 
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.sender === 'user' 
                                  ? 'bg-gray-100 text-gray-900' 
                                  : message.sender === 'bot'
                                  ? 'bg-blue-100 text-blue-900'
                                  : 'bg-primary text-white'
                              }`}
                            >
                              {message.sender !== 'user' && (
                                <div className="flex items-center mb-1 text-xs font-medium">
                                  {message.sender === 'bot' ? (
                                    <>
                                      <Bot className="h-3 w-3 mr-1" />
                                      RC Assistant Bot
                                    </>
                                  ) : (
                                    <>
                                      <User className="h-3 w-3 mr-1" />
                                      {message.userName || 'Admin'}
                                    </>
                                  )}
                                </div>
                              )}
                              <div className="whitespace-pre-line">
                                {message.content}
                              </div>
                              <div className="text-xs mt-1 opacity-70 text-right">
                                {formatTimestamp(message.timestamp)}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={messageEndRef} />
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="pt-3 pb-3 border-t mt-auto">
                    <div className="flex items-center w-full gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-grow"
                        disabled={
                          loading || 
                          conversations.find(c => c.id === selectedConversation)?.status === 'resolved'
                        }
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={
                          !inputMessage.trim() || 
                          loading || 
                          conversations.find(c => c.id === selectedConversation)?.status === 'resolved'
                        }
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Send
                      </Button>
                    </div>
                    {conversations.find(c => c.id === selectedConversation)?.status === 'resolved' && (
                      <div className="w-full text-center mt-2 text-sm text-amber-600">
                        <AlertTriangle className="h-4 w-4 inline mr-1" />
                        This conversation is marked as resolved. You can reopen it by sending a new message.
                      </div>
                    )}
                  </CardFooter>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Conversation Selected</h3>
                  <p className="text-gray-600 max-w-md">
                    Select a conversation from the list to view messages and respond to users.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="w-5 h-5 mr-2 text-primary" />
                Chatbot Configuration
              </CardTitle>
              <CardDescription>
                Configure how the AI chatbot interacts with users on your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="bot-enabled" className="text-base">Enable Chatbot</Label>
                    <p className="text-sm text-gray-500">Display the chatbot on your website</p>
                  </div>
                  <Switch 
                    id="bot-enabled" 
                    checked={botSettings.enabled}
                    onCheckedChange={() => handleToggleSetting('enabled')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-respond" className="text-base">Auto-Respond to Messages</Label>
                    <p className="text-sm text-gray-500">Let the AI respond to common questions automatically</p>
                  </div>
                  <Switch 
                    id="auto-respond" 
                    checked={botSettings.autoRespond}
                    onCheckedChange={() => handleToggleSetting('autoRespond')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="forward-admin" className="text-base">Forward Complex Queries to Admins</Label>
                    <p className="text-sm text-gray-500">Send notifications to admins for queries the AI can't handle</p>
                  </div>
                  <Switch 
                    id="forward-admin" 
                    checked={botSettings.forwardToAdmin}
                    onCheckedChange={() => handleToggleSetting('forwardToAdmin')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="working-hours" className="text-base">Working Hours Only</Label>
                    <p className="text-sm text-gray-500">Only forward messages to admins during working hours (9 AM - 6 PM)</p>
                  </div>
                  <Switch 
                    id="working-hours" 
                    checked={botSettings.workingHours}
                    onCheckedChange={() => handleToggleSetting('workingHours')}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => setTabValue('conversations')}>
                Cancel
              </Button>
              <Button>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
