"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface Chat {
  id: string | number;
  lastMessage?: string;
  timestamp?: string;
  name: string;
  avatar: string;
}

interface ChatContextType {
  showChatList: boolean;
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null) => void;
  setShowChatList: (showChatList: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showChatList, setShowChatList] = useState<boolean>(true);

  return (
    <ChatContext.Provider
      value={{ selectedChat, showChatList, setSelectedChat, setShowChatList }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
