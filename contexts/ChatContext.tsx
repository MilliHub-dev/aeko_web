"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { useChatStore } from "@/features/chat/stores/chat-store";
import { type Chat } from "@/features/chat/types";
import { useUser } from "@/components/shared/user-context";
import { getChatDisplayUsername } from "@/lib/chat-utils";
import { getSocket, disconnectSocket } from "@/lib/socket";

export type ChatPresence = "online" | "offline" | "away";

interface ChatContextType {
  showChatList: boolean;
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null) => void;
  setShowChatList: (showChatList: boolean) => void;
  isInitializing: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showChatList, setShowChatList] = useState<boolean>(true);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const attemptedRef = useRef<string | null>(null);
  const { user } = useUser();
  
  const { 
    chats,  
    fetchChats, 
    selectChat, 
    selectedChatId,
    createChat,
    isLoadingChats
  } = useChatStore();

  // Derived state for selected chat
  const selectedChat = chats.find(c => String(c.id) === String(selectedChatId)) || null;

  const retryRef = useRef<number>(0);
  const prevSelectedIdRef = useRef<string | null>(null);

  // Recovery effect: If selectedChatId is set but selectedChat is null, try to refetch
  useEffect(() => {
    // Reset retries if the selected chat ID changes
    if (selectedChatId !== prevSelectedIdRef.current) {
        retryRef.current = 0;
        prevSelectedIdRef.current = selectedChatId;
    }

    if (selectedChatId && !selectedChat && !isLoadingChats) {
        if (retryRef.current < 3) {
            console.warn(`Selected chat ${selectedChatId} not found in chats list. Refetching... (Attempt ${retryRef.current + 1}/3)`);
            retryRef.current += 1;
            fetchChats();
        }
    } else if (selectedChat) {
        // Reset retries if we found the chat
        retryRef.current = 0;
    }
  }, [selectedChatId, selectedChat, isLoadingChats, fetchChats]);

  // Initial fetch
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Socket connection
  const { updateMessage } = useChatStore();
  
  useEffect(() => {
    const initSocket = async () => {
      try {
        const res = await fetch("/api/auth/token");
        if (res.ok) {
          const { token } = await res.json();
          if (token) {
            const socket = getSocket(token);

            socket.on("message_read", (data: { messageId: string, chatId?: string, conversationId?: string }) => {
              // Find chat ID if not provided
              const chatId = data.chatId || data.conversationId;
              
              if (chatId) {
                updateMessage(chatId, data.messageId, { readAt: new Date().toISOString() });
              } else {
                 // Fallback: search in current messages
                 const messagesMap = useChatStore.getState().messages;
                 Object.keys(messagesMap).forEach(cid => {
                   if (messagesMap[cid].some(m => m.id === data.messageId)) {
                     updateMessage(cid, data.messageId, { readAt: new Date().toISOString() });
                   }
                 });
              }
            });

            // Handle message_sent if needed (update status to sent/delivered)
            socket.on("message_sent", (data) => {
               // Optional: Update delivery status
            });
          }
        }
      } catch (e) {
        console.error("Failed to init socket", e);
      }
    };

    initSocket();

    return () => {
      disconnectSocket();
    };
  }, [updateMessage]);

  // Sync state with URL pathname changes
  useEffect(() => {
    const pathParts = pathname.split("/");
    const isMessagesRoute = pathParts[1] === "messages";

    if (isMessagesRoute && pathParts.length === 3) {
      // On /messages/[username] route
      const username = pathParts[2];
      
      const chat = chats.find((c) => 
        c.id === username || // Check ID first!
        c.username === username || 
        c.name === username || 
        c.participants?.some(p => 
          p.username === username || 
          p.id === username ||
          p.username?.toLowerCase() === username.toLowerCase()
        )
      );

      if (chat) {
        if (selectedChatId !== chat.id) {
          selectChat(chat.id);
        }
        setShowChatList(false);
        attemptedRef.current = null; // Reset attempt tracker
      } else if (!isLoadingChats && attemptedRef.current !== username) {
        // Chat not found and not loading. Try to resolve user and create.
        attemptedRef.current = username;
        
        const initializeChat = async () => {
             console.log(`Initializing chat for user: ${username}`);
             setIsInitializing(true);
             try {
                 // 1. Fetch target user details
                 let targetUser = null;
                 
                 // Try direct fetch first
                 const userRes = await fetch(`/api/users/${username}`);
                 if (userRes.ok) {
                   const userData = await userRes.json();
                   targetUser = userData.user;
                 }

                 // If direct fetch failed or returned no user, try search
                 if (!targetUser) {
                   const searchRes = await fetch(`/api/users?search=${username}`);
                   if (searchRes.ok) {
                     const searchData = await searchRes.json();
                     // users might be in data.users or data array
                     const users = Array.isArray(searchData) ? searchData : (searchData.users || []);
                     targetUser = users.find((u: any) => u.username === username || u.handle === username) || users[0];
                   }
                 }

                 if (!targetUser) {
                   console.warn(`Could not find user: ${username}`);
                   setIsInitializing(false);
                   return;
                 }
                 
                 const targetUserId = targetUser._id || targetUser.id;
                 console.log(`Found target user ID: ${targetUserId}`);
                 
                 // 2. Fetch my profile to get my ID
                 const meRes = await fetch('/api/profile');
                 if (!meRes.ok) {
                    console.error("Failed to fetch my profile");
                    setIsInitializing(false);
                    return;
                 }
                 const meData = await meRes.json();
                 const myId = meData.user?._id || meData.user?.id || meData._id || meData.id;
                 
                 if (!myId || !targetUserId) {
                    console.error("Missing user IDs", { myId, targetUserId });
                    setIsInitializing(false);
                    return;
                 }
                 
                 // 3. Create chat
                 console.log(`Creating chat between ${myId} and ${targetUserId}`);
                 const newChatId = await createChat([myId, targetUserId]);
                 console.log(`Chat created/found with ID: ${newChatId}`);
                 
                 if (newChatId) {
                     // Verify if chat exists in store now
                     const currentChats = useChatStore.getState().chats;
                     const chatExists = currentChats.find(c => String(c.id) === String(newChatId));
                     console.log(`Chat ${newChatId} exists in store:`, !!chatExists, currentChats.map(c => c.id));

                     selectChat(newChatId);
                     setShowChatList(false);
                 }
             } catch (e) {
                 console.error("Failed to initialize chat:", e);
             } finally {
                 setIsInitializing(false);
             }
        };
        
        initializeChat();
      }
    } else if (isMessagesRoute && pathParts.length === 2) {
      // On /messages root
      if (selectedChatId) {
        selectChat(null);
      }
      setShowChatList(true);
      attemptedRef.current = null;
    }
  }, [pathname, chats, selectChat, selectedChatId, isLoadingChats, createChat]);

  const setSelectedChat = (chat: Chat | null) => {
    if (chat) {
      const myId = user?.id || user?._id;
      // Use helper to get the best display username for the URL
      // This ensures we prefer the other person's username in DMs
      const slug = getChatDisplayUsername(chat, myId) || chat.id;
      
      router.push(`/messages/${slug}`);
    } else {
      router.push("/messages");
    }
  };

  return (
    <ChatContext.Provider
      value={{
        showChatList,
        selectedChat,
        setSelectedChat,
        setShowChatList,
        isInitializing
      }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
