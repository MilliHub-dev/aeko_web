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
      className="flex items-start gap-3 p-4 hover:bg-secondary/50 cursor-pointer border-b border-border transition-colors">
      <Avatar className="h-10 w-10 shrink-0">
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
                  src="/blue_tick.png"
                  alt="Verified"
                  width={12}
                  height={12}
                  className="h-3 w-3 shrink-0"
                />
              )}
              {!chat.isGroup && otherParticipant?.goldenTick && (
                <Image
                  src="/gold_tick.png"
                  alt="Gold Verified"
                  width={12}
                  height={12}
                  className="h-3 w-3 shrink-0"
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
      } lg:block w-full lg:w-96 lg:border-r lg:border-border flex flex-col h-full bg-background`}>
      <ChatListHeader />
      <div className="flex-1 overflow-y-auto">
        {isLoadingChats ? (
           <div className="p-4 text-center text-muted-foreground">Loading chats...</div>
        ) : chats.length === 0 ? (
           <div className="p-4 text-center text-muted-foreground">No conversations yet</div>
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
