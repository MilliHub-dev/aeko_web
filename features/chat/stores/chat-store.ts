import { create } from "zustand";
import { Chat, Message, SendMessageRequest, CreateChatRequest } from "../types";

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
  sendMessage: (content: string, receiverId?: string) => Promise<void>;
  sendMediaMessage: (file: File, receiverId?: string) => Promise<void>;
  addMessage: (message: Message) => void;
  createChat: (participantIds: string[]) => Promise<string | null>;
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
      // Confirmed endpoint via connectivity check (401 vs 404)
      const res = await fetch("/api/enhanced-chat/conversations");
      if (!res.ok) {
        const text = await res.text();
        console.error(`Fetch chats failed: ${res.status} ${res.statusText}`, text);
        throw new Error(`Failed to fetch chats: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Fetched chats data:', data);
      
      // Adjust based on actual API response structure
      // Handle array, { chats: [] }, { data: [] }, { data: { chats: [] } }
      let chats = [];
      if (Array.isArray(data)) {
        chats = data;
      } else if (Array.isArray(data.chats)) {
        chats = data.chats;
      } else if (Array.isArray(data.data)) {
        chats = data.data;
      } else if (data.data && Array.isArray(data.data.chats)) {
        chats = data.data.chats;
      } else if (data.conversations && Array.isArray(data.conversations)) {
        chats = data.conversations;
      }
      
      // Map members to participants if needed for compatibility
      const mappedChats = chats.map((chat: any) => ({
        ...chat,
        participants: chat.participants || chat.members || [],
        // Ensure id is string
        id: String(chat.id || chat._id)
      }));
      
      set({ chats: mappedChats, isLoadingChats: false });
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
      // Updated to match enhanced-chat structure
      const res = await fetch(`/api/enhanced-chat/messages/${chatId}`);
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

  sendMessage: async (content, receiverId) => {
    const { selectedChatId } = get();
    if (!selectedChatId) return;

    set({ isSendingMessage: true });
    try {
      console.log('Sending message:', { selectedChatId, content, receiverId });
      
      const payload: SendMessageRequest = {
        chatId: selectedChatId,
        content,
        messageType: 'text',
        receiverId
      };

      // Use /send-message as per documentation
      const res = await fetch("/api/enhanced-chat/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Send message failed: ${res.status} ${res.statusText}`, errorText);
        throw new Error(`Failed to send message: ${res.status} ${res.statusText}`);
      }

      const rawData = await res.json();
      // Handle potential response wrappers
      const newMessage = rawData.message || rawData.data || rawData;
      
      // Optimistically add or use returned message
      get().addMessage(newMessage);
      
      set({ isSendingMessage: false });
    } catch (error) {
      console.error("Error sending message:", error);
      set({ isSendingMessage: false, error: "Failed to send message" });
    }
  },

  sendMediaMessage: async (file, receiverId) => {
    const { selectedChatId } = get();
    if (!selectedChatId) return;

    set({ isSendingMessage: true });
    try {
      console.log('Sending media message:', { selectedChatId, file, receiverId });
      
      const formData = new FormData();
      formData.append("chatId", selectedChatId);
      formData.append("file", file);
      // Optional caption can be added here if we want to support it in the UI later
      formData.append("caption", file.name); 
      
      if (receiverId) {
        formData.append("receiverId", receiverId);
      }

      // Use correct endpoint /upload-file as per documentation
      const res = await fetch("/api/enhanced-chat/upload-file", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Send media failed: ${res.status} ${res.statusText}`, errorText);
        throw new Error(`Failed to send media: ${res.status} ${res.statusText}`);
      }

      const rawData = await res.json();
      const newMessage = rawData.message || rawData.data || rawData;
      
      // Normalize the message structure if needed before adding to store
      // The API returns 'attachments' array, we might need to map it for our UI
      // or ensure UI supports it.
      
      get().addMessage(newMessage);
      
      set({ isSendingMessage: false });
    } catch (error) {
      console.error("Error sending media:", error);
      set({ isSendingMessage: false, error: "Failed to send media" });
    }
  },

  addMessage: (message: Message) => {
    set((state) => {
      const chatId = message.chatId;
      if (!chatId) {
        console.warn("Message missing chatId:", message);
        return state;
      }
      const currentMessages = state.messages[chatId] || [];
      // Prevent duplicates if API returns same message we got via socket (later)
      if (currentMessages.some(m => m.id === message.id)) return state;

      // Also update the lastMessage in the chats list
      const updatedChats = state.chats.map(chat => {
        if (String(chat.id) === String(chatId)) {
          return {
            ...chat,
            lastMessage: {
              content: message.content,
              createdAt: message.createdAt,
              senderId: message.senderId
            },
            updatedAt: message.createdAt,
            // Increment unread count if it's not from me? 
            // For now, let's just update the content/time. 
            // Unread count logic might be more complex (needs current user ID to know if it's incoming)
          };
        }
        return chat;
      });

      // Move the updated chat to the top
      const chatIndex = updatedChats.findIndex(c => String(c.id) === String(chatId));
      if (chatIndex > 0) {
        const [chat] = updatedChats.splice(chatIndex, 1);
        updatedChats.unshift(chat);
      }

      return {
        chats: updatedChats,
        messages: {
          ...state.messages,
          [chatId]: [...currentMessages, message],
        },
      };
    });
  },

  createChat: async (participantIds) => {
    set({ isLoadingChats: true, error: null });
    try {
      const payload: CreateChatRequest = {
        participants: participantIds,
        isGroup: false
      };

      const res = await fetch("/api/enhanced-chat/create-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create chat");

      const rawData = await res.json();
      // Handle potential response wrappers: { chat: ... }, { data: ... }, or direct object
      const newChat = rawData.chat || rawData.data || rawData;

      if (!newChat || !newChat.id) {
        console.error("Invalid chat response format:", rawData);
        throw new Error("Invalid chat response");
      }
      
      set((state) => {
        // Avoid duplicate if it already exists
        if (state.chats.find(c => String(c.id) === String(newChat.id))) {
           return { isLoadingChats: false };
        }
        return {
          chats: [newChat, ...state.chats],
          isLoadingChats: false
        };
      });

      return newChat.id;
    } catch (error) {
      console.error("Error creating chat:", error);
      set({ isLoadingChats: false, error: "Failed to create chat" });
      return null;
    }
  },
}));
