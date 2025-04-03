import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageCircle, X, Send, Loader2, User, Bot, Phone, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { detectLeadPotential, categorizeInquiry, extractLocations, extractPropertyTypes, extractPriceRange } from '@/utils/chatIntentDetector';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  imageUrl?: string;
}

type InquiryData = {
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiry_type: string;
  locations: string[];
  property_types: string[];
  price_min?: number;
  price_max?: number;
};

export function EnhancedChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Hi there! I'm Aryan from RC Bridge Real Estate. Whether you're looking to buy, sell, or invest in properties in Hyderabad, I'm here to help. What kind of property are you interested in?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState<InquiryData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    inquiry_type: 'general',
    locations: [],
    property_types: [],
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);
  
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        const formattedMessages = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error loading saved messages:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      try {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving messages:', error);
      }
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length,
      text: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const inquiry_type = categorizeInquiry(input);
      const locations = extractLocations(input);
      const property_types = extractPropertyTypes(input);
      const price_range = extractPriceRange(input);
      
      setInquiryData(prev => ({
        ...prev,
        inquiry_type,
        locations,
        property_types,
        price_min: price_range.min,
        price_max: price_range.max,
        message: prev.message ? `${prev.message}\n\n${input}` : input,
      }));
      
      const conversationHistory = messages.slice(-4).map(msg => ({
        text: msg.text,
        sender: msg.sender
      }));
      
      const response = await fetch('/api/rest/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user_input: input,
          conversation_history: conversationHistory 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }
      
      const data = await response.json();
      
      const botMessage: Message = {
        id: messages.length + 1,
        text: data.bot_response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      
      if (detectLeadPotential(input) && messages.length >= 3) {
        setTimeout(() => {
          toast({
            title: "Want personalized assistance?",
            description: "Share your contact information to get help from our property experts.",
            action: (
              <Button 
                onClick={() => setShowInquiryForm(true)}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Share Details
              </Button>
            )
          });
        }, 3000);
      }
    } catch (error) {
      console.error('Error in chat:', error);
      
      const errorMessage: Message = {
        id: messages.length + 1,
        text: "I'm sorry, I couldn't process your request. Please try again or call our office directly at +91 9876543210 for immediate assistance.",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const openInquiryForm = () => {
    const recentConversation = messages
      .slice(-3)
      .map(msg => `${msg.sender === 'user' ? 'Me' : 'Aryan'}: ${msg.text}`)
      .join('\n');
    
    setInquiryData(prev => ({
      ...prev,
      message: `Based on my conversation with Aryan:\n\n${recentConversation}\n\nI'd like to know more about:`,
    }));
    
    setShowInquiryForm(true);
  };
  
  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const inquiries = JSON.parse(localStorage.getItem('userDetailedInquiries') || '[]');
      inquiries.push({
        ...inquiryData,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('userDetailedInquiries', JSON.stringify(inquiries));
      
      fetch('/api/rest/v1/customer_inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          name: inquiryData.name,
          budget: inquiryData.price_min && inquiryData.price_max 
            ? `${inquiryData.price_min} to ${inquiryData.price_max} lakhs` 
            : inquiryData.price_max 
              ? `Up to ${inquiryData.price_max} lakhs` 
              : 'Not specified',
          property_type: inquiryData.property_types.length > 0 
            ? inquiryData.property_types[0] 
            : 'Not specified',
          location: inquiryData.locations.length > 0 
            ? inquiryData.locations[0] 
            : 'Not specified'
        }),
      });
      
      const botMessage: Message = {
        id: messages.length + 1,
        text: `Thank you, ${inquiryData.name}! Our property specialist will contact you soon at ${inquiryData.email || inquiryData.phone}. In the meantime, is there anything specific you'd like to know about properties in Hyderabad?`,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      
      toast({
        title: "Inquiry Submitted",
        description: "Our team will get back to you shortly!",
      });
      
      setShowInquiryForm(false);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your inquiry. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const clearChat = () => {
    setMessages([
      {
        id: 0,
        text: "Hi there! I'm Aryan from RC Bridge Real Estate. Whether you're looking to buy, sell, or invest in properties in Hyderabad, I'm here to help. What kind of property are you interested in?",
        sender: 'bot',
        timestamp: new Date(),
      }
    ]);
    localStorage.removeItem('chatMessages');
    toast({
      title: "Chat Cleared",
      description: "Starting a fresh conversation",
    });
  };

  const requestCallback = () => {
    const callbackMessage: Message = {
      id: messages.length + 1,
      text: "I'd be happy to have our property specialist call you back. Could you please provide your name and phone number?",
      sender: 'bot',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, callbackMessage]);
    setTimeout(() => {
      setShowInquiryForm(true);
    }, 1000);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 rounded-full p-3 h-12 w-12 shadow-lg z-50 bg-primary hover:bg-primary/90"
        aria-label="Chat with us"
      >
        {isOpen ? <X size={24} className="text-primary-foreground" /> : <MessageCircle size={24} className="text-primary-foreground" />}
      </Button>

      <div
        className={cn(
          "fixed bottom-36 right-4 w-80 md:w-96 z-50 transition-all duration-300 ease-in-out transform",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
        )}
      >
        <Card className="flex flex-col h-[500px] max-h-[70vh] overflow-hidden shadow-xl border-primary/20">
          <div className="bg-primary text-primary-foreground p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <div>
                <h3 className="font-medium">Aryan</h3>
                <p className="text-xs opacity-75">RC Bridge Real Estate</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                onClick={clearChat}
                title="Clear chat"
              >
                <X size={18} />
              </Button>
            </div>
          </div>

          <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "mb-3 flex gap-2",
                  message.sender === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1 border border-primary/20">
                    <Bot size={16} className="text-primary" />
                  </div>
                )}
                
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-3",
                    message.sender === 'user'
                      ? "bg-primary text-primary-foreground"
                      : "bg-white border border-gray-200"
                  )}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  
                  {message.imageUrl && (
                    <div className="mt-2 rounded-md overflow-hidden">
                      <img 
                        src={message.imageUrl} 
                        alt="Property visualization" 
                        className="w-full h-auto max-h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  )}
                  
                  <p className="text-xs opacity-70 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <User size={16} className="text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !input.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" /> : <Send className="h-4 w-4 text-primary-foreground" />}
              </Button>
            </form>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-1/2 text-xs"
                onClick={requestCallback}
              >
                <Phone className="h-3 w-3 mr-1" /> Request Call
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-1/2 text-xs"
                onClick={openInquiryForm}
              >
                <Calendar className="h-3 w-3 mr-1" /> Schedule Visit
              </Button>
            </div>
          </div>
        </Card>
      </div>
      
      <Dialog open={showInquiryForm} onOpenChange={setShowInquiryForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request More Information</DialogTitle>
            <DialogDescription>
              Fill out this form and our property experts will get back to you shortly.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleInquirySubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={inquiryData.name}
                onChange={(e) => setInquiryData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={inquiryData.email}
                onChange={(e) => setInquiryData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone *
              </label>
              <Input
                id="phone"
                value={inquiryData.phone}
                onChange={(e) => setInquiryData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                value={inquiryData.message}
                onChange={(e) => setInquiryData(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowInquiryForm(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
