import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  requiresPropertyInfo?: boolean;
}

interface UserInfo {
  name: string;
  email: string;
  phone: string;
}

interface PropertyInfo {
  budget: string;
  propertyType: string;
  location: string;
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
  });
  const [currentUserInfoField, setCurrentUserInfoField] = useState<keyof UserInfo | null>(null);
  
  const [collectingPropertyInfo, setCollectingPropertyInfo] = useState<boolean>(false);
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo>({
    budget: "",
    propertyType: "",
    location: "",
    requirements: "",
  });
  const [currentPropertyInfoField, setCurrentPropertyInfoField] = useState<keyof PropertyInfo | null>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeConversation();
    }
  }, [isOpen]);
  
  const initializeConversation = async () => {
    try {
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
          text: "Hello! I'm Aryan from RC Bridge. How can I help you find your dream property today?",
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages([welcomeMessage]);
        
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
        text: "Hello! I'm Aryan from RC Bridge. How can I help you find your dream property today?",
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  };
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    if (collectingUserInfo && currentUserInfoField) {
      handleUserInfoInput();
      return;
    }
    
    if (collectingPropertyInfo && currentPropertyInfoField) {
      handlePropertyInfoInput();
      return;
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsSending(true);
    
    if (conversationId) {
      await supabase
        .from('chat_messages')
        .insert([{
          conversation_id: conversationId,
          sender_type: 'user',
          content: inputMessage,
        }]);
    }
    
    setTimeout(async () => {
      const response = processUserMessage(inputMessage);
      
      const botMessage: Message = {
        id: Date.now().toString() + '-bot',
        text: response.text,
        sender: response.needsHuman ? 'admin' : 'bot',
        timestamp: new Date(),
        adminName: response.needsHuman ? "Property Specialist" : undefined,
        requiresUserInfo: response.requiresUserInfo,
        requiresPropertyInfo: response.requiresPropertyInfo
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      if (conversationId) {
        await supabase
          .from('chat_messages')
          .insert([{
            conversation_id: conversationId,
            sender_type: botMessage.sender,
            content: botMessage.text,
            admin_name: botMessage.adminName,
            message_type: botMessage.requiresUserInfo || botMessage.requiresPropertyInfo ? 'user_info' : 'text'
          }]);
      }
      
      if (response.requiresUserInfo) {
        setCollectingUserInfo(true);
        setCurrentUserInfoField('name');
        
        setTimeout(async () => {
          const namePrompt = "Could you please share your name?";
          const promptMessage: Message = {
            id: Date.now().toString() + '-prompt',
            text: namePrompt,
            sender: 'bot',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, promptMessage]);
          
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
      } else if (response.requiresPropertyInfo) {
        setCollectingPropertyInfo(true);
        setCurrentPropertyInfoField('budget');
        
        setTimeout(async () => {
          const budgetPrompt = "What is your budget range for the property?";
          const promptMessage: Message = {
            id: Date.now().toString() + '-prompt',
            text: budgetPrompt,
            sender: 'bot',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, promptMessage]);
          
          if (conversationId) {
            await supabase
              .from('chat_messages')
              .insert([{
                conversation_id: conversationId,
                sender_type: 'bot',
                content: budgetPrompt,
              }]);
          }
        }, 1000);
      }
      
      setIsSending(false);
    }, 1000);
  };
  
  const handleUserInfoInput = async () => {
    if (!currentUserInfoField) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    setUserInfo(prev => ({
      ...prev,
      [currentUserInfoField]: inputMessage
    }));
    
    setInputMessage("");
    
    if (conversationId) {
      await supabase
        .from('chat_messages')
        .insert([{
          conversation_id: conversationId,
          sender_type: 'user',
          content: inputMessage,
        }]);
    }
    
    const fields: (keyof UserInfo)[] = ['name', 'email', 'phone'];
    const currentIndex = fields.indexOf(currentUserInfoField);
    
    if (currentIndex < fields.length - 1) {
      const nextField = fields[currentIndex + 1];
      setCurrentUserInfoField(nextField);
      
      const nextMessage = getNextUserInfoPrompt(nextField);
      const botMessage: Message = {
        id: Date.now().toString() + '-bot',
        text: nextMessage,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        
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
      setCollectingUserInfo(false);
      setCollectingPropertyInfo(true);
      setCurrentPropertyInfoField('budget');
      
      setTimeout(async () => {
        const budgetPrompt = "Great! Now, what's your budget range for the property?";
        const promptMessage: Message = {
          id: Date.now().toString() + '-prompt',
          text: budgetPrompt,
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, promptMessage]);
        
        if (conversationId) {
          await supabase
            .from('chat_messages')
            .insert([{
              conversation_id: conversationId,
              sender_type: 'bot',
              content: budgetPrompt,
            }]);
        }
      }, 1000);
    }
  };
  
  const handlePropertyInfoInput = async () => {
    if (!currentPropertyInfoField) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    setPropertyInfo(prev => ({
      ...prev,
      [currentPropertyInfoField]: inputMessage
    }));
    
    setInputMessage("");
    
    if (conversationId) {
      await supabase
        .from('chat_messages')
        .insert([{
          conversation_id: conversationId,
          sender_type: 'user',
          content: inputMessage,
        }]);
    }
    
    const fields: (keyof PropertyInfo)[] = ['budget', 'propertyType', 'location', 'requirements'];
    const currentIndex = fields.indexOf(currentPropertyInfoField);
    
    if (currentIndex < fields.length - 1) {
      const nextField = fields[currentIndex + 1];
      setCurrentPropertyInfoField(nextField);
      
      const nextMessage = getNextPropertyInfoPrompt(nextField);
      const botMessage: Message = {
        id: Date.now().toString() + '-bot',
        text: nextMessage,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        
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
      await completeInquiryCollection();
    }
  };
  
  const getNextUserInfoPrompt = (field: keyof UserInfo): string => {
    switch (field) {
      case 'name':
        return "Could you please share your name?";
      case 'email':
        return "Great! Now, what's your email address so we can reach you? (You can type 'skip' if you prefer not to share)";
      case 'phone':
        return "Thanks! Could you also provide your phone number? (You can type 'skip' if you prefer not to share)";
      default:
        return "Could you provide more information?";
    }
  };
  
  const getNextPropertyInfoPrompt = (field: keyof PropertyInfo): string => {
    switch (field) {
      case 'budget':
        return "What's your budget range for the property?";
      case 'propertyType':
        return "What type of property are you looking for? (Apartment, Villa, Plot, etc.)";
      case 'location':
        return "Which area or location are you interested in?";
      case 'requirements':
        return "Do you have any specific requirements for the property? (Number of bedrooms, amenities, etc.)";
      default:
        return "Could you provide more information?";
    }
  };
  
  const completeInquiryCollection = async () => {
    setCollectingPropertyInfo(false);
    
    try {
      const emailValue = userInfo.email.toLowerCase() === 'skip' ? '' : userInfo.email;
      const phoneValue = userInfo.phone.toLowerCase() === 'skip' ? '' : userInfo.phone;
      
      if (conversationId) {
        await supabase
          .from('chat_user_info')
          .insert([{
            conversation_id: conversationId,
            name: userInfo.name,
            email: emailValue,
            phone: phoneValue,
            requirements: propertyInfo.requirements
          }]);
        
        await supabase
          .from('customer_inquiries')
          .insert({
            name: userInfo.name,
            budget: propertyInfo.budget,
            property_type: propertyInfo.propertyType,
            location: propertyInfo.location
          });
          
        const contactMethod = emailValue || phoneValue;
        const thankYouMessage: Message = {
          id: Date.now().toString(),
          text: `Thank you, ${userInfo.name}! We've received your property inquiry for a ${propertyInfo.propertyType} in ${propertyInfo.location} with a budget of ${propertyInfo.budget}. One of our property specialists will contact you soon${contactMethod ? ' at ' + contactMethod : ''}. Is there anything else you'd like to know in the meantime?`,
          sender: 'admin',
          adminName: "Property Specialist",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, thankYouMessage]);
        
        await supabase
          .from('chat_messages')
          .insert([{
            conversation_id: conversationId,
            sender_type: 'admin',
            content: thankYouMessage.text,
            admin_name: "Property Specialist"
          }]);
        
        toast.success("Your property inquiry has been submitted", {
          description: "A property specialist will contact you soon."
        });
      }
    } catch (error) {
      console.error("Error saving user inquiry:", error);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "I'm sorry, there was an issue saving your information. Please try again later or contact us directly.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };
  
  const processUserMessage = (message: string): { 
    text: string; 
    needsHuman: boolean; 
    requiresUserInfo: boolean;
    requiresPropertyInfo: boolean;
  } => {
    const normalizedMsg = message.toLowerCase();
    
    if (normalizedMsg.includes("price") || normalizedMsg.includes("cost")) {
      return {
        text: "Our properties range from ₹40 lakhs to ₹5 crores depending on the location, size, and amenities. Is there a specific area or type of property you're interested in?",
        needsHuman: false,
        requiresUserInfo: false,
        requiresPropertyInfo: false
      };
    } else if (normalizedMsg.includes("location") || normalizedMsg.includes("area")) {
      return {
        text: "We have properties across Hyderabad including Banjara Hills, Jubilee Hills, HITEC City, Gachibowli, and many other prime locations. Which area are you interested in?",
        needsHuman: false,
        requiresUserInfo: false,
        requiresPropertyInfo: false
      };
    } else if (normalizedMsg.includes("property") || normalizedMsg.includes("home") || normalizedMsg.includes("apartment") || normalizedMsg.includes("house")) {
      return {
        text: "I'd be happy to help you find the perfect property. To provide personalized recommendations, could I collect some information about what you're looking for?",
        needsHuman: false,
        requiresUserInfo: true,
        requiresPropertyInfo: false
      };
    } else if (normalizedMsg.includes("loan") || normalizedMsg.includes("mortgage") || normalizedMsg.includes("finance")) {
      return {
        text: "We work with several banks and financial institutions to provide home loan assistance. To help you with specific loan options, I'd like to understand your property requirements better.",
        needsHuman: false,
        requiresUserInfo: true,
        requiresPropertyInfo: false
      };
    } else if (normalizedMsg.includes("help") || normalizedMsg.includes("looking") || normalizedMsg.includes("buy") || normalizedMsg.includes("purchase")) {
      return {
        text: "I'd be happy to help you find your dream property. Could I ask you a few questions to understand your requirements better?",
        needsHuman: false,
        requiresUserInfo: true,
        requiresPropertyInfo: false
      };
    } else {
      return {
        text: "Thank you for reaching out to RC Bridge. To better assist you with your property search, could I ask you a few questions?",
        needsHuman: false,
        requiresUserInfo: true,
        requiresPropertyInfo: false
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
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </Button>
      
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 sm:w-96 shadow-xl z-50 flex flex-col h-[500px] max-h-[80vh]">
          <CardHeader className="bg-primary py-3 px-4 rounded-t-lg flex flex-row items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2 bg-primary-foreground">
                <AvatarFallback>RC</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-primary-foreground">Aryan</h3>
                <p className="text-xs text-primary-foreground/80">RC Bridge Property Specialist</p>
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
                            Aryan
                          </>
                        ) : (
                          <>
                            <User className="h-3 w-3 mr-1" />
                            {message.adminName}
                          </>
                        )}
                      </div>
                    )}
                    <div className="whitespace-pre-line">{message.text}</div>
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
            {collectingPropertyInfo && currentPropertyInfoField === 'requirements' ? (
              <div className="flex w-full gap-2">
                <Textarea
                  placeholder="Enter your specific requirements..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-grow min-h-[80px]"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isSending}
                  className="self-end"
                  size="icon"
                >
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            ) : (
              <div className="flex w-full gap-2">
                <Input
                  placeholder={
                    collectingUserInfo 
                      ? `Enter your ${currentUserInfoField}...` 
                      : collectingPropertyInfo
                      ? `Enter ${currentPropertyInfoField}...`
                      : "Type your message..."
                  }
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
            )}
          </CardFooter>
        </Card>
      )}
    </>
  );
};
