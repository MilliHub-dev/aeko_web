"use client";

import { Bell, Grid, MessageSquare, MoreVertical, Search } from "lucide-react";
import { Button } from "../ui/button";
import { useRouteName } from "@/hooks";
import { usePathname } from "next/navigation";
import { Input } from "../ui/input";

const ChatListHeader = () => {
  const routeName = useRouteName();
  const path = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-transparent backdrop-blur-md px-4 py-3 space-y-8 -mx-4">
      <div className="flex items-center justify-between">
        {/* Left button */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-secondary hover:bg-primary hover:text-secondary h-15 w-15 md:h-13 md:w-13 border"
        >
          <Grid className="size-6" />
        </Button>

        {/* Center content */}
        <h1 className="text-3xl font-bold">{routeName}</h1>

        {/* Right icons */}
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-secondary hover:bg-primary hover:text-secondary h-15 w-15 md:h-13 md:w-13 border"
          >
            <Bell className="size-6" />
          </Button>
          {path !== "/messages" && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-secondary hover:bg-primary hover:text-secondary h-15 w-15 md:h-13 md:w-13 border"
            >
              <MessageSquare className="size-6" />
            </Button>
          )}
        </div>
      </div>

      <div className=" top-4 left-0 right-0 flex justify-between gap-6">
        <div className="relative flex-2">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-black  size-10 rounded-full flex items-center justify-center">
            <Search className="w-4 h-4" />
          </div>
          <Input
            placeholder="Search for Messages"
            className="w-full bg-gray-50 border-gray-200 rounded-full pl-15 pr-10 shadow-xl focus:outline-none focus:ring-2 focus:ring-secondary h-15 placeholder:text-xl"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full  hover:bg-primary hover:text-secondary h-15 w-15 md:h-13  md:w-13"
        >
          <MoreVertical className="size-6" />
        </Button>
      </div>
    </header>
  );
};

export { ChatListHeader };
