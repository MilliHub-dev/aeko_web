"use client";

import { ChatList } from "@/components/messages/chat-list";
import { ChatMessages } from "@/components/messages/chat-messages";
import { ChatProvider } from "@/contexts/ChatContext";

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatProvider>
      <div className="flex h-[100dvh] w-full bg-gray-50 overflow-hidden">
        {/* Chat List - Hidden on mobile when chat is selected, always visible on desktop */}
        <ChatList />

        {/* Chat Screen - Shows selected chat on mobile, always visible on desktop */}
        <div className="flex-1 h-full relative">
          <ChatMessages />
          {children}
        </div>
      </div>
    </ChatProvider>
  );
}
