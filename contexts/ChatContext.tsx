"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { useChatStore } from "@/features/chat/stores/chat-store";
import { type Chat } from "@/features/chat/types";

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
  const [showChatList, setShowChatList] = useState<boolean>(true);
  
  const { 
    chats, 
    fetchChats, 
    selectChat, 
    selectedChatId 
  } = useChatStore();

  // Derived state for selected chat
  const selectedChat = chats.find(c => c.id === selectedChatId) || null;

  // Initial fetch
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Sync state with URL pathname changes
  useEffect(() => {
    const pathParts = pathname.split("/");
    const isMessagesRoute = pathParts[1] === "messages";

    if (isMessagesRoute && pathParts.length === 3) {
      // On /messages/[username] route
      const username = pathParts[2];
      // Note: This assumes we can find chat by username. 
      // If chats aren't loaded yet, this might miss. 
      // ideally we should wait for loading.
      const chat = chats.find((c) => c.username === username || c.name === username); // flexible check

      if (chat) {
        if (selectedChatId !== chat.id) {
          selectChat(chat.id);
        }
        setShowChatList(false);
      } else {
        // If chats are loaded and we still don't find it, maybe redirect?
        // For now, let's not redirect aggressively to avoid loops if loading.
      }
    } else if (isMessagesRoute && pathParts.length === 2) {
      // On /messages route
      selectChat(null);
      setShowChatList(true);
    }
  }, [pathname, chats, selectChat, selectedChatId]);

  // Wrapper function that updates both state and URL
  const setSelectedChat = (chat: Chat | null) => {
    if (chat) {
      // Prefer username if available for URL, else id? 
      // Original code used username.
      const slug = chat.username || chat.id;
      router.push(`/messages/${slug}`);
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
