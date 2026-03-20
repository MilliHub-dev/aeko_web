"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import { useChat } from "@/contexts/ChatContext";
import { ChatListHeader } from "./chat-list-header";
import { useChatStore } from "@/features/chat/stores/chat-store";
import { type Chat } from "@/features/chat/types";
import { useUser } from "@/components/shared/user-context";
import { getChatDisplayName, getChatDisplayImage, getChatDisplayUsername, getOtherParticipant } from "@/lib/chat-utils";

const ChatListItem = ({ chat }: { chat: Chat }) => {
  const { setSelectedChat } = useChat();
  const { user } = useUser();

  const myId = user?.id || user?._id;
  
  // Helper to format date
  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const displayName = getChatDisplayName(chat, myId);
  const displayUsername = getChatDisplayUsername(chat, myId);
  const displayAvatar = getChatDisplayImage(chat, myId);
  const otherParticipant = getOtherParticipant(chat, myId);
  
  const lastMessageText = chat.lastMessage?.content || "No messages yet";
  const displayTime = chat.lastMessage?.createdAt 
    ? formatTime(chat.lastMessage.createdAt) 
    : formatTime(chat.updatedAt);

  return (
    <div
      onClick={() => setSelectedChat(chat)}
      className="mx-3 flex cursor-pointer items-start gap-3 rounded-[24px] border border-transparent p-4 transition-all duration-200 hover:border-border/60 hover:bg-background/80 hover:shadow-sm"
    >
      <Avatar className="h-11 w-11 shrink-0 border border-border/60 shadow-sm">
        <AvatarImage src={displayAvatar} alt={displayName} />
        <AvatarFallback>
          <Image
            src="/profile_icon.jpg"
            alt="Profile"
            fill
            className="object-cover"
          />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-foreground truncate flex items-center gap-1">
              {displayName}
              {!chat.isGroup && otherParticipant?.blueTick && (
                <Image
                  src="/ticks/blue_tick.jpg"
                  alt="Verified"
                  width={16}
                  height={16}
                  className="h-4 w-4 shrink-0"
                />
              )}
              {!chat.isGroup && otherParticipant?.goldenTick && (
                <Image
                  src="/ticks/gold_tick.jpg"
                  alt="Gold Verified"
                  width={16}
                  height={16}
                  className="h-4 w-4 shrink-0"
                />
              )}
              {!chat.isGroup && otherParticipant?.prideTick && (
                <Image
                  src="/ticks/pride_tick.jpg"
                  alt="Pride Verified"
                  width={16}
                  height={16}
                  className="h-4 w-4 shrink-0"
                />
              )}
              {!chat.isGroup && otherParticipant?.businessTick && (
                <Image
                  src="/ticks/green_tick.jpg"
                  alt="Business Verified"
                  width={16}
                  height={16}
                  className="h-4 w-4 shrink-0"
                />
              )}
            </span>
            {displayUsername && (
              <span className="text-muted-foreground text-sm truncate">
                @{displayUsername}
              </span>
            )}
          </div>
          <span className="text-muted-foreground text-sm shrink-0 ml-2">
            {displayTime}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground text-sm truncate flex-1">
            {lastMessageText}
          </p>
          {chat.unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 shrink-0">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatList = () => {
  const { showChatList } = useChat();
  const { chats, isLoadingChats } = useChatStore();

  return (
    <div
      className={`${
        showChatList ? "block" : "hidden"
      } lg:block h-full w-full bg-background/65 backdrop-blur-sm lg:w-[25rem] lg:border-r lg:border-border/60`}>
      <ChatListHeader />
      <div className="flex-1 space-y-2 overflow-y-auto px-0 py-3">
        {isLoadingChats ? (
           <div className="p-6 text-center text-muted-foreground">Loading chats...</div>
        ) : chats.length === 0 ? (
           <div className="mx-3 rounded-[28px] border border-dashed border-border/70 bg-card/60 p-8 text-center text-muted-foreground">
             No conversations yet
           </div>
        ) : (
          chats.map((chat, index) => (
            <ChatListItem key={`${chat.id}-${index}`} chat={chat} />
          ))
        )}
      </div>
    </div>
  );
};

export { ChatList };
