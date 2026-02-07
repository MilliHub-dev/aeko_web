"use client";

import { Search, MoreHorizontal, Users } from "lucide-react";
import { useRouteName } from "@/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateGroupDialog } from "./create-group-dialog";
import { useState } from "react";

const ChatListHeader = () => {
  const routeName = useRouteName();
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">{routeName || "Messages"}</h1>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setIsGroupDialogOpen(true)}>
              <Users className="mr-2 h-4 w-4" />
              Create Group Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <CreateGroupDialog 
          // Controlled dialog state
          open={isGroupDialogOpen} 
          onOpenChange={setIsGroupDialogOpen} 
        />
      </div>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search Direct Messages"
          className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export { ChatListHeader };
