"use client";
import { ScrollArea } from "@base-ui-components/react/scroll-area";
import { Button } from "../ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
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
    {
      id: 9,
      user: {
        name: "Alex Johnson",
        username: "@alexj",
        avatar: "/placeholder.svg",
      },
      message: "What's the best way to handle authentication in Next.js?",
      timestamp: "Just now",
    },
    {
      id: 10,
      user: {
        name: "Alex Johnson",
        username: "@alexj",
        avatar: "/placeholder.svg",
      },
      message: "What's the best way to handle authentication in Next.js?",
      timestamp: "Just now",
    },
    {
      id: 11,
      user: {
        name: "Alex Johnson",
        username: "@alexj",
        avatar: "/placeholder.svg",
      },
      message: "What's the best way to handle authentication in Next.js?",
      timestamp: "Just now",
    },
    {
      id: 12,
      user: {
        name: "Alex Johnson",
        username: "@alexj",
        avatar: "/placeholder.svg",
      },
      message: "What's the best way to handle authentication in Next.js?",
      timestamp: "Just now",
    },
    {
      id: 13,
      user: {
        name: "Alex Johnson",
        username: "@alexj",
        avatar: "/placeholder.svg",
      },
      message: "What's the best way to handle authentication in Next.js?",
      timestamp: "Just now",
    },
    {
      id: 14,
      user: {
        name: "Alex Johnson",
        username: "@alexj",
        avatar: "/placeholder.svg",
      },
      message: "What's the best way to handle authentication in Next.js?",
      timestamp: "Just now",
    },
    {
      id: 15,
      user: {
        name: "Alex Johnson",
        username: "@alexj",
        avatar: "/placeholder.svg",
      },
      message: "What's the best way to handle authentication in Next.js?",
      timestamp: "Just now",
    },
    {
      id: 16,
      user: {
        name: "Alex Johnson",
        username: "@alexj",
        avatar: "/placeholder.svg",
      },
      message: "What's the best way to handle authentication in Next.js?",
      timestamp: "Just now",
    },
    {
      id: 17,
      user: {
        name: "Alex Johnson",
        username: "@alexj",
        avatar: "/placeholder.svg",
      },
      message: "What's the best way to handle authentication in Next.js?",
      timestamp: "Just now",
    },
    {
      id: 18,
      user: {
        name: "Alex Johnson",
        username: "@alexj",
        avatar: "/placeholder.svg",
      },
      message: "What's the best way to handle authentication in Next.js?",
      timestamp: "Just now",
    },
    {
      id: 19,
      user: {
        name: "Alex Johnson",
        username: "@alexj",
        avatar: "/placeholder.svg",
      },
      message: "What's the best way to handle authentication in Next.js?",
      timestamp: "Just now",
    },
    {
      id: 20,
      user: {
        name: "Alex Johnson",
        username: "@alexj",
        avatar: "/placeholder.svg",
      },
      message: "What's the best way to handle authentication in Nest.js?",
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
    <div className="relative overflow-hidden h-full flex flex-col w-full py-6">
      <div className="p-4 border-b border-border dark:border-border/30 mb-4">
        <h2 className="font-semibold text-blue-gem-50 dark:text-green-yellow-300">
          Live Chat
        </h2>
      </div>

      {/* Chat Messages */}
      <ScrollArea.Root>
        <ScrollArea.Viewport className="px-4 space-y-4 max-h-[52rem] flex-1 flex-shrink-1">
          {chatMessages.map((chat) => (
            <div
              key={chat.id}
              className="flex items-start space-x-3 mb-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-6 drop-shadow-2xl"
            >
              <div className="flex-1 flex flex-col justify-center h-15">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                    {chat.user.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {chat.timestamp}
                  </span>
                </div>
                <p className="text-lg text-black mt-1">{chat.message}</p>
              </div>
            </div>
          ))}
        </ScrollArea.Viewport>
      </ScrollArea.Root>

      {/* Chat Input */}
      <div className="absolute bottom-3 right-0 left-0 p-2 border-t  bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl mt-auto">
        <div className="flex items-center space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 placeholder:text-lg text-lg h-9 placeholder:text-white text-white"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            size="lg"
            className="h-9 text-white"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
