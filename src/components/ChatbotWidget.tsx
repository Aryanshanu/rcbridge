
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, 
  X, 
  Send, 
  Loader2, 
  Bot, 
  ChevronDown, 
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
}

export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: "Hello! I'm the RC Bridge Assistant. How can I help you today?",
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length]);
  
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
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
    
    // Simulate bot response
    setTimeout(() => {
      // Process the message and generate response
      const response = processUserMessage(inputMessage);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: response.needsHuman ? 'admin' : 'bot',
        timestamp: new Date(),
        adminName: response.needsHuman ? "Property Specialist" : undefined
      }]);
      
      setIsSending(false);
    }, 1000);
  };
  
  const processUserMessage = (message: string): { text: string; needsHuman: boolean } => {
    // Simple keyword matching for demo purposes
    // In production, this would be replaced with a more sophisticated NLP system
    const normalizedMsg = message.toLowerCase();
    
    if (normalizedMsg.includes("price") || normalizedMsg.includes("cost")) {
      return {
        text: "Our properties range from ₹40 lakhs to ₹5 crores depending on the location, size, and amenities. Is there a specific area or type of property you're interested in?",
        needsHuman: false
      };
    } else if (normalizedMsg.includes("location") || normalizedMsg.includes("area")) {
      return {
        text: "We have properties across Hyderabad including Banjara Hills, Jubilee Hills, HITEC City, Gachibowli, and many other prime locations. Which area are you interested in?",
        needsHuman: false
      };
    } else if (normalizedMsg.includes("contact") || normalizedMsg.includes("speak") || normalizedMsg.includes("agent")) {
      return {
        text: "I'll connect you with one of our property specialists who can help you with more specific information. Please let us know what you're looking for in a property.",
        needsHuman: true
      };
    } else if (normalizedMsg.includes("loan") || normalizedMsg.includes("mortgage") || normalizedMsg.includes("finance")) {
      return {
        text: "We work with several banks and financial institutions to provide home loan assistance. Our property specialists can guide you through the loan application process and help you find the best interest rates.",
        needsHuman: true
      };
    } else {
      return {
        text: "Thank you for your message. I'll connect you with a property specialist who can provide more personalized assistance. Could you please provide some more details about what you're looking for?",
        needsHuman: true
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
                placeholder="Type your message..."
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
