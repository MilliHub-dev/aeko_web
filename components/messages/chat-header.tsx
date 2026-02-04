"use client";

import { ArrowLeft, MoreHorizontal, Bot } from "lucide-react";
import Image from "next/image";
import { useChat } from "@/contexts/ChatContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { BotDialog } from "../bot/bot-dialog";
import { useUser } from "@/components/shared/user-context";
import { getChatDisplayName, getChatDisplayImage, getChatDisplayUsername, getOtherParticipant } from "@/lib/chat-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ChatHeader = () => {
  const router = useRouter();
  const { selectedChat } = useChat();
  const { user } = useUser();

  if (!selectedChat) return null;

  const myId = user?.id || user?._id;
  
  const displayName = getChatDisplayName(selectedChat, myId);
  const displayUsername = getChatDisplayUsername(selectedChat, myId);
  const displayAvatar = getChatDisplayImage(selectedChat, myId);
  const otherParticipant = getOtherParticipant(selectedChat, myId);

  return (
    <div className="border-b border-border p-4 flex items-center gap-3">
      <button
        onClick={() => router.back()}
        className="p-2 hover:bg-secondary/80 rounded-full transition-colors"
        aria-label="Back to chat list">
        <ArrowLeft size={20} />
      </button>
      <Avatar className="h-10 w-10">
        <AvatarImage src={displayAvatar} alt={displayName} />
        <AvatarFallback>{displayName[0] || "?"}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-foreground truncate flex items-center gap-1">
          {displayName}
          {otherParticipant?.blueTick && (
            <Image
              src="/blue_tick.png"
              alt="Verified"
              width={14}
              height={14}
              className="h-3.5 w-3.5"
            />
          )}
          {otherParticipant?.goldenTick && (
            <Image
              src="/gold_tick.png"
              alt="Gold Verified"
              width={14}
              height={14}
              className="h-3.5 w-3.5"
            />
          )}
        </h2>
        {displayUsername && (
          <p className="text-sm text-muted-foreground truncate">
            @{displayUsername}
          </p>
        )}
      </div>
      
      <BotDialog 
        trigger={
          <button className="p-2 hover:bg-secondary/80 rounded-full transition-colors text-primary" aria-label="Open Bot">
            <Bot size={20} />
          </button>
        }
        chatId={selectedChat.id}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 hover:bg-secondary/80 rounded-full transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {displayUsername && (
            <DropdownMenuItem onClick={() => router.push(`/${displayUsername}`)}>
              View Profile
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="text-destructive">
            Block User
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">
            Delete Chat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { ChatHeader };
