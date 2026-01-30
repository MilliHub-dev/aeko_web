export interface ChatUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

export interface Chat {
  id: string; // Changed from number to string for consistency with typical DB IDs
  participants: ChatUser[];
  lastMessage?: {
    content: string;
    createdAt: string;
    senderId: string;
  };
  unreadCount: number;
  updatedAt: string;
  // UI helpers that might be mapped from participants
  name?: string;
  username?: string;
  avatar?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt?: string;
  // UI helpers
  sent?: boolean; // Derived from current user ID comparison
}

export interface SendMessageRequest {
  recipientId?: string; // For new chats
  chatId?: string; // For existing chats
  content: string;
}

export interface ChatResponse {
  chats: Chat[];
}

export interface MessagesResponse {
  messages: Message[];
}
