
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageCircle, X, Send, Loader2, Image, ChevronDown, User, Bot, MapPin } from 'lucide-react';
import { 
  initializeChatModel, 
  initializeImageModel, 
  generatePropertyImage,
  storeUserInquiry,
  getConversationContext,
  clearConversationContext,
  updateUserProfile
} from '@/utils/chatbotUtils';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  imageUrl?: string;
  location?: string;
}

type InquiryData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Hi there! I'm your RC Bridge real estate assistant. Ask me about properties, investments, market trends, or agricultural land in Hyderabad!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [imageGenReady, setImageGenReady] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState<InquiryData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [userMentionedLocation, setUserMentionedLocation] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize the models when the component mounts
    const loadModels = async () => {
      const chatReady = await initializeChatModel();
      const imageReady = await initializeImageModel();
      setModelReady(chatReady);
      setImageGenReady(imageReady);
      
      if (chatReady) {
        toast({
          title: "RC Bridge Assistant Ready",
          description: "Ask me about real estate properties and investments in Hyderabad",
        });
      }
    };
    loadModels();
    
    // Load previous conversations from localStorage if available
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert string dates back to Date objects
        const formattedMessages = parsedMessages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error loading saved messages:', error);
      }
    }
  }, [toast]);

  useEffect(() => {
    // Save messages to localStorage when they change
    if (messages.length > 1) { // Don't save if it's just the welcome message
      try {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving messages:', error);
      }
    }
  }, [messages]);

  useEffect(() => {
    // Scroll to the bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Focus the input when the chat is opened
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Extract potential location from user input
    const locationKeywords = [
      "pocharam", "gachibowli", "jubilee hills", "banjara hills", "hitech city", 
      "kondapur", "madhapur", "kukatpally", "miyapur", "manikonda"
    ];
    
    const inputLower = input.toLowerCase();
    const mentionedLocation = locationKeywords.find(loc => inputLower.includes(loc));
    if (mentionedLocation) {
      setUserMentionedLocation(mentionedLocation);
    }

    const userMessage: Message = {
      id: messages.length,
      text: input.trim(),
      sender: 'user',
      timestamp: new Date(),
      location: mentionedLocation || undefined
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Store user inquiry for later analysis
      storeUserInquiry(input.trim(), getConversationContext());
      
      // Prepare conversation history for AI (last 15 messages for context)
      const conversationHistory = [...messages, userMessage].map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })).slice(-15);

      // Call streaming edge function
      const response = await fetch(
        `https://hchtekfbtcbfsfxkjyfi.supabase.co/functions/v1/chat-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: conversationHistory }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let textBuffer = "";
      let streamDone = false;

      // Create initial empty bot message
      const botMessageId = messages.length + 1;
      const botMessage: Message = {
        id: botMessageId,
        text: "",
        sender: 'bot',
        timestamp: new Date(),
        location: mentionedLocation || undefined
      };
      setMessages((prev) => [...prev, botMessage]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        // Process line-by-line as data arrives
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantMessage += content;
              // Update the bot message in real-time
              setMessages((prev) => 
                prev.map((msg) => 
                  msg.id === botMessageId 
                    ? { ...msg, text: assistantMessage }
                    : msg
                )
              );
            }
          } catch (parseError) {
            // Incomplete JSON, put it back and wait for more data
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush for any remaining buffered lines
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw || raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantMessage += content;
              setMessages((prev) => 
                prev.map((msg) => 
                  msg.id === botMessageId 
                    ? { ...msg, text: assistantMessage }
                    : msg
                )
              );
            }
          } catch { /* ignore partial leftovers */ }
        }
      }

      setIsLoading(false);
      
      // If the user is asking about properties, suggest showing an image
      if (
        input.toLowerCase().includes('property') || 
        input.toLowerCase().includes('house') || 
        input.toLowerCase().includes('villa') || 
        input.toLowerCase().includes('apartment') ||
        input.toLowerCase().includes('agricultural') ||
        input.toLowerCase().includes('farm') ||
        input.toLowerCase().includes('land')
      ) {
        setTimeout(() => {
          toast({
            title: "Tip",
            description: "Click the image button to see property visualizations",
          });
        }, 2000);
      }

    } catch (error) {
      console.error('Error in chat:', error);
      setIsLoading(false);
      
      // Enhanced error handling with specific messages
      let errorText = "I apologize, but I'm having trouble connecting right now. Please try again in a moment or contact us directly at aryan@rcbridge.co.";
      let toastTitle = "Connection Error";
      let toastDescription = "Please try again";
      
      if (error instanceof Error) {
        if (error.message.includes('429')) {
          errorText = "I'm currently handling many conversations. Please wait a moment and try again.";
          toastTitle = "High Traffic";
          toastDescription = "Please wait 30-60 seconds before trying again";
        } else if (error.message.includes('503')) {
          errorText = "The AI assistant is starting up. This takes about 20-30 seconds. Please try your message again shortly.";
          toastTitle = "AI Model Loading";
          toastDescription = "Please wait 20-30 seconds";
        } else if (error.message.includes('401') || error.message.includes('403')) {
          errorText = "There's a configuration issue with the AI service. Please contact support at aryan@rcbridge.co.";
          toastTitle = "Service Configuration Error";
          toastDescription = "Please contact support";
        }
      }
      
      toast({
        title: toastTitle,
        description: toastDescription,
        variant: "destructive"
      });
      
      const errorMessage: Message = {
        id: messages.length + 1,
        text: errorText,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    }
  };
  
  const handleGeneratePropertyImage = async () => {
    if (!imageGenReady || isGeneratingImage) return;
    
    setIsGeneratingImage(true);
    toast({
      title: "Generating Property Visualization",
      description: "Please wait while I create a property visualization for you...",
    });
    
    try {
      // Extract a description from recent messages
      const recentMessages = messages.slice(-3).map(msg => msg.text).join(' ');
      
      // Create a more targeted description for property visualization
      let propertyDescription = "Real estate property in Hyderabad";
      
      // Use mentioned location if available
      if (userMentionedLocation) {
        propertyDescription = `Property in ${userMentionedLocation}, Hyderabad`;
      }
      
      if (recentMessages.toLowerCase().includes('villa') || recentMessages.toLowerCase().includes('luxury')) {
        propertyDescription = `Luxury villa in ${userMentionedLocation || 'Hyderabad'} with garden and swimming pool`;
      } else if (recentMessages.toLowerCase().includes('apartment') || recentMessages.toLowerCase().includes('flat')) {
        propertyDescription = `Modern apartment in a high-rise building in ${userMentionedLocation || 'Hyderabad'}`;
      } else if (recentMessages.toLowerCase().includes('commercial') || recentMessages.toLowerCase().includes('office')) {
        propertyDescription = `Commercial building in ${userMentionedLocation || 'HITEC City'}, Hyderabad`;
      } else if (recentMessages.toLowerCase().includes('agricultural') || recentMessages.toLowerCase().includes('farm') || recentMessages.toLowerCase().includes('land')) {
        propertyDescription = `Agricultural land in ${userMentionedLocation || 'Hyderabad outskirts'} with green fields`;
      }
      
      const imageUrl = await generatePropertyImage(propertyDescription);
      
      if (imageUrl) {
        const imageMessage: Message = {
          id: messages.length,
          text: `Here's a visualization of a property in ${userMentionedLocation || 'Hyderabad'} based on our conversation:`,
          sender: 'bot',
          timestamp: new Date(),
          imageUrl: imageUrl,
          location: userMentionedLocation || undefined
        };
        
        setMessages((prev) => [...prev, imageMessage]);
        
        toast({
          title: "Visualization Ready",
          description: "I've created a property visualization for you",
        });
      } else {
        toast({
          title: "Visualization Failed",
          description: "I couldn't generate an image. Please try again with more specific details.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Error",
        description: "Failed to generate property visualization",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };
  
  const openInquiryForm = () => {
    // Pre-populate message with recent conversation
    const recentConversation = messages
      .slice(-3)
      .map(msg => `${msg.sender === 'user' ? 'Me' : 'Assistant'}: ${msg.text}`)
      .join('\n');
    
    setInquiryData(prev => ({
      ...prev,
      message: `Based on my conversation with the assistant:\n\n${recentConversation}\n\nI'd like to know more about:`,
    }));
    
    setShowInquiryForm(true);
  };
  
  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Store in localStorage for now (would go to a backend in production)
      const inquiries = JSON.parse(localStorage.getItem('userDetailedInquiries') || '[]');
      inquiries.push({
        ...inquiryData,
        timestamp: new Date().toISOString(),
        conversationHistory: messages.map(msg => ({
          text: msg.text,
          sender: msg.sender,
          timestamp: msg.timestamp.toISOString()
        }))
      });
      localStorage.setItem('userDetailedInquiries', JSON.stringify(inquiries));
      
      // Update user profile for personalized responses
      updateUserProfile({
        name: inquiryData.name,
        email: inquiryData.email,
        phone: inquiryData.phone
      });
      
      // Thank the user in the chat
      const botMessage: Message = {
        id: messages.length + 1,
        text: `Thank you, ${inquiryData.name}! We've received your inquiry and will contact you soon at ${inquiryData.email} or ${inquiryData.phone}.`,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      
      toast({
        title: "Inquiry Submitted",
        description: "Our team will get back to you shortly!",
      });
      
      setShowInquiryForm(false);
      
      // Reset form
      setInquiryData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
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
        text: "Hi there! I'm your RC Bridge real estate assistant. Ask me about properties, investments, or market trends!",
        sender: 'bot',
        timestamp: new Date(),
      }
    ]);
    clearConversationContext();
    localStorage.removeItem('chatMessages');
    toast({
      title: "Chat Cleared",
      description: "Starting a fresh conversation",
    });
  };

  return (
    <>
      {/* Chat button - positioned to not overlap with notification button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 rounded-full p-3 h-12 w-12 shadow-lg z-50 bg-accent hover:bg-accent/90"
        aria-label="Chat with us"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>

      {/* Chat window */}
      <div
        className={cn(
          "fixed bottom-36 right-4 w-80 md:w-96 z-50 transition-all duration-300 ease-in-out transform",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
        )}
      >
        <Card className="flex flex-col h-[500px] max-h-[70vh] overflow-hidden shadow-xl border-accent/20">
          {/* Chat header */}
          <div className="bg-accent text-accent-foreground p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <h3 className="font-medium">RC Bridge Assistant</h3>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 text-accent-foreground hover:text-accent-foreground/80"
                onClick={clearChat}
                title="Clear chat"
              >
                <ChevronDown size={18} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 text-accent-foreground hover:text-accent-foreground/80"
                onClick={() => setIsOpen(false)}
                title="Close chat"
              >
                <X size={18} />
              </Button>
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
            {!modelReady && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-accent" />
                  <p className="text-sm text-muted-foreground">Loading assistant...</p>
                </div>
              </div>
            )}

            {modelReady && messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "mb-3 flex gap-2",
                  message.sender === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={14} className="text-accent-foreground" />
                  </div>
                )}
                
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-3",
                    message.sender === 'user'
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  
                  {message.location && message.sender === 'bot' && (
                    <div className="mt-2 text-xs flex items-center text-primary">
                      <MapPin className="h-3 w-3 mr-1" />
                      {message.location.charAt(0).toUpperCase() + message.location.slice(1)}
                    </div>
                  )}
                  
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
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <User size={14} className="text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={14} className="text-accent-foreground" />
                </div>
                <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: '600ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Chat footer with input and buttons */}
          <div className="p-3 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
              <div className="flex-1 flex gap-2">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading || !modelReady}
                  className="flex-1"
                />
                
                {imageGenReady && (
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={handleGeneratePropertyImage}
                    disabled={isGeneratingImage || !imageGenReady}
                    className="flex-shrink-0"
                    title="Generate property visualization"
                  >
                    {isGeneratingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Image className="h-4 w-4" />}
                  </Button>
                )}
              </div>
              
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !modelReady || !input.trim()}
                className="bg-accent hover:bg-accent/90"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-sm"
              onClick={openInquiryForm}
            >
              Want to know more?
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Inquiry Form Dialog */}
      <Dialog open={showInquiryForm} onOpenChange={setShowInquiryForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request More Information</DialogTitle>
            <DialogDescription>
              Fill out this form and our team will get back to you shortly.
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
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone
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
                required
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
