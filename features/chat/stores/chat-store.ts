import { create } from "zustand";
import { Chat, Message, SendMessageRequest } from "../types";

interface ChatState {
  chats: Chat[];
  messages: Record<string, Message[]>; // chatId -> messages
  selectedChatId: string | null;
  
  isLoadingChats: boolean;
  isLoadingMessages: Record<string, boolean>;
  isSendingMessage: boolean;
  
  error: string | null;

  // Actions
  fetchChats: () => Promise<void>;
  selectChat: (chatId: string | null) => void;
  fetchMessages: (chatId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  addMessage: (message: Message) => void; // For real-time updates later
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  messages: {},
  selectedChatId: null,
  isLoadingChats: false,
  isLoadingMessages: {},
  isSendingMessage: false,
  error: null,

  fetchChats: async () => {
    set({ isLoadingChats: true, error: null });
    try {
      const res = await fetch("/api/chat/conversations");
      if (!res.ok) throw new Error("Failed to fetch chats");
      
      const data = await res.json();
      // Adjust based on actual API response structure
      // Assuming array or { chats: [] }
      const chats = Array.isArray(data) ? data : data.chats || [];
      
      set({ chats, isLoadingChats: false });
    } catch (error) {
      console.error("Error fetching chats:", error);
      set({ isLoadingChats: false, error: "Failed to load conversations" });
    }
  },

  selectChat: (chatId) => {
    set({ selectedChatId: chatId });
    if (chatId) {
      get().fetchMessages(chatId);
    }
  },

  fetchMessages: async (chatId) => {
    // If already loading or recent, maybe skip? For now, simple fetch.
    set((state) => ({
      isLoadingMessages: { ...state.isLoadingMessages, [chatId]: true },
    }));

    try {
      const res = await fetch(`/api/chat/${chatId}/messages`);
      if (!res.ok) throw new Error("Failed to fetch messages");

      const data = await res.json();
      const messages = Array.isArray(data) ? data : data.messages || [];

      set((state) => ({
        messages: { ...state.messages, [chatId]: messages },
        isLoadingMessages: { ...state.isLoadingMessages, [chatId]: false },
      }));
    } catch (error) {
      console.error(`Error fetching messages for ${chatId}:`, error);
      set((state) => ({
        isLoadingMessages: { ...state.isLoadingMessages, [chatId]: false },
      }));
    }
  },

  sendMessage: async (content) => {
    const { selectedChatId } = get();
    if (!selectedChatId) return;

    set({ isSendingMessage: true });
    try {
      const payload: SendMessageRequest = {
        chatId: selectedChatId,
        content,
      };

      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const newMessage = await res.json();
      
      // Optimistically add or use returned message
      // Assuming API returns the created message
      get().addMessage(newMessage);
      
      set({ isSendingMessage: false });
    } catch (error) {
      console.error("Error sending message:", error);
      set({ isSendingMessage: false, error: "Failed to send message" });
    }
  },

  addMessage: (message) => {
    set((state) => {
      const chatId = message.chatId;
      const currentMessages = state.messages[chatId] || [];
      // Prevent duplicates if API returns same message we got via socket (later)
      if (currentMessages.some(m => m.id === message.id)) return state;

      return {
        messages: {
          ...state.messages,
          [chatId]: [...currentMessages, message],
        },
      };
    });
  },
}));
