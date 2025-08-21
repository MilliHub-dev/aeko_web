"use client";

import { ScrollArea } from "@base-ui-components/react/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useChat } from "@/contexts/ChatContext";
import { ChatListHeader } from "./chat-list-header";

const ChatList = () => {
  const { showChatList, setShowChatList, setSelectedChat } = useChat();

  const mockChats = [
    {
      id: 1,
      name: "John Doe",
      lastMessage: "I'm doing well, thanks!",
      timestamp: "10:46 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Jane Smith",
      lastMessage: "See you tomorrow!",
      timestamp: "9:30 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Mike Johnson",
      lastMessage: "Thanks for the help",
      timestamp: "Yesterday",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Sarah Brown",
      lastMessage: "Calling you later",
      timestamp: "2 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "Michael Davis",
      lastMessage: "Meeting at 10 AM",
      timestamp: "3 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      name: "Emily Wilson",
      lastMessage: "Project update",
      timestamp: "4 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 7,
      name: "David Lee",
      lastMessage: "Call later",
      timestamp: "5 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 8,
      name: "Jessica Taylor",
      lastMessage: "Project deadline",
      timestamp: "6 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 9,
      name: "Christopher Martinez",
      lastMessage: "Meeting at 2 PM",
      timestamp: "7 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 10,
      name: "Amanda Wilson",
      lastMessage: "Team meeting",
      timestamp: "8 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 11,
      name: "Matthew Anderson",
      lastMessage: "Project progress",
      timestamp: "9 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 12,
      name: "Jessica Taylor",
      lastMessage: "Team meeting",
      timestamp: "10 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 13,
      name: "Christopher Martinez",
      lastMessage: "Project progress",
      timestamp: "11 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 14,
      name: "Amanda Wilson",
      lastMessage: "Team meeting",
      timestamp: "12 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 15,
      name: "Matthew Anderson",
      lastMessage: "Project progress",
      timestamp: "13 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 16,
      name: "Jessica Taylor",
      lastMessage: "Team meeting",
      timestamp: "14 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 17,
      name: "Christopher Martinez",
      lastMessage: "Project progress",
      timestamp: "15 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 18,
      name: "Amanda Wilson",
      lastMessage: "Team meeting",
      timestamp: "16 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 19,
      name: "Matthew Anderson",
      lastMessage: "Project progress",
      timestamp: "17 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 20,
      name: "Jessica Taylor",
      lastMessage: "Team meeting",
      timestamp: "18 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];

  return (
    <div
      className={`
      ${showChatList ? "block" : "hidden"}
      relative 
      lg:block 
      w-full lg:w-96 
      bg-white lg:border-r-2 lg:border-gray-200 
      flex flex-col
      px-4
      md:h-screen
    `}
    >
      <ChatListHeader />
      {/* Chat List */}
      <ScrollArea.Root className="flex-1">
        <ScrollArea.Viewport className="h-[calc(100vh-16rem)] md:h-[calc(100vh-9rem)] p-2">
          {mockChats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => {
                setSelectedChat(chat);
                setShowChatList(false);
              }}
            >
              <Avatar className="h-10 w-10 md:h-12 md:w-12">
                <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                <AvatarFallback>{chat.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-lg md:text-base truncate">
                    {chat.name}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {chat.timestamp}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    </div>
  );
};

export { ChatList };
