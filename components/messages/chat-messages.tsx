"use client";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ScrollArea } from "@base-ui-components/react/scroll-area";
import { useChat } from "@/contexts/ChatContext";
import { useState } from "react";
import { ChatHeader } from "./chat-header";

const ChatMessages = () => {
  const { showChatList } = useChat();
  const [message, setMessage] = useState("");

  const mockMessages = [
    {
      id: 1,
      sender: "John Doe",
      content: "Hey, how are you?",
      timestamp: "10:30 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      sender: "Me",
      content: "I'm good, thanks! How about you?",
      timestamp: "10:32 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      sender: "John Doe",
      content: "I'm doing well, thanks! What about you?",
      timestamp: "10:33 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      sender: "Me",
      content: "I'm doing well, thanks! What about you?",
      timestamp: "10:34 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      sender: "John Doe",
      content: "I'm doing well, thanks! What about you?",
      timestamp: "10:35 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      sender: "Me",
      content: "I'm doing well, thanks! What about you?",
      timestamp: "10:36 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 7,
      sender: "John Doe",
      content: "I'm doing well, thanks! What about you?",
      timestamp: "10:37 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 8,
      sender: "Me",
      content: "I'm doing well, thanks! What about you?",
      timestamp: "10:38 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 9,
      sender: "John Doe",
      content: "I'm doing well, thanks! What about you?",
      timestamp: "10:39 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 10,
      sender: "Me",
      content: "I'm doing well, thanks! What about you?",
      timestamp: "10:40 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 11,
      sender: "John Doe",
      content: "I'm doing well, thanks! What about you?",
      timestamp: "10:41 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 12,
      sender: "Me",
      content: "I'm doing well, thanks! What about you?",
      timestamp: "10:42 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 13,
      sender: "John Doe",
      content: "I'm doing well, thanks! What about you?",
      timestamp: "10:43 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 14,
      sender: "Me",
      content: "I'm doing well, thanks! What about you?",
      timestamp: "10:44 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 15,
      sender: "John Doe",
      content: "I'm doing well, thanks! What about you?",
      timestamp: "10:45 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 16,
      sender: "Me",
      content: "I'm doing well, thanks! What about you?",
      timestamp: "10:46 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];

  return (
    <div
      className={`
        ${showChatList ? "hidden" : "flex"} 
        flex 
        flex-1 flex-col 
        bg-white
        relative
        px-4
        h-[calc(100vh-6rem)]
        md:h-screen
      `}
    >
      <ChatHeader />
      {/* Messages List */}
      <ScrollArea.Root className="">
        <ScrollArea.Viewport className="h-[calc(100vh-14rem)] md:h-[calc(100vh-6rem)]">
          <div className="space-y-4 md:space-y-6 py-3">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2 md:gap-3 ${
                  msg.sender === "Me" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex flex-col max-w-[75%] md:max-w-[60%] ${
                    msg.sender === "Me" ? "items-end" : ""
                  }`}
                >
                  <div
                    className={`px-3 py-2 md:px-4 md:py-3 ${
                      msg.sender === "Me"
                        ? "bg-primary text-secondary rounded-l-2xl rounded-tr-2xl"
                        : "bg-muted rounded-r-2xl rounded-tl-2xl"
                    }`}
                  >
                    <p className="text-lg md:text-base">{msg.content}</p>
                  </div>
                  <span className="text-sm text-muted-foreground mt-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea.Viewport>
      </ScrollArea.Root>

      {/* Chat Input */}
      <div className="absolute bottom-0 left-0 right-0 border-t bg-white py-4 px-6 md:p-4 md:mx-0">
        <form
          className="flex gap-2 md:gap-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 h-15 text-xl md:text-base rounded-full px-4"
          />
          <Button
            type="submit"
            size="sm"
            className="px-4 md:px-6 h-15 text-secondary"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export { ChatMessages };
