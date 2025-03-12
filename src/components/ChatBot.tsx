
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { initializeChatModel, generateResponse } from '@/utils/chatbotUtils';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize the model when the component mounts
    const loadModel = async () => {
      const ready = await initializeChatModel();
      setModelReady(ready);
    };
    loadModel();
  }, []);

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

  return (
    <>
      {/* Chat button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 rounded-full p-3 h-12 w-12 shadow-lg z-50"
        aria-label="Chat with us"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>

      {/* Chat window */}
      <div
        className={cn(
          "fixed bottom-20 right-4 w-80 md:w-96 z-50 transition-all duration-300 ease-in-out transform",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
        )}
      >
        <Card className="flex flex-col h-[500px] max-h-[70vh] overflow-hidden shadow-xl">
          {/* Chat header */}
          <div className="bg-primary text-primary-foreground p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <h3 className="font-medium">RC Bridge Assistant</h3>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:text-primary-foreground/80"
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
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
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
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "mr-auto bg-muted"
                )}
              >
                <p className="text-sm">{message.text}</p>
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
              <Input
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading || !modelReady}
                className="flex-1"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !modelReady || !input.trim()}
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
