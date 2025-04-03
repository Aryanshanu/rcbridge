import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send, Loader2, Bot, User, X, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { checkTableExists } from "@/utils/dbTableCheck";
import { detectLeadPotential } from "@/utils/chatIntentDetector";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  requirement: string;
}

export const AdvancedChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    requirement: "",
  });
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      checkTableExists('conversations', { 
        silent: true,
        customErrorMessage: "ChatBot functionality may be limited."
      }).then(exists => {
        if (!exists) {
          console.warn("Conversations table doesn't exist or cannot be accessed");
        }
      });

      setMessages([{
        id: '1',
        text: "Hi there! 👋 I'm Alex, your real estate assistant. How can I help you find your dream property today?",
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsSending(true);
    
    try {
      const conversationHistory = messages.slice(-4).map(msg => ({
        text: msg.text,
        sender: msg.sender
      }));
      
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: { 
          user_input: inputMessage,
          conversation_history: conversationHistory
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      const botMessage: Message = {
        id: Date.now().toString() + '-bot',
        text: data.bot_response || "I'm sorry, I couldn't process your request.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      if (data.metadata?.lead_potential || detectLeadPotential(inputMessage)) {
        setTimeout(() => {
          const suggestionMessage: Message = {
            id: Date.now().toString() + '-suggestion',
            text: "Would you like to schedule a viewing or speak with one of our agents? I can help connect you with the right person.",
            sender: 'bot',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, suggestionMessage]);
        }, 1500);
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
      
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        text: "I'm sorry, there was an error processing your message. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast.error("Error sending message", {
        description: "There was a problem connecting to the chatbot service."
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const openContactForm = () => {
    setShowContactForm(true);
  };

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const submitContactForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingForm(true);

    try {
      const { error } = await supabase.from('customer_inquiries').insert({
        name: contactForm.name,
        budget: "Not specified",
        property_type: "Not specified",
        location: "Not specified"
      });

      if (error) throw error;

      setShowContactForm(false);

      const confirmationMessage: Message = {
        id: Date.now().toString() + '-confirmation',
        text: `Thanks ${contactForm.name}! One of our agents will contact you soon at ${contactForm.phone || contactForm.email}. Is there anything else I can help you with in the meantime?`,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, confirmationMessage]);

      toast.success("Contact information submitted", {
        description: "An agent will contact you soon."
      });

      setContactForm({
        name: "",
        email: "",
        phone: "",
        requirement: ""
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Error submitting form", {
        description: "Please try again or contact us directly."
      });
    } finally {
      setIsSubmittingForm(false);
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
                <AvatarImage src="/assets/placeholders/agent-avatar.jpg" alt="Alex" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-primary-foreground">Alex</h3>
                <p className="text-xs text-primary-foreground/80">Real Estate Specialist</p>
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
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.sender === 'bot' && (
                      <div className="flex items-center mb-1 text-xs font-medium">
                        <Bot className="h-3 w-3 mr-1" />
                        Alex
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
            <div className="flex flex-col w-full gap-2">
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
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center gap-2 text-sm"
                onClick={openContactForm}
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Connect with an agent</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Contact an Agent</DialogTitle>
            <DialogDescription>
              Fill in your details and our agent will get back to you shortly.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitContactForm}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactFormChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={contactForm.email}
                  onChange={handleContactFormChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="phone" className="text-right text-sm font-medium">
                  Phone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleContactFormChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="requirement" className="text-right text-sm font-medium">
                  Requirement
                </label>
                <Input
                  id="requirement"
                  name="requirement"
                  value={contactForm.requirement}
                  onChange={handleContactFormChange}
                  className="col-span-3"
                  placeholder="What are you looking for?"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowContactForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmittingForm}>
                {isSubmittingForm ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
