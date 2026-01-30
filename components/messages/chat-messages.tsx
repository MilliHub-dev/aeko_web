"use client";

import { Send, Image, Smile } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { useState, useEffect, useRef } from "react";
import { ChatHeader } from "./chat-header";
import { useChatStore } from "@/features/chat/stores/chat-store";
import { useUser } from "@/components/shared/user-context";

interface DisplayMessage {
  id: string;
  text: string;
  sent: boolean;
  time: string;
}

interface MessageBubbleProps {
  message: DisplayMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => (
  <div className={`flex ${message.sent ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-xs lg:max-w-md ${
        message.sent ? "order-2" : "order-1"
      }`}>
      <div
        className={`rounded-2xl px-4 py-2 ${
          message.sent
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-secondary text-foreground rounded-bl-sm"
        }`}>
        <p>{message.text}</p>
      </div>
      <p className="text-xs text-muted-foreground mt-1 px-2">{message.time}</p>
    </div>
  </div>
);

interface MessageListProps {
  messages: DisplayMessage[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {isLoading ? (
        <div className="flex justify-center p-4">
           <span className="text-muted-foreground">Loading messages...</span>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex justify-center p-4">
           <span className="text-muted-foreground">No messages yet. Say hi!</span>
        </div>
      ) : (
        messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
};

interface MessageInputProps {
  onSend: (text: string) => void;
  isSending: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, isSending }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border p-4">
      <div className="flex items-center gap-2 bg-secondary rounded-full px-4 py-2">
        <button className="p-1 hover:bg-secondary/80 rounded-full transition-colors">
          <Image size={20} className="text-primary" />
        </button>
        <button className="p-1 hover:bg-secondary/80 rounded-full transition-colors">
          <Smile size={20} className="text-primary" />
        </button>
        <input
          type="text"
          placeholder="Start a new message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending}
          className="flex-1 bg-transparent focus:outline-none px-2 text-foreground placeholder:text-muted-foreground disabled:opacity-50"
        />
        <button 
          onClick={handleSend}
          disabled={!message.trim() || isSending}
          className="p-1 hover:bg-secondary/80 rounded-full transition-colors disabled:opacity-50">
          <Send size={20} className="text-primary" />
        </button>
      </div>
    </div>
  );
};

const EmptyState: React.FC = () => (
  <div className="hidden lg:flex flex-col items-center justify-center h-full bg-background">
    <div className="text-6xl mb-4">💬</div>
    <h2 className="text-2xl font-bold text-foreground mb-2">
      Select a message
    </h2>
    <p className="text-muted-foreground">
      Choose from your existing conversations or start a new one
    </p>
  </div>
);

const ChatMessages = () => {
  const { selectedChat, showChatList } = useChat();
  const { messages, fetchMessages, sendMessage, isSendingMessage, isLoadingMessages } = useChatStore();
  const { user } = useUser();

  useEffect(() => {
    if (selectedChat?.id) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat?.id, fetchMessages]);

  if (!selectedChat) {
    return <EmptyState />;
  }

  const chatMessages = messages[selectedChat.id] || [];
  const isLoading = isLoadingMessages[selectedChat.id] || false;
  
  const displayMessages: DisplayMessage[] = chatMessages.map(m => ({
    id: m.id,
    text: m.content,
    sent: m.senderId === (user?._id || user?.id),
    time: new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  }));

  return (
    <div
      className={`${
        showChatList ? "hidden" : "flex"
      } lg:flex flex-col h-full bg-background`}>
      <ChatHeader />
      <MessageList messages={displayMessages} isLoading={isLoading} />
      <MessageInput onSend={sendMessage} isSending={isSendingMessage} />
    </div>
  );
};

export { ChatMessages };
