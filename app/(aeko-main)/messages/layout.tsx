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
      <div className="flex h-[100dvh] w-full overflow-hidden bg-[radial-gradient(90%_120%_at_0%_0%,rgba(0,127,109,0.10),transparent_55%),linear-gradient(180deg,#f8fbfa,#f3f7f6)]">
        {/* Chat List - Hidden on mobile when chat is selected, always visible on desktop */}
        <ChatList />

        {/* Chat Screen - Shows selected chat on mobile, always visible on desktop */}
        <div className="relative h-full flex-1">
          <ChatMessages />
          {children}
        </div>
      </div>
    </ChatProvider>
  );
}
