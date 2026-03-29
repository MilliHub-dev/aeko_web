"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";

import { sidebarRoutes } from "@/lib/routes";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/(aeko-auth)/actions";
import { useUser } from "./user-context";
import { useChatStore } from "@/features/chat/stores/chat-store";

export function MobileLeftSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const chats = useChatStore((state) => state.chats);
  const fetchChats = useChatStore((state) => state.fetchChats);
  const hasUnreadMessages = useMemo(
    () => chats.some((chat) => (chat.unreadCount || 0) > 0),
    [chats]
  );

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return (
    <aside className="sticky top-0 hidden h-screen w-full shrink-0 md:flex xl:hidden border-r">
      <div className="relative flex h-full w-full flex-col items-center overflow-hidden rounded-[32px] bg-card pb-4 text-muted-foreground">
        <div className="flex h-20 w-full items-center justify-center border-b px-4">
          <Avatar className="h-16 w-16 ">
            <AvatarImage src={user?.profilePicture || user?.avatar} alt="User Avatar" />
            <AvatarFallback>
               {user?.profilePicture || user?.avatar ? (
                 user?.name?.charAt(0) || "U"
               ) : (
                 <img src="/profile_icon.jpg" alt="Profile" className="w-full h-full object-cover" />
               )}
            </AvatarFallback>
          </Avatar>
        </div>

        <nav className="mt-6 flex flex-1 flex-col items-center gap-4">
          {sidebarRoutes.map((route) => {
            const Icon = route.icon;
            const active = pathname.startsWith(route.path) && route.path !== "/wallet";
            
            if (route.path === "/wallet") {
              return (
                <div
                  key={route.path}
                  aria-label={route.name}
                  className="group relative flex h-14 w-14 items-center justify-center rounded-2xl transition opacity-60 cursor-not-allowed">
                  <Icon className="h-6 w-6" />
                </div>
              );
            }

            return (
              <Link
                key={route.path}
                href={route.path}
                aria-label={route.name}
                className={`group relative flex h-14 w-14 items-center justify-center rounded-2xl transition ${
                  active
                    ? "bg-primary/20 text-foreground shadow-md shadow-primary/20"
                    : "hover:bg-muted/60 hover:text-foreground"
                }`}>
                <Icon className="h-6 w-6" />
                {route.path === "/messages" && hasUnreadMessages && (
                  <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
          <button
            onClick={() => logoutAction()}
            aria-label="Log out"
            className="group relative flex h-14 w-14 items-center justify-center rounded-2xl transition hover:bg-muted/60 hover:text-foreground">
            <LogOut className="h-6 w-6" />
          </button>
        </nav>
      </div>
    </aside>
  );
}
