
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageCircle, X, Send, Loader2, Image } from 'lucide-react';
import { initializeChatModel, generateResponse, initializeImageModel, generatePropertyImage } from '@/utils/chatbotUtils';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  imageUrl?: string;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Hi there! I'm your RC Bridge real estate assistant. Ask me about properties, investments, or market trends!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [imageGenReady, setImageGenReady] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
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
      
      if (imageReady) {
        toast({
          title: "AI Models Ready",
          description: "You can now generate property images and get real estate assistance",
        });
      }
    };
    loadModels();
  }, [toast]);

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
      const botResponse = await generateResponse(input.trim());
      
      const botMessage: Message = {
        id: messages.length + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      
      const errorMessage: Message = {
        id: messages.length + 1,
        text: "I'm sorry, I couldn't process your request. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGeneratePropertyImage = async () => {
    if (!imageGenReady || isGeneratingImage) return;
    
    setIsGeneratingImage(true);
    toast({
      title: "Generating Property Image",
      description: "Please wait while I create a custom property image for you...",
    });
    
    try {
      // Extract a description from recent messages
      const recentMessages = messages.slice(-3).map(msg => msg.text).join(' ');
      const propertyDescription = `Real estate property in Hyderabad: ${recentMessages}`;
      
      const imageUrl = await generatePropertyImage(propertyDescription);
      
      if (imageUrl) {
        const imageMessage: Message = {
          id: messages.length,
          text: "Here's a generated image based on our conversation:",
          sender: 'bot',
          timestamp: new Date(),
          imageUrl: imageUrl
        };
        
        setMessages((prev) => [...prev, imageMessage]);
        
        toast({
          title: "Image Generated",
          description: "I've created a property visualization for you",
        });
      } else {
        toast({
          title: "Image Generation Failed",
          description: "I couldn't generate an image. Please try again with more specific details.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Error",
        description: "Failed to generate property image",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingImage(false);
    }
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
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-accent-foreground hover:text-accent-foreground/80"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </Button>
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
                  "mb-3 max-w-[80%] rounded-lg p-3",
                  message.sender === 'user'
                    ? "ml-auto bg-accent text-accent-foreground"
                    : "mr-auto bg-muted"
                )}
              >
                <p className="text-sm">{message.text}</p>
                
                {message.imageUrl && (
                  <div className="mt-2 rounded-md overflow-hidden">
                    <img 
                      src={message.imageUrl} 
                      alt="Generated property" 
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
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <form onSubmit={handleSubmit} className="p-3 border-t">
            <div className="flex gap-2">
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
                    title="Generate property image"
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
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
