import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  ChevronDown,
  User,
  Bot,
  MapPin,
  RefreshCw,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Rnd } from "react-rnd";
import { extractEntitiesWithNLP, prewarmNLP } from "@/utils/nlpExtraction";
import {
  initializeChatModel,
  getConversationContext,
  clearConversationContext,
  updateUserProfile,
  extractBudget,
  extractTimeline,
  extractLocations,
  addToConversationContext,
  loadConversationContext,
  updateContextWithMessage,
  loadContextEntities,
  type ChatEntities,
} from "@/utils/chatbotUtils";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { logActivity } from "@/utils/activityLogger";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
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
  const [input, setInput] = useState("");
  const [hasSeenWelcome, setHasSeenWelcome] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("chatbot-welcome-seen") === "true";
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Hi there! I'm your RC Bridge real estate assistant. Ask me about properties, investments, market trends, or agricultural land in Hyderabad!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState<InquiryData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [activeIntent, setActiveIntent] = useState<string | null>(null);
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);

  // Track extracted information
  const [extractedBudget, setExtractedBudget] = useState<string | null>(null);
  const [extractedLocation, setExtractedLocation] = useState<string | null>(null);
  const [extractedTimeline, setExtractedTimeline] = useState<string | null>(null);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [failureCount, setFailureCount] = useState(0);
  const [userMentionedLocation, setUserMentionedLocation] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string>(() => {
    const stored = localStorage.getItem("chat_conversation_id");
    return stored || crypto.randomUUID();
  });
  const [sessionId] = useState<string>(() => {
    // Generate or retrieve persistent session ID for anonymous users
    const stored = localStorage.getItem("chat_session_id");
    if (stored) return stored;
    const newSessionId = crypto.randomUUID();
    localStorage.setItem("chat_session_id", newSessionId);
    return newSessionId;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contextEntities, setContextEntities] = useState<ChatEntities>({});
  const [messageCount, setMessageCount] = useState(0);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Resizable chat window state
  const [chatWidth] = useState(400); // Locked width
  const [chatHeight, setChatHeight] = useState(() => {
    const saved = localStorage.getItem("chatbot-height");
    return saved ? parseInt(saved) : 600; // Default 600px
  });
  const [isMaximized, setIsMaximized] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  /**
   * POSITIONING SYSTEM
   * The chat window must be fixed to bottom-right corner.
   * - Uses windowDimensions state (updated on resize) for accurate positioning
   * - Normal: 24px from right, 88px from bottom (accounting for button)
   * - Maximized: 32px from right and bottom
   * - NEVER use window.innerWidth/innerHeight directly in JSX!
   */
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initializeChat = async () => {
      // Initialize chat model
      const chatReady = await initializeChatModel();
      setModelReady(chatReady);

      loadConversationContext();

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const userId = session?.user?.id || null;
        setIsAuthenticated(!!userId);

        // CRITICAL: Link anonymous conversation to authenticated user
        if (userId) {
          // First, check if there's an anonymous conversation with this sessionId
          const { data: anonymousConv } = await supabase
            .from("chat_conversations")
            .select("id")
            .eq("session_id", sessionId)
            .is("user_id", null)
            .maybeSingle();

          // If found, link it to the authenticated user
          if (anonymousConv) {
            await supabase
              .from("chat_conversations")
              .update({ user_id: userId })
              .eq("id", anonymousConv.id);

            // Use this conversation ID going forward
            setConversationId(anonymousConv.id);
            localStorage.setItem("chat_conversation_id", anonymousConv.id);
          }
        }

        // Load context entities from database
        const entities = await loadContextEntities(conversationId);
        setContextEntities(entities);
        if (entities.budget) setExtractedBudget(entities.budget);
        if (entities.location) setExtractedLocation(entities.location);
        if (entities.timeline) setExtractedTimeline(entities.timeline);

        // For authenticated users: try to load existing conversation
        if (userId) {
          const { data: existingConversation } = await supabase
            .from("chat_conversations")
            .select("id")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (existingConversation) {
            setConversationId(existingConversation.id);
            localStorage.setItem("chat_conversation_id", existingConversation.id);

            // Load existing messages
            const { data: dbMessages } = await supabase
              .from("chat_messages")
              .select("*")
              .eq("conversation_id", existingConversation.id)
              .order("created_at", { ascending: true });

            if (dbMessages && dbMessages.length > 0) {
              const mapped = dbMessages.map((m: any, idx: number) => ({
                id: idx,
                text: m.content,
                sender: m.sender_type === "user" ? "user" : "bot",
                timestamp: new Date(m.created_at),
              })) as Message[];
              setMessages(mapped);

              // Extract info from user messages
              for (const msg of mapped) {
                if (msg.sender === "user") {
                  const b = extractBudget(msg.text);
                  const t = extractTimeline(msg.text);
                  const locs = extractLocations(msg.text);
                  if (b && !extractedBudget) setExtractedBudget(b);
                  if (t && !extractedTimeline) setExtractedTimeline(t);
                  if (locs.length > 0 && !extractedLocation) setExtractedLocation(locs[0]);
                }
              }
            }
            return;
          }
        }

        // Use upsert instead of insert to avoid duplicate key errors
        // Include session_id for anonymous users to enable proper data isolation
        const { error } = await supabase.from("chat_conversations").upsert(
          [
            {
              id: conversationId,
              user_id: userId,
              session_id: userId ? null : sessionId, // Only set session_id for anonymous users
            },
          ],
          {
            onConflict: "id",
            ignoreDuplicates: false,
          },
        );

        if (error) {
          // Error persisting conversation - continue in ephemeral mode silently
        } else {
          localStorage.setItem("chat_conversation_id", conversationId);
        }
      } catch (error) {
        // Fallback to ephemeral session
        const ephemeralId = crypto.randomUUID();
        setConversationId(ephemeralId);
        localStorage.setItem("chat_conversation_id", ephemeralId);
      }

      // Pre-warm the edge function for faster first response
      try {
        await fetch(`https://hchtekfbtcbfsfxkjyfi.functions.supabase.co/chat-assistant?health=1`);
        console.log("Chat assistant pre-warmed");
      } catch (e) {
        // Ignore pre-warming errors
      }

      // Pre-warm NLP model in background
      prewarmNLP();
    };

    initializeChat();
  }, [toast]);

  // Window resize listener for accurate positioning
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // removed localStorage persistence of messages

  useEffect(() => {
    // Scroll to the bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Focus the input when the chat is opened
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  /**
   * SMART SUGGESTIONS ALGORITHM
   * Generates contextual button options based on:
   * 1. activeIntent (buy/sell/rent/trends)
   * 2. Missing entities in contextEntities
   * 3. Property type (commercial vs residential)
   *
   * Priority order ensures logical conversation flow.
   * Commercial properties → sq ft options
   * Residential properties → BHK options
   */
  const generateSmartSuggestions = (lastMessage: string, entities: any) => {
    const suggestions: string[] = [];

    // For buying/investing - sequential flow
    if (activeIntent === "buy" || activeIntent === "invest") {
      // Priority 1: Budget
      if (!entities.budget) {
        suggestions.push("₹50L - ₹1Cr", "₹1Cr - ₹2Cr", "₹2Cr+", "Custom budget");
        setSmartSuggestions(suggestions);
        return;
      }
      // Priority 2: Property type
      if (!entities.property_type) {
        suggestions.push("🏢 Apartment", "🏡 Villa", "🏠 Independent House", "🏗️ Commercial");
        setSmartSuggestions(suggestions);
        return;
      }
      // Priority 3: Location (Pocharam FIRST)
      if (!entities.location) {
        suggestions.push("📍 Pocharam", "📍 Uppal", "📍 Gachibowli", "📍 Jubilee Hills", "📍 Financial District", "📍 Other");
        setSmartSuggestions(suggestions);
        return;
      }
      // Priority 4: Size/Bedrooms - property-type aware
      if (!entities.size && !entities.bedrooms) {
        const propertyType = entities.property_type?.toLowerCase() || "";
        if (propertyType.includes("commercial")) {
          suggestions.push("500-1000 sq ft", "1000-2000 sq ft", "2000-5000 sq ft", "5000+ sq ft", "Custom size");
        } else {
          suggestions.push("1 BHK", "2 BHK", "3 BHK", "4+ BHK");
        }
        setSmartSuggestions(suggestions);
        return;
      }
    }

    // For selling - complete sequential flow
    if (activeIntent === "sell") {
      // Priority 1: Property type
      if (!entities.property_type) {
        suggestions.push("🏢 Apartment", "🏡 Villa", "🏠 Independent House", "🏗️ Commercial");
        setSmartSuggestions(suggestions);
        return;
      }
      // Priority 2: Location (Pocharam FIRST)
      if (!entities.location) {
        suggestions.push("📍 Pocharam", "📍 Uppal", "📍 Gachibowli", "📍 Jubilee Hills", "📍 Financial District", "📍 Other");
        setSmartSuggestions(suggestions);
        return;
      }
      // Priority 3: Size - property-type aware
      if (!entities.size && !entities.bedrooms) {
        const propertyType = entities.property_type?.toLowerCase() || "";
        if (propertyType.includes("commercial")) {
          suggestions.push("500-1000 sq ft", "1000-2000 sq ft", "2000-5000 sq ft", "5000+ sq ft");
        } else {
          suggestions.push("1 BHK", "2 BHK", "3 BHK", "4+ BHK");
        }
        setSmartSuggestions(suggestions);
        return;
      }
      // Priority 4: Budget/Price
      if (!entities.budget) {
        suggestions.push("₹50L - ₹1Cr", "₹1Cr - ₹2Cr", "₹2Cr - ₹5Cr", "₹5Cr+", "Custom price");
        setSmartSuggestions(suggestions);
        return;
      }
    }

    // For renting
    if (activeIntent === "rent" && !entities.timeline) {
      suggestions.push("Short-term (< 6 months)", "Long-term (6+ months)");
      setSmartSuggestions(suggestions);
      return;
    }

    // For trends (Pocharam FIRST)
    if (activeIntent === "trends" && !entities.location) {
      suggestions.push("📍 Pocharam", "📍 Uppal", "📍 Gachibowli", "📍 Jubilee Hills", "📍 Financial District", "📍 Tellapur");
      setSmartSuggestions(suggestions);
      return;
    }

    // Clear suggestions if all info collected
    setSmartSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent, isProgrammatic = false) => {
    e.preventDefault();

    // Only stop propagation for user-initiated submissions
    if (!isProgrammatic) {
      e.stopPropagation();
    }

    // Prevent scroll-to-input behavior
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    if (!input.trim() || isLoading) return;

    // 3-second cooldown between messages
    const now = Date.now();
    if (now - lastSubmitTime < 3000) {
      return;
    }
    setLastSubmitTime(now);

    const userMessage = input.trim();

    // Check anonymous message limit (increased to 6-7 messages)
    if (!isAuthenticated && messageCount >= 6) {
      setShowAuthPrompt(true);
      return;
    }

    setInput("");
    setShowQuickReplies(false);
    setSmartSuggestions([]); // Clear old suggestions when user sends a message
    setRetryCount(0);

    // Increment message count for anonymous users
    if (!isAuthenticated) {
      setMessageCount((prev) => prev + 1);
    }

    // Extract information from user message using both regex and NLP
    const budget = extractBudget(userMessage);
    const timeline = extractTimeline(userMessage);
    const locations = extractLocations(userMessage);

    // Enhanced extraction with NLP
    const nlpEntities = await extractEntitiesWithNLP(userMessage);

    // Update extracted entities with both regex and NLP results
    if (budget && !extractedBudget) setExtractedBudget(budget);
    if (nlpEntities.budget && !extractedBudget) setExtractedBudget(nlpEntities.budget);

    if (timeline && !extractedTimeline) setExtractedTimeline(timeline);
    if (nlpEntities.timeline && !extractedTimeline) setExtractedTimeline(nlpEntities.timeline);

    if (locations.length > 0) {
      setExtractedLocation(locations[0]);
      setUserMentionedLocation(locations[0]);
    } else if (nlpEntities.location) {
      setExtractedLocation(nlpEntities.location);
      setUserMentionedLocation(nlpEntities.location);
    }

    // Normalize propertyType to property_type for consistency
    const normalizedPropertyType = (nlpEntities.propertyType || contextEntities.property_type || "").toString().toLowerCase();
    
    // Update context entities with NLP extraction + active intent
    const updatedContextEntities = {
      ...contextEntities,
      ...nlpEntities,
      property_type: normalizedPropertyType || contextEntities.property_type,
      intent: activeIntent || contextEntities.intent,
      budget: nlpEntities.budget || budget || contextEntities.budget,
      location: nlpEntities.location || locations[0] || contextEntities.location,
      timeline: nlpEntities.timeline || timeline || contextEntities.timeline,
      bedrooms: nlpEntities.bedrooms || contextEntities.bedrooms,
      size: contextEntities.size, // preserve existing size
    };
    setContextEntities(updatedContextEntities);

    const newUserMessage: Message = {
      id: messages.length,
      text: userMessage,
      sender: "user",
      timestamp: new Date(),
      location: locations[0] || undefined,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    addToConversationContext("user", userMessage);

    // Update context with new message
    await updateContextWithMessage(conversationId, userMessage, "user");

    // Log activity - first message or subsequent message
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (messageCount === 0) {
      // First message - log conversation start
      await logActivity(
        'chat_conversation',
        {
          conversation_id: conversationId,
          message: userMessage,
          entities: updatedContextEntities,
          session_id: !userId ? sessionId : undefined,
        },
        {
          customer_id: userId,
          customer_email: session?.user?.email,
          customer_name: session?.user?.user_metadata?.full_name,
        }
      );
    } else {
      // Subsequent message
      await logActivity(
        'chat_conversation',
        {
          conversation_id: conversationId,
          message: userMessage,
          entities: updatedContextEntities,
        },
        {
          customer_id: userId,
          customer_email: session?.user?.email,
        }
      );
    }

    // Generate smart suggestions based on updated context
    generateSmartSuggestions(userMessage, updatedContextEntities);

    // Check if user should be prompted to sign in (after 6-7 messages for anonymous users)
    if (!isAuthenticated) {
      const newCount = messageCount + 1;
      setMessageCount(newCount);
      if (newCount >= 6) {
        setShowAuthPrompt(true);
      }
    }

    setIsLoading(true);

    try {
      // Save user message to database (works for both anon and auth with new RLS)
      if (conversationId) {
        const { error: userMsgError } = await supabase.from("chat_messages").insert([
          {
            conversation_id: conversationId,
            sender_type: "user",
            content: userMessage,
            message_type: "text",
          },
        ]);

        if (userMsgError) {
          // Failed to persist user message - continue anyway
        }
      }

      // Prepare conversation history for AI (last 12 messages for context, optimized)
      const conversationHistory = [...messages, newUserMessage]
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        }))
        .slice(-12);

      // Prepare context summary from updated entities
      const contextSummary = Object.entries(updatedContextEntities)
        .filter(([_, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");

      // Robust fetch with retry logic
      const attemptFetch = async (attempt: number): Promise<Response> => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);

        let firstChunkReceived = false;
        const connectingTimeoutId = setTimeout(() => {
          if (!firstChunkReceived) {
            setIsConnecting(true);
          }
        }, 5000);

        try {
          const response = await fetch(`https://hchtekfbtcbfsfxkjyfi.functions.supabase.co/chat-assistant`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: conversationHistory,
              context: contextSummary,
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);
          clearTimeout(connectingTimeoutId);
          setIsConnecting(false);

          if (!response.ok) {
            if (response.status === 429) {
              const retryAfter = response.headers.get("Retry-After");
              const waitSeconds = retryAfter ? parseInt(retryAfter) : 60;
              throw new Error(`RATE_LIMIT:${waitSeconds}`);
            }
            if (response.status === 402) {
              throw new Error("CREDITS_EXHAUSTED:AI credits exhausted. Please try again later.");
            }
            if (response.status === 400) {
              try {
                const errorData = await response.json();
                throw new Error(
                  `BAD_REQUEST:${errorData.details || "Your message is too long. Please shorten to under 700 characters."}`,
                );
              } catch (e) {
                throw new Error("BAD_REQUEST:Your message is too long. Please shorten to under 700 characters.");
              }
            }
            if (response.status >= 500) {
              throw new Error("SERVER_ERROR:AI service temporarily unavailable. Try again.");
            }

            throw new Error(`HTTP error! status: ${response.status}`);
          }

          return response;
        } catch (error) {
          clearTimeout(timeoutId);
          clearTimeout(connectingTimeoutId);
          setIsConnecting(false);

          if (error instanceof Error) {
            const errorMsg = error.message;

            // Retry for server errors
            if (errorMsg.startsWith("SERVER_ERROR:") && attempt < 2) {
              const delay = attempt === 0 ? 600 : 1200;
              await new Promise((resolve) => setTimeout(resolve, delay));
              return attemptFetch(attempt + 1);
            }
          }

          throw error;
        }
      };

      const response = await attemptFetch(0);

      if (!response.body) {
        throw new Error("Response body is null");
      }

      // Sanitizer to remove function call tags and CONTEXT blocks from model output
      const sanitizeModelContent = (text: string): string => {
        let sanitized = text.replace(/<function[^>]*>[\s\S]*?<\/function>/gi, "");
        // Remove any CONTEXT: blocks that might leak (case-insensitive, multiline)
        sanitized = sanitized.replace(/(^|\n)\s*context:\s*[\s\S]*?(?=(\n{2,}|\n[A-Z]|$))/gi, "$1").trim();
        return sanitized;
      };

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
        sender: "bot",
        timestamp: new Date(),
        location: locations[0] || undefined,
      };
      setMessages((prev) => [...prev, botMessage]);

      let firstChunkReceived = false;
      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;

        if (!firstChunkReceived) {
          firstChunkReceived = true;
          setIsConnecting(false);
        }

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
              // Sanitize content before adding to message
              const sanitizedContent = sanitizeModelContent(content);
              assistantMessage += sanitizedContent;
              // Update the bot message in real-time
              setMessages((prev) =>
                prev.map((msg) => (msg.id === botMessageId ? { ...msg, text: assistantMessage } : msg)),
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
              // Sanitize content before adding to message
              const sanitizedContent = sanitizeModelContent(content);
              assistantMessage += sanitizedContent;
              setMessages((prev) =>
                prev.map((msg) => (msg.id === botMessageId ? { ...msg, text: assistantMessage } : msg)),
              );
            }
          } catch {
            /* ignore partial leftovers */
          }
        }
      }

      // Final sanitization pass on complete message
      assistantMessage = sanitizeModelContent(assistantMessage);

      // Add to conversation context
      addToConversationContext("assistant", assistantMessage);

      // Persist assistant message
      try {
        if (conversationId && assistantMessage.trim()) {
          console.log("💾 Persisting assistant message:", {
            conversation_id: conversationId,
            content_length: assistantMessage.length,
            content_preview: assistantMessage.substring(0, 100)
          });
          
          const { data, error } = await supabase.from("chat_messages").insert({
            conversation_id: conversationId,
            sender_type: "assistant",
            content: assistantMessage,
            message_type: "text",
          });
          
          if (error) {
            console.error("❌ Failed to persist assistant message:", error);
            console.error("Error details:", JSON.stringify(error, null, 2));
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to save conversation"
            });
          } else {
            console.log("✅ Assistant message saved successfully");
          }
        } else {
          console.warn("⚠️ Skipping assistant message persist:", {
            hasConversationId: !!conversationId,
            messageLength: assistantMessage.length
          });
        }
      } catch (dbErr: any) {
        console.error("❌ Exception persisting assistant message:", dbErr);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error saving conversation: " + (dbErr.message || "Unknown error")
        });
      }

      setIsLoading(false);
      setFailureCount(0); // Reset failure count on success
      
      // Regenerate smart suggestions after assistant responds
      generateSmartSuggestions(assistantMessage, updatedContextEntities);

      // If the user is asking about properties, suggest showing an image
      if (
        userMessage.toLowerCase().includes("property") ||
        userMessage.toLowerCase().includes("house") ||
        userMessage.toLowerCase().includes("villa") ||
        userMessage.toLowerCase().includes("apartment") ||
        userMessage.toLowerCase().includes("agricultural") ||
        userMessage.toLowerCase().includes("farm") ||
        userMessage.toLowerCase().includes("land")
      ) {
        // Property type detected - no toast needed
      }
    } catch (error: any) {
      // Chat assistant error - show user-friendly message
      setFailureCount((prev) => prev + 1);
      setIsLoading(false);

      // Enhanced error handling with specific messages
      let errorText = "I apologize, but I'm having trouble connecting right now.";
      let toastTitle = "Connection Error";
      let toastDescription = "Please try again";

      // Check for specific error codes
      if (error.message?.includes("429")) {
        errorText =
          "Our AI assistant is currently at capacity. Please try again in a few moments, or use the 'Want to know more?' button to submit your inquiry directly.";
        toastTitle = "High Traffic";
        toastDescription = "Please wait 30-60 seconds before trying again";
      } else if (error.message?.includes("503")) {
        errorText =
          "The AI model is currently loading. This takes about 20-30 seconds. Please try your message again shortly.";
        toastTitle = "AI Model Loading";
        toastDescription = "Please wait 20-30 seconds";
      } else if (error.message?.includes("401") || error.message?.includes("403")) {
        errorText =
          "Our AI assistant is temporarily unavailable due to a configuration issue. Please contact support at aryan@rcbridge.co";
        toastTitle = "Service Configuration Error";
        toastDescription = "Please contact support";
      } else if (failureCount >= 2) {
        // After 3 failures, offer alternatives
        errorText =
          "I apologize for the technical difficulty. Here are some ways to continue:\n\n📧 Email: aryan@rcbridge.co\n📝 Fill the inquiry form below\n🔄 Try asking in a different way\n\nWhat works best for you?";
        toastTitle = "Service Unavailable";
        toastDescription = "Multiple connection attempts failed";
      }

      toast({
        title: toastTitle,
        description: toastDescription,
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: messages.length + 1,
        text: errorText,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // Image generation feature has been disabled per user request

  const openInquiryForm = async () => {
    // Load latest context
    const entities = await loadContextEntities(conversationId);

    // Get user profile if authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;

    // Pre-populate form with context and user data
    const recentConversation = messages
      .slice(-3)
      .map((msg) => `${msg.sender === "user" ? "Me" : "Assistant"}: ${msg.text}`)
      .join("\n");

    let requirementText = "";
    if (entities.budget) requirementText += `Budget: ${entities.budget}\n`;
    if (entities.location) requirementText += `Location: ${entities.location}\n`;
    if (entities.property_type) requirementText += `Property Type: ${entities.property_type}\n`;
    if (entities.size) requirementText += `Size: ${entities.size}\n`;
    if (entities.timeline) requirementText += `Timeline: ${entities.timeline}\n`;
    requirementText += `\n${recentConversation}\n\nI'd like to know more about:`;

    setInquiryData({
      name: entities.name || user?.user_metadata?.full_name || "",
      email: entities.email || user?.email || "",
      phone: entities.phone || "",
      message: requirementText,
    });

    setShowInquiryForm(true);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inquiryData.name || !inquiryData.email) {
      toast({
        title: "Missing Information",
        description: "Please provide at least your name and email",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        conversation_id: conversationId,
        session_id: sessionId,
        name: inquiryData.name,
        email: inquiryData.email,
        phone: inquiryData.phone || null,
        requirements: inquiryData.message || null,
      };

      console.log("=== SUBMITTING CHAT INFO ===");
      console.log("Conversation ID:", conversationId);
      console.log("Session ID:", sessionId);
      console.log("Payload:", JSON.stringify(payload, null, 2));
      console.log("Function URL:", `https://hchtekfbtcbfsfxkjyfi.supabase.co/functions/v1/submit-chat-info`);

      const { data, error } = await supabase.functions.invoke("submit-chat-info", {
        body: payload,
      });

      console.log("=== RESPONSE RECEIVED ===");
      console.log("Data:", data);
      console.log("Error:", error);

      if (error) {
        console.error("❌ Supabase function returned error:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        console.error("Error message:", error.message);
        console.error("Error context:", error.context);
        throw error;
      }

      console.log("✅ Chat info submitted successfully:", data);

      toast({
        title: "Information Submitted",
        description: "Thank you! We'll get back to you soon.",
      });

      setShowInquiryForm(false);
      setInquiryData({ name: "", email: "", phone: "", message: "" });

      // Add confirmation message to chat
      const confirmationMessage: Message = {
        id: messages.length + 1,
        text: "Thank you for providing your information! Our team will reach out to you shortly to discuss your requirements in detail.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, confirmationMessage]);
    } catch (error: any) {
      console.error("Error submitting inquiry:", error);
      toast({
        title: "Submission Failed",
        description: error?.message || "There was an error submitting your information. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearChat = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;

      const newConvId = crypto.randomUUID();

      const { error } = await supabase.from("chat_conversations").upsert([{ id: newConvId, user_id: userId }], {
        onConflict: "id",
        ignoreDuplicates: false,
      });

      if (error) {
        console.error("Failed to upsert new conversation on clear:", error);
      }

      setConversationId(newConvId);
      localStorage.setItem("chat_conversation_id", newConvId);
    } catch (e) {
      console.error("Failed to create new conversation on clear:", e);
      toast({
        title: "Chat Cleared",
        description: "Starting fresh in ephemeral mode",
        variant: "default",
      });
    }

    setMessages([
      {
        id: 0,
        text: "Hi there! I'm your RC Bridge real estate assistant. Ask me about properties, investments, or market trends!",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
    clearConversationContext();
    setExtractedBudget(null);
    setExtractedLocation(null);
    setExtractedTimeline(null);
    setShowQuickReplies(true);
    setActiveIntent(null);
    setFailureCount(0);
    setUserMentionedLocation(null);
    setContextEntities({});
    setSmartSuggestions([]);
    // Chat cleared silently
  };

  const handleQuickReply = (message: string) => {
    setInput(message);
    setShowQuickReplies(false);

    // Create synthetic event for programmatic submission
    setTimeout(() => {
      if (inputRef.current?.form) {
        const submitEvent = new Event("submit", { bubbles: true, cancelable: true }) as any;
        Object.defineProperty(submitEvent, "target", {
          writable: false,
          value: inputRef.current.form,
        });
        handleSubmit(submitEvent, true); // Mark as programmatic
      }
    }, 100);
  };

  return (
    <div>
      {/* Authentication Prompt Dialog */}
      <Dialog open={showAuthPrompt} onOpenChange={setShowAuthPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in to continue</DialogTitle>
            <DialogDescription>
              To provide you with personalized recommendations and track your conversations, we'd like you to sign in.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 flex flex-col gap-4">
            <p className="text-sm text-gray-600">Creating an account helps us:</p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Save your conversation history</li>
              <li>Provide personalized property recommendations</li>
              <li>Send updates about properties you're interested in</li>
            </ul>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAuthPrompt(false)}>
                Continue without signing in
              </Button>
              <Button onClick={() => (window.location.href = "/login")}>Sign In / Sign Up</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Welcome Banner for First-Time Visitors */}
      {!hasSeenWelcome && !isOpen && (
        <div
          onClick={() => {
            setHasSeenWelcome(true);
            localStorage.setItem("chatbot-welcome-seen", "true");
            setIsOpen(true);
          }}
          className="fixed bottom-6 right-6 z-50 cursor-pointer group animate-fade-in"
        >
          <Card className="p-6 shadow-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/10 hover:border-primary/50 transition-all duration-300 hover:scale-105 max-w-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                <MessageCircle size={28} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">We welcome you! 👋</h3>
                <p className="text-sm text-muted-foreground mb-2">I am your assistant</p>
                <p className="text-xs font-mono text-primary/70">- Aryan→</p>
              </div>
            </div>
            <div className="mt-4 text-xs text-center text-muted-foreground animate-pulse">
              Click anywhere to start chatting
            </div>
          </Card>
        </div>
      )}

      {/* Chat window - fixed to bottom-right, resizable only */}
      {isOpen && (
        <div
          className="fixed z-[60]"
          style={{
            right: isMaximized ? 32 : 24,
            bottom: isMaximized ? 32 : 88,
            width: isMaximized ? Math.min(windowDimensions.width * 0.72, 980) : chatWidth,
            height: isMaximized ? Math.min(windowDimensions.height * 0.78, 880) : chatHeight,
          }}
        >
          <Rnd
            size={{ width: "100%", height: "100%" }}
            position={{ x: 0, y: 0 }}
            onResizeStop={(e, direction, ref) => {
              if (!isMaximized) {
                const newHeight = parseInt(ref.style.height);
                setChatHeight(newHeight);
                localStorage.setItem("chatbot-height", newHeight.toString());
              }
            }}
            minWidth={320}
            minHeight={400}
            maxWidth={600}
            maxHeight={Math.min(windowDimensions.height - 120, 900)}
            enableResizing={{
              bottom: !isMaximized,
            }}
            disableDragging={true}
            className="w-full h-full"
          >
            <Card className="flex flex-col h-full w-full overflow-hidden shadow-xl border-accent/20 bg-card">
              {/* Chat header */}
              <div className="flex flex-col border-b bg-accent text-accent-foreground">
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <MessageCircle size={20} />
                    <h3 className="font-medium">RC Bridge Assistant</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-accent-foreground hover:text-accent-foreground/80"
                      onClick={() => {
                        setIsMaximized(!isMaximized);
                      }}
                      title={isMaximized ? "Restore size" : "Maximize"}
                    >
                      {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-accent-foreground hover:text-accent-foreground/80"
                      onClick={clearChat}
                      title="Clear chat"
                    >
                      <RefreshCw size={16} />
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
              </div>

              {/* Context badges - show extracted entities */}
              {(contextEntities.budget || contextEntities.property_type || contextEntities.location || contextEntities.size || contextEntities.bedrooms) && (
                <div className="px-3 py-2 border-b bg-muted/30 flex flex-wrap gap-2">
                  {contextEntities.budget && (
                    <Badge variant="secondary" className="text-xs">
                      💰 {contextEntities.budget}
                    </Badge>
                  )}
                  {contextEntities.property_type && (
                    <Badge variant="secondary" className="text-xs">
                      🏢 {contextEntities.property_type}
                    </Badge>
                  )}
                  {contextEntities.location && (
                    <Badge variant="secondary" className="text-xs">
                      📍 {contextEntities.location}
                    </Badge>
                  )}
                  {(contextEntities.size || contextEntities.bedrooms) && (
                    <Badge variant="secondary" className="text-xs">
                      📐 {contextEntities.size || contextEntities.bedrooms}
                    </Badge>
                  )}
                </div>
              )}

              {/* Chat messages */}
              <div className="chatbot-messages flex-1 p-3 overflow-y-auto bg-background overscroll-contain">
                {!modelReady && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-accent" />
                      <p className="text-sm text-muted-foreground">Loading assistant...</p>
                    </div>
                  </div>
                )}

                {modelReady &&
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn("mb-3 flex gap-2", message.sender === "user" ? "justify-end" : "justify-start")}
                    >
                      {message.sender === "bot" && (
                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot size={14} className="text-accent-foreground" />
                        </div>
                      )}

                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg p-3",
                          message.sender === "user" ? "bg-accent text-accent-foreground" : "bg-muted",
                        )}
                      >
                        <p className="text-sm whitespace-pre-line">{message.text}</p>

                        {message.location && message.sender === "bot" && (
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
                                (e.target as HTMLImageElement).src = "/placeholder.svg";
                              }}
                            />
                          </div>
                        )}

                        <p className="text-xs opacity-70 mt-1 text-right">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>

                      {message.sender === "user" && (
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
                        <div
                          className="w-2 h-2 rounded-full bg-accent/60 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-accent/60 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-accent/60 animate-bounce"
                          style={{ animationDelay: "600ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat footer with quick replies and input */}
              <div className="p-3 border-t">
                {/* Intent Selection Buttons - only show initially */}
                {showQuickReplies && (
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <Button
                      size="sm"
                      variant={activeIntent === "buy" ? "default" : "outline"}
                      onClick={() => {
                        setActiveIntent("buy");
                        handleQuickReply("I want to buy a property");
                      }}
                      className="flex-1 min-w-[90px]"
                    >
                      🏠 Buy
                    </Button>
                    <Button
                      size="sm"
                      variant={activeIntent === "sell" ? "default" : "outline"}
                      onClick={() => {
                        setActiveIntent("sell");
                        handleQuickReply("I want to sell my property");
                      }}
                      className="flex-1 min-w-[90px]"
                    >
                      💰 Sell
                    </Button>
                    <Button
                      size="sm"
                      variant={activeIntent === "rent" ? "default" : "outline"}
                      onClick={() => {
                        setActiveIntent("rent");
                        handleQuickReply("I want to rent a property");
                      }}
                      className="flex-1 min-w-[90px]"
                    >
                      🏘️ Rent
                    </Button>
                    <Button
                      size="sm"
                      variant={activeIntent === "trends" ? "default" : "outline"}
                      onClick={() => {
                        setActiveIntent("trends");
                        handleQuickReply("Show me market trends");
                      }}
                      className="flex-1 min-w-[90px]"
                    >
                      📈 Trends
                    </Button>
                  </div>
                )}

                {/* Smart Suggestions */}
                {smartSuggestions.length > 0 && (
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {smartSuggestions.map((suggestion, idx) => (
                      <Button
                        key={idx}
                        size="sm"
                        variant="secondary"
                        onClick={() => handleQuickReply(suggestion)}
                        className="text-xs"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading || !modelReady}
                    maxLength={700}
                    className="flex-1 chatbot-input"
                  />

                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !modelReady || !input.trim()}
                    className="bg-accent hover:bg-accent/90"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>

                <Button variant="outline" size="sm" className="w-full text-sm" onClick={openInquiryForm}>
                  Want to know more?
                </Button>
              </div>
            </Card>
          </Rnd>
        </div>
      )}

      {/* Inquiry Form Dialog */}
      <Dialog open={showInquiryForm} onOpenChange={setShowInquiryForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request More Information</DialogTitle>
            <DialogDescription>Fill out this form and our team will get back to you shortly.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleInquirySubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={inquiryData.name}
                onChange={(e) => setInquiryData((prev) => ({ ...prev, name: e.target.value }))}
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
                onChange={(e) => setInquiryData((prev) => ({ ...prev, email: e.target.value }))}
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
                onChange={(e) => setInquiryData((prev) => ({ ...prev, phone: e.target.value }))}
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
                onChange={(e) => setInquiryData((prev) => ({ ...prev, message: e.target.value }))}
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

      {/* Floating chat button - only show if welcome banner was already seen */}
      {hasSeenWelcome && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 rounded-full p-5 h-18 w-18 shadow-lg z-50 bg-accent hover:bg-accent/90"
                aria-label="Assistant"
              >
                {isOpen ? <X size={36} /> : <MessageCircle size={36} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" align="center">
              <p>Assistant</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
