"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { mockChats, type Chat } from "@/lib/mock-chats";

export type ChatPresence = "online" | "offline" | "away";

interface ChatContextType {
  showChatList: boolean;
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null) => void;
  setShowChatList: (showChatList: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedChat, setSelectedChatState] = useState<Chat | null>(null);
  const [showChatList, setShowChatList] = useState<boolean>(true);

  // Sync state with URL pathname changes (handles browser back/forward)
  useEffect(() => {
    const pathParts = pathname.split("/");
    const isMessagesRoute = pathParts[1] === "messages";

    if (isMessagesRoute && pathParts.length === 3) {
      // On /messages/[username] route
      const username = pathParts[2];
      const chat = mockChats.find((c) => c.username === username);

      if (chat) {
        setSelectedChatState(chat);
        setShowChatList(false);
      } else {
        // Invalid username, redirect to messages
        router.replace("/messages");
      }
    } else if (isMessagesRoute && pathParts.length === 2) {
      // On /messages route
      setSelectedChatState(null);
      setShowChatList(true);
    }
  }, [pathname, router]);

  // Wrapper function that updates both state and URL
  const setSelectedChat = (chat: Chat | null) => {
    if (chat) {
      router.push(`/messages/${chat.username}`);
    } else {
      router.push("/messages");
    }
  };

  return (
    <ChatContext.Provider
      value={{ selectedChat, showChatList, setSelectedChat, setShowChatList }}>
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
