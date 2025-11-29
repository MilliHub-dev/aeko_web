"use client";

import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";

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
        <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-foreground truncate">
          {selectedChat.name}
        </h2>
        <p className="text-sm text-muted-foreground truncate">
          @{selectedChat.username}
        </p>
      </div>
      <button className="p-2 hover:bg-secondary/80 rounded-full transition-colors">
        <MoreHorizontal size={20} />
      </button>
    </div>
  );
};

export { ChatHeader };
