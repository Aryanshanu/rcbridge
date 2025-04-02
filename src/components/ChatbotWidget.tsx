
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, 
  X, 
  Send, 
  Loader2, 
  Bot, 
  User 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'admin';
  timestamp: Date;
  adminName?: string;
  requiresUserInfo?: boolean;
}

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  requirements: string;
}

export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [collectingUserInfo, setCollectingUserInfo] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
    phone: "",
    requirements: ""
  });
  const [currentUserInfoField, setCurrentUserInfoField] = useState<keyof UserInfo | null>(null);
  
  // Scroll to bottom of messages whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeConversation();
    }
  }, [isOpen]);
  
  const initializeConversation = async () => {
    try {
      // Create a new conversation in the database
      const { data: conversationData, error: conversationError } = await supabase
        .from('chat_conversations')
        .insert([{ 
          user_id: user?.id || null
        }])
        .select();
        
      if (conversationError) {
        console.error("Error creating conversation:", conversationError);
        throw new Error(conversationError.message);
      }
      
      if (conversationData && conversationData[0]) {
        setConversationId(conversationData[0].id);
        
        const welcomeMessage: Message = {
          id: '1',
          text: "Hello! I'm the RC Bridge Assistant. How can I help you today?",
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages([welcomeMessage]);
        
        // Save welcome message to database
        await supabase
          .from('chat_messages')
          .insert([{
            conversation_id: conversationData[0].id,
            sender_type: 'bot',
            content: welcomeMessage.text,
          }]);
      }
    } catch (error) {
      console.error("Failed to initialize conversation:", error);
      setMessages([{
        id: '1',
        text: "Hello! I'm the RC Bridge Assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  };
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    if (collectingUserInfo && currentUserInfoField) {
      // Handle user info collection
      setUserInfo(prev => ({ ...prev, [currentUserInfoField]: inputMessage }));
      
      // Add user's message to the UI
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputMessage("");
      
      // Save user message to database
      if (conversationId) {
        await supabase
          .from('chat_messages')
          .insert([{
            conversation_id: conversationId,
            sender_type: 'user',
            content: inputMessage,
          }]);
      }
      
      // Move to next field or complete user info collection
      const fields: (keyof UserInfo)[] = ['name', 'email', 'phone', 'requirements'];
      const currentIndex = fields.indexOf(currentUserInfoField);
      
      if (currentIndex < fields.length - 1) {
        // Move to the next field
        const nextField = fields[currentIndex + 1];
        setCurrentUserInfoField(nextField);
        
        // Send bot message for next field
        const nextMessage = getNextUserInfoPrompt(nextField);
        const botMessage: Message = {
          id: Date.now().toString() + '-bot',
          text: nextMessage,
          sender: 'bot',
          timestamp: new Date()
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, botMessage]);
          
          // Save bot message to database
          if (conversationId) {
            supabase
              .from('chat_messages')
              .insert([{
                conversation_id: conversationId,
                sender_type: 'bot',
                content: nextMessage,
              }]);
          }
        }, 500);
      } else {
        // All fields completed
        await completeUserInfoCollection();
      }
      
      return;
    }
    
    // Add user's message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsSending(true);
    
    // Save user message to database
    if (conversationId) {
      await supabase
        .from('chat_messages')
        .insert([{
          conversation_id: conversationId,
          sender_type: 'user',
          content: inputMessage,
        }]);
    }
    
    // Process the message and generate response
    setTimeout(async () => {
      // Process the message and generate response
      const response = processUserMessage(inputMessage);
      
      const botMessage: Message = {
        id: Date.now().toString() + '-bot',
        text: response.text,
        sender: response.needsHuman ? 'admin' : 'bot',
        timestamp: new Date(),
        adminName: response.needsHuman ? "Property Specialist" : undefined,
        requiresUserInfo: response.requiresUserInfo
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Save bot message to database
      if (conversationId) {
        await supabase
          .from('chat_messages')
          .insert([{
            conversation_id: conversationId,
            sender_type: botMessage.sender,
            content: botMessage.text,
            admin_name: botMessage.adminName,
            message_type: botMessage.requiresUserInfo ? 'user_info' : 'text'
          }]);
      }
      
      // If this message requires collecting user info
      if (response.requiresUserInfo) {
        setCollectingUserInfo(true);
        setCurrentUserInfoField('name');
        
        // Send prompt for name after a small delay
        setTimeout(async () => {
          const namePrompt = "Could you please share your name?";
          const promptMessage: Message = {
            id: Date.now().toString() + '-prompt',
            text: namePrompt,
            sender: 'bot',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, promptMessage]);
          
          // Save prompt message to database
          if (conversationId) {
            await supabase
              .from('chat_messages')
              .insert([{
                conversation_id: conversationId,
                sender_type: 'bot',
                content: namePrompt,
              }]);
          }
        }, 1000);
      }
      
      setIsSending(false);
    }, 1000);
  };
  
  const getNextUserInfoPrompt = (field: keyof UserInfo): string => {
    switch (field) {
      case 'name':
        return "Could you please share your name?";
      case 'email':
        return "Great! Now, what's your email address so we can reach you?";
      case 'phone':
        return "Thanks! Could you also provide your phone number?";
      case 'requirements':
        return "Finally, please tell us more about what you're looking for in a property?";
      default:
        return "Could you provide more information?";
    }
  };
  
  const completeUserInfoCollection = async () => {
    setCollectingUserInfo(false);
    
    try {
      // Save user info to database
      if (conversationId) {
        await supabase
          .from('chat_user_info')
          .insert([{
            conversation_id: conversationId,
            ...userInfo
          }]);
          
        // Send thank you message
        const thankYouMessage: Message = {
          id: Date.now().toString(),
          text: `Thank you, ${userInfo.name}! One of our property specialists will contact you soon at ${userInfo.email || userInfo.phone}. Is there anything else you'd like to know in the meantime?`,
          sender: 'admin',
          adminName: "Property Specialist",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, thankYouMessage]);
        
        // Save thank you message to database
        await supabase
          .from('chat_messages')
          .insert([{
            conversation_id: conversationId,
            sender_type: 'admin',
            content: thankYouMessage.text,
            admin_name: "Property Specialist"
          }]);
        
        toast.success("Your information has been submitted", {
          description: "A property specialist will contact you soon."
        });
      }
    } catch (error) {
      console.error("Error saving user info:", error);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "I'm sorry, there was an issue saving your information. Please try again later or contact us directly.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };
  
  const processUserMessage = (message: string): { text: string; needsHuman: boolean; requiresUserInfo: boolean } => {
    // Simple keyword matching for demo purposes
    const normalizedMsg = message.toLowerCase();
    
    if (normalizedMsg.includes("price") || normalizedMsg.includes("cost")) {
      return {
        text: "Our properties range from ₹40 lakhs to ₹5 crores depending on the location, size, and amenities. Is there a specific area or type of property you're interested in?",
        needsHuman: false,
        requiresUserInfo: false
      };
    } else if (normalizedMsg.includes("location") || normalizedMsg.includes("area")) {
      return {
        text: "We have properties across Hyderabad including Banjara Hills, Jubilee Hills, HITEC City, Gachibowli, and many other prime locations. Which area are you interested in?",
        needsHuman: false,
        requiresUserInfo: false
      };
    } else if (normalizedMsg.includes("contact") || normalizedMsg.includes("speak") || normalizedMsg.includes("agent")) {
      return {
        text: "I'll connect you with one of our property specialists who can help you with more specific information. Please let us know what you're looking for in a property.",
        needsHuman: true,
        requiresUserInfo: true
      };
    } else if (normalizedMsg.includes("loan") || normalizedMsg.includes("mortgage") || normalizedMsg.includes("finance")) {
      return {
        text: "We work with several banks and financial institutions to provide home loan assistance. Our property specialists can guide you through the loan application process and help you find the best interest rates.",
        needsHuman: true,
        requiresUserInfo: true
      };
    } else {
      return {
        text: "Thank you for your message. I'll connect you with a property specialist who can provide more personalized assistance. Could you please provide some more details about what you're looking for?",
        needsHuman: true,
        requiresUserInfo: true
      };
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  
  return (
    <>
      {/* Chatbot button */}
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </Button>
      
      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 sm:w-96 shadow-xl z-50 flex flex-col h-[500px] max-h-[80vh]">
          <CardHeader className="bg-primary py-3 px-4 rounded-t-lg flex flex-row items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2 bg-primary-foreground">
                <AvatarFallback>RC</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-primary-foreground">RC Bridge Assistant</h3>
                <p className="text-xs text-primary-foreground/80">Ask me anything about properties</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-7 w-7 text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <X size={18} />
            </Button>
          </CardHeader>
          
          <CardContent className="p-4 overflow-y-auto flex-grow">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-primary text-white'
                        : message.sender === 'admin'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.sender !== 'user' && (
                      <div className="flex items-center mb-1 text-xs font-medium">
                        {message.sender === 'bot' ? (
                          <>
                            <Bot className="h-3 w-3 mr-1" />
                            RC Assistant
                          </>
                        ) : (
                          <>
                            <User className="h-3 w-3 mr-1" />
                            {message.adminName}
                          </>
                        )}
                      </div>
                    )}
                    <div>{message.text}</div>
                    <div className="text-xs mt-1 opacity-70 text-right">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          
          <CardFooter className="p-3 border-t">
            <div className="flex w-full gap-2">
              <Input
                placeholder={collectingUserInfo ? `Enter your ${currentUserInfoField}...` : "Type your message..."}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isSending}
                className="flex-grow"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isSending}
                size="icon"
              >
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
};
