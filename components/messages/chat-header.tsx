"use client";

import { ArrowLeft, MoreVertical, Search } from "lucide-react";
import { Button } from "../ui/button";
import { useChat } from "@/contexts/ChatContext"; // 🔑 import context

const ChatHeader = () => {
  const { selectedChat, showChatList, setShowChatList } = useChat(); // 🔑 get active chat

  return (
    <header className="sticky top-0 z-50 bg-transparent backdrop-blur-md py-3 space-y-8 border-b border-gray-200 -mx-4 px-4">
      <div className="flex items-center justify-between">
        {/* Left button */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-secondary hover:bg-primary hover:text-secondary h-15 w-15 md:h-13 md:w-13 border"
          onClick={() => setShowChatList?.(!showChatList)}
        >
          <ArrowLeft className="size-6" />
        </Button>

        {/* Center content */}
        <div className="flex items-center">
          <img
            src={selectedChat?.avatar}
            alt={selectedChat?.name}
            className="w-10 h-10 rounded-full"
          />
          <span className="ml-2 font-bold text-xl">{selectedChat?.name}</span>
        </div>

        {/* Right icons */}
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-secondary hover:bg-primary hover:text-secondary h-15 w-15 md:h-13 md:w-13 border"
          >
            <Search className="size-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-secondary hover:bg-primary hover:text-secondary h-15 w-15 md:h-13 md:w-13 border"
          >
            <MoreVertical className="size-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export { ChatHeader };
