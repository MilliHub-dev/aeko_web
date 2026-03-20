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
    <div className="border-b border-border/60 bg-background/80 p-4 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Inbox
          </p>
          <h1 className="text-xl font-bold text-foreground">{routeName || "Messages"}</h1>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full p-2 transition-colors hover:bg-secondary/80">
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
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <input
          type="text"
          placeholder="Search Direct Messages"
          className="w-full rounded-full border border-border/60 bg-muted/70 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  );
};

export { ChatListHeader };
