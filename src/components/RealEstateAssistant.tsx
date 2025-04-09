
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { EnhancedChatBot } from '@/components/EnhancedChatBot';
import { Bot, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function RealEstateAssistant() {
  const [showTip, setShowTip] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Show tip only if it hasn't been dismissed before
    const tipDismissed = localStorage.getItem('assistantTipDismissed');
    if (tipDismissed) {
      setShowTip(false);
    } else {
      // Show tip after 3 seconds
      setTimeout(() => {
        toast({
          title: "Need help finding your dream property?",
          description: "Chat with our real estate assistant Aryan for personalized recommendations.",
          action: (
            <Button 
              onClick={() => document.querySelector('[aria-label="Chat with us"]')?.dispatchEvent(new MouseEvent('click', {bubbles: true}))}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Chat Now
            </Button>
          ),
          duration: 10000,
        });
      }, 3000);
    }
  }, [toast]);

  const dismissTip = () => {
    setShowTip(false);
    localStorage.setItem('assistantTipDismissed', 'true');
  };

  return (
    <>
      <EnhancedChatBot />
      
      {showTip && (
        <Card className="max-w-md mx-auto mb-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Meet Aryan, Your Real Estate Assistant
            </CardTitle>
            <CardDescription>
              Get personalized property recommendations and market insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Aryan can help you find the perfect property, answer questions about locations, pricing, and financing options, and connect you with our expert agents.
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={() => document.querySelector('[aria-label="Chat with us"]')?.dispatchEvent(new MouseEvent('click', {bubbles: true}))}
                className="flex-1"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Chatting
              </Button>
              <Button 
                variant="outline" 
                onClick={dismissTip}
                className="flex-none"
              >
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
