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
      <div className="flex h-screen w-full bg-gray-50">
        {/* Chat List - Hidden on mobile when chat is selected, always visible on desktop */}
        <ChatList />

        {/* Chat Screen - Shows selected chat on mobile, always visible on desktop */}
        <div className="flex-1">
          <ChatMessages />
        </div>
      </div>
    </ChatProvider>
  );
}
