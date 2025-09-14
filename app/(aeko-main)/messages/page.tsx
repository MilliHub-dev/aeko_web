"use client";

import { ChatList } from "@/components/messages/chat-list";
import { ChatMessages } from "@/components/messages/chat-messages";

export default function MessagesPage() {
  return (
    <div className="bg-background">
      <div className="flex md:overflow-y-hidden">
        <ChatList />
        <ChatMessages />
      </div>
    </div>
  );
}
