export interface ChatUser {
  id: string;
  name: string;
  username: string;
  profilePicture?: string;
  avatar?: string; // Fallback
  blueTick?: boolean;
  goldenTick?: boolean;
  lastLoginAt?: string;
}

export interface Chat {
  id: string; // Changed from number to string for consistency with typical DB IDs
  members?: ChatUser[]; // New standard field
  participants: ChatUser[]; // Legacy field (mapped from members if needed)
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
  // Media support
  messageType?: 'text' | 'image' | 'video' | 'file' | 'emoji';
  mediaUrl?: string; // Legacy/Fallback
  attachments?: {
    url: string;
    mimeType: string;
  }[];
  // UI helpers
  sent?: boolean; // Derived from current user ID comparison
}

export interface SendMessageRequest {
  receiverId?: string; // Changed from recipientId to match enhanced-chat spec
  chatId?: string; 
  content: string;
  messageType?: 'text' | 'emoji' | 'image' | 'video' | 'file';
  replyToId?: string;
}

export interface CreateChatRequest {
  participants: string[];
  isGroup: boolean;
  groupName?: string;
}

export interface ChatResponse {
  chats: Chat[];
}

export interface MessagesResponse {
  messages: Message[];
}
