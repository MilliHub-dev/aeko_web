"use client";

import { ArrowLeft, MoreHorizontal, Bot } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { BotDialog } from "../bot/bot-dialog";

const ChatHeader = () => {
  const router = useRouter();
  const { selectedChat } = useChat();

  if (!selectedChat) return null;

  return (
    <div className="border-b border-border p-4 flex items-center gap-3">
      <button
        onClick={() => router.back()}
        className="p-2 hover:bg-secondary/80 rounded-full transition-colors"
        aria-label="Back to chat list">
        <ArrowLeft size={20} />
      </button>
      <Avatar className="h-10 w-10">
        <AvatarImage src={selectedChat.avatar} alt={selectedChat.name} />
        <AvatarFallback>{selectedChat.name?.[0] || "?"}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-foreground truncate">
          {selectedChat.name || "Unknown Chat"}
        </h2>
        <p className="text-sm text-muted-foreground truncate">
          @{selectedChat.username || "unknown"}
        </p>
      </div>
      
      <BotDialog 
        trigger={
          <button className="p-2 hover:bg-secondary/80 rounded-full transition-colors text-primary" aria-label="Open Bot">
            <Bot size={20} />
          </button>
        }
      />

      <button className="p-2 hover:bg-secondary/80 rounded-full transition-colors">
        <MoreHorizontal size={20} />
      </button>
    </div>
  );
};

export { ChatHeader };
