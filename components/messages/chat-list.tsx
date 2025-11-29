"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useChat } from "@/contexts/ChatContext";
import { ChatListHeader } from "./chat-list-header";
import { mockChats, type Chat } from "@/lib/mock-chats";

interface ChatListItemProps {
  chat: Chat;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chat }) => {
  const { setSelectedChat } = useChat();

  return (
    <div
      onClick={() => setSelectedChat(chat)}
      className="flex items-start gap-3 p-4 hover:bg-secondary/50 cursor-pointer border-b border-border transition-colors">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={chat.avatar} alt={chat.name} />
        <AvatarFallback>{chat.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-foreground truncate">
              {chat.name}
            </span>
            <span className="text-muted-foreground text-sm truncate">
              @{chat.username}
            </span>
          </div>
          <span className="text-muted-foreground text-sm shrink-0 ml-2">
            {chat.time}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground text-sm truncate flex-1">
            {chat.lastMessage}
          </p>
          {chat.unread > 0 && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 shrink-0">
              {chat.unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatList = () => {
  const { showChatList } = useChat();

  return (
    <div
      className={`${
        showChatList ? "block" : "hidden"
      } lg:block w-full lg:w-96 lg:border-r lg:border-border flex flex-col h-full bg-background`}>
      <ChatListHeader />
      <div className="flex-1 overflow-y-auto">
        {mockChats.map((chat) => (
          <ChatListItem key={chat.id} chat={chat} />
        ))}
      </div>
    </div>
  );
};

export { ChatList };
