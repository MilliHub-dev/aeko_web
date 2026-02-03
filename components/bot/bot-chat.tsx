"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Send, Settings, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  createdAt: string;
}

export function BotChat({ onOpenSettings, chatId }: { onOpenSettings: () => void; chatId?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<{ botPersonality: string } | null>(null);

  useEffect(() => {
    // Fetch settings to get personality
    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/enhanced-bot/settings");
            if (res.ok) {
                const data = await res.json();
                setSettings({
                    botPersonality: data.botPersonality ?? data.personality ?? "friendly"
                });
            }
        } catch (error) {
            console.error("Failed to fetch bot settings", error);
        }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    // Fetch history
    const fetchHistory = async () => {
      try {
        // If specific chatId is provided, we might want to handle history differently
        // For now, we'll keep the global history or maybe skip it if it's context-specific?
        // Assuming global history for now unless we have a specific endpoint
        if (!chatId) {
            const res = await fetch("/api/enhanced-bot/conversation-history");
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data.messages)) {
                setMessages(data.messages);
              }
            }
        }
      } catch (error) {
        console.error("Failed to load bot history", error);
      }
    };
    fetchHistory();
  }, [chatId]);

  useEffect(() => {
    if (scrollBottomRef.current) {
      scrollBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const tempId = Date.now().toString();
    const userMsg: Message = {
      id: tempId,
      role: "user",
      content: inputValue,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      let res;
      const personality = settings?.botPersonality || "friendly";

      if (chatId) {
        // Use Contextual Bot Endpoint
        res = await fetch("/api/enhanced-chat/bot-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                message: userMsg.content,
                chatId,
                personality 
            }),
        });
      } else {
        // Use Standalone Bot Endpoint
        res = await fetch("/api/enhanced-bot/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                message: userMsg.content,
                personalityOverride: personality
            }),
        });
      }

      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();
      const botMsg: Message = {
        id: data.id || Date.now().toString(),
        role: "bot",
        content: data.reply || data.message || "I didn't understand that.",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      // Optional: Add error message to chat
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 bg-primary/10">
            <AvatarImage src="/bot-avatar.png" />
            <AvatarFallback><Bot size={16} /></AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm">Aeko Bot</h3>
            <p className="text-xs text-muted-foreground">Always here to help</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onOpenSettings}>
          <Settings size={18} />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-8">
              No messages yet. Say hello!
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-2 max-w-[80%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <Avatar className="h-8 w-8 mt-1 shrink-0">
                <AvatarFallback className={msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}>
                  {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "p-3 rounded-lg text-sm",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted text-foreground rounded-tl-none"
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex gap-2 max-w-[80%] mr-auto">
               <Avatar className="h-8 w-8 mt-1 shrink-0">
                 <AvatarFallback className="bg-muted"><Bot size={14} /></AvatarFallback>
               </Avatar>
               <div className="p-3 rounded-lg bg-muted rounded-tl-none">
                 <Loader2 className="h-4 w-4 animate-spin" />
               </div>
             </div>
          )}
          <div ref={scrollBottomRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t mt-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
}
