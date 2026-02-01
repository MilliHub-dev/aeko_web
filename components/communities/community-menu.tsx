"use client";

import { Info, Flag, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface CommunityMenuProps {
  onAbout?: () => void;
  onReport?: () => void;
  onLeave?: () => void;
  trigger?: React.ReactNode;
}

export function CommunityMenu({
  onAbout,
  onReport,
  onLeave,
  trigger,
}: CommunityMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-white">
              <circle cx="10" cy="4" r="1.5" fill="currentColor" />
              <circle cx="10" cy="10" r="1.5" fill="currentColor" />
              <circle cx="10" cy="16" r="1.5" fill="currentColor" />
            </svg>
            <span className="sr-only">Open menu</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 rounded-2xl border-border/50 bg-background/95 backdrop-blur-lg">
        <DropdownMenuItem
          onClick={onAbout}
          className="cursor-pointer gap-3 rounded-xl py-3">
          <Info className="h-4 w-4" />
          <span>About Community</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onReport}
          className="cursor-pointer gap-3 rounded-xl py-3">
          <Flag className="h-4 w-4" />
          <span>Report Community</span>
        </DropdownMenuItem>
        {onLeave && (
          <DropdownMenuItem
            onClick={onLeave}
            className="cursor-pointer gap-3 rounded-xl py-3 text-destructive focus:text-destructive">
            <LogOut className="h-4 w-4" />
            <span>Leave Community</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
