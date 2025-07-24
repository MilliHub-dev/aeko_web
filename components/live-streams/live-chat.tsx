"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "../ui/input";
import { useState } from "react";

interface ChatMessage {
  id: number;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  message: string;
  timestamp: string;
}

interface LiveChatProps {
  streamId: string;
}

export function LiveChat({ streamId }: LiveChatProps) {
  const [message, setMessage] = useState("");
  
  // Mock chat messages
  const chatMessages: ChatMessage[] = [
    {
      id: 1,
      user: {
        name: "John Doe",
        username: "@johndoe",
        avatar: "/placeholder.svg",
      },
      message: "This stream is amazing! Learning so much about Next.js.",
      timestamp: "2 min ago",
    },
    {
      id: 2,
      user: {
        name: "Jane Smith",
        username: "@janesmith",
        avatar: "/placeholder.svg",
      },
      message: "Can you explain server components again?",
      timestamp: "1 min ago",
    },
    {
      id: 3,
      user: {
        name: "Alex Johnson",
        username: "@alexj",
        avatar: "/placeholder.svg",
      },
      message: "What's the best way to handle authentication in Next.js?",
      timestamp: "Just now",
    },
    {
      id: 4,
      user: {
        name: "Alex Johnson",
        username: "@alexj",
        avatar: "/placeholder.svg",
      },
      message: "What's the best way to handle authentication in Next.js?",
      timestamp: "Just now",
    },
    {
      id: 5,
      user: {
        name: "Alex Johnson",
        username: "@alexj",
        avatar: "/placeholder.svg",
      },
      message: "What's the best way to handle authentication in Next.js?",
      timestamp: "Just now",
    },
    {
      id: 6,
      user: {
        name: "Alex Johnson",
        username: "@alexj",
        avatar: "/placeholder.svg",
      },
      message: "What's the best way to handle authentication in Next.js?",
      timestamp: "Just now",
    },
    {
      id: 7,
      user: {
        name: "Alex Johnson",
        username: "@alexj",
        avatar: "/placeholder.svg",
      },
      message: "What's the best way to handle authentication in Next.js?",
      timestamp: "Just now",
    },
    {
      id: 8,
      user: {
        name: "Alex Johnson",
        username: "@alexj",
        avatar: "/placeholder.svg",
      },
      message: "What's the best way to handle authentication in Next.js?",
      timestamp: "Just now",
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, you would send the message to a backend
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="border border-border dark:border-border/30 bg-background/95 backdrop-blur-md rounded-2xl overflow-hidden h-full flex flex-col w-full">
      <div className="p-4 border-b border-border dark:border-border/30">
        <h2 className="font-semibold text-blue-gem-50 dark:text-green-yellow-300">
          Live Chat
        </h2>
      </div>
      
      {/* Chat Messages */}

      <ScrollArea className="px-4 space-y-4 h-70 flex-shrink-1">
        {chatMessages.map((chat) => (
          <div key={chat.id} className="flex items-start space-x-3 mb-4">
            <div className="flex justify-center items-center w-15 h-15">
              <Avatar className="size-10">
                <AvatarImage src={chat.user.avatar} />
                <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                  {chat.user.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 flex flex-col justify-center h-15">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                  {chat.user.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {chat.timestamp}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                {chat.message}
              </p>
            </div>
          </div>
        ))}
      </ScrollArea>
      
      {/* Chat Input */}
      <div className="p-4 border-t border-border dark:border-border/30">
        <div className="flex items-center space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} size="sm">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}