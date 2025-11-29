"use client";

import { Send, Image, Smile } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { useState } from "react";
import { ChatHeader } from "./chat-header";
import { getMockMessages, type Message } from "@/lib/mock-chats";

interface MessageBubbleProps {
  message: Message;
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
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {messages.map((msg) => (
      <MessageBubble key={msg.id} message={msg} />
    ))}
  </div>
);

const MessageInput: React.FC = () => {
  const [message, setMessage] = useState("");

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
          className="flex-1 bg-transparent focus:outline-none px-2 text-foreground placeholder:text-muted-foreground"
        />
        <button className="p-1 hover:bg-secondary/80 rounded-full transition-colors">
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

  if (!selectedChat) {
    return <EmptyState />;
  }

  const messages = getMockMessages(selectedChat.id);

  return (
    <div
      className={`${
        showChatList ? "hidden" : "flex"
      } lg:flex flex-col h-full bg-background`}>
      <ChatHeader />
      <MessageList messages={messages} />
      <MessageInput />
    </div>
  );
};

export { ChatMessages };
