"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { cva } from "class-variance-authority";

import { sidebarRoutes } from "@/lib/routes";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/(aeko-auth)/actions";
import { CreatePost } from "../home/create-post";
import { useChatStore } from "@/features/chat/stores/chat-store";

const navItem = cva(
  "group relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
  {
    variants: {
      active: {
        true: "bg-primary/15 text-foreground shadow-md shadow-primary/20",
        false: "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

const MAIN_LINK_COUNT = 6;

import { useUser } from "./user-context";

export function LeftSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const chats = useChatStore((state) => state.chats);
  const fetchChats = useChatStore((state) => state.fetchChats);
  const hasUnreadMessages = chats.some((chat) => (chat.unreadCount || 0) > 0);

  const { mainLinks, secondaryLinks } = useMemo(() => {
    return {
      mainLinks: sidebarRoutes.slice(0, MAIN_LINK_COUNT),
      secondaryLinks: sidebarRoutes.slice(MAIN_LINK_COUNT),
    };
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return (
    <aside className="sticky top-0 hidden h-screen w-full shrink-0 overflow-y-auto border-r xl:flex">
      <div className="relative flex min-h-full w-full flex-col bg-card space-y-4 p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14 border border-border/60">
              <AvatarImage
                src={user?.profilePicture || user?.avatar}
                alt={user?.name || "User"}
              />
              <AvatarFallback>
                {/* Consistent fallback with Profile Page */}
                {user?.profilePicture || user?.avatar ? (
                   user?.name?.charAt(0) || "U"
                ) : (
                   <img src="/profile_icon.jpg" alt="Profile" className="w-full h-full object-cover" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-xs tracking-[0.35em] text-muted-foreground">
                {user?.username ? `@${user.username}` : "Welcome"}
              </p>
              <div className="flex items-center gap-1.5">
                <p className="text-lg font-semibold">{user?.name}</p>
                {user?.blueTick && (
                  <Image
                    src="/ticks/blue_tick.jpg"
                    alt="Verified"
                    width={20}
                    height={20}
                    className="h-5 w-5 shrink-0"
                  />
                )}
                {user?.goldenTick && (
                  <Image
                    src="/ticks/gold_tick.jpg"
                    alt="Gold Verified"
                    width={20}
                    height={20}
                    className="h-5 w-5 shrink-0"
                  />
                )}
                {user?.prideTick && (
                  <Image
                    src="/ticks/pride_tick.jpg"
                    alt="Pride Verified"
                    width={20}
                    height={20}
                    className="h-5 w-5 shrink-0"
                  />
                )}
                {user?.businessTick && (
                  <Image
                    src="/ticks/green_tick.jpg"
                    alt="Business Verified"
                    width={20}
                    height={20}
                    className="h-5 w-5 shrink-0"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex h-full flex-col justify-between gap-4 pb-6">
            <div className="space-y-8">
              <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                  Main
                </p>
                <div className="space-y-2">
                  {mainLinks.map((route) => {
                    const Icon = route.icon;
                    const active = pathname.startsWith(route.path) && route.path !== "/wallet";
                    
                    if (route.path === "/wallet") {
                      return (
                        <div
                          key={route.path}
                          className={navItem({
                            active: false,
                            className: "opacity-60 cursor-not-allowed"
                          })}>
                          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-primary transition">
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate text-lg">{route.name}</span>
                          </div>
                          {(route as any).badge && (
                            <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                              {(route as any).badge}
                            </span>
                          )}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={route.path}
                        href={route.path}
                        className={navItem({
                          active,
                        })}>
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-primary transition group-hover:bg-muted/80 group-hover:text-foreground">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-lg">{route.name}</span>
                        </div>
                        {route.path === "/messages" && hasUnreadMessages && (
                          <span className="ml-auto h-2.5 w-2.5 rounded-full bg-primary" />
                        )}
                        {(route as any).badge && (
                          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                            {(route as any).badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                  More
                </p>
                <div className="space-y-2">
                  {secondaryLinks.map((route) => {
                    const Icon = route.icon;
                    const active = pathname.startsWith(route.path) && route.path !== "/wallet";
                    
                    if (route.path === "/wallet") {
                      return (
                        <div
                          key={route.path}
                          className={navItem({
                            active: false,
                            className: "opacity-60 cursor-not-allowed"
                          })}>
                          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-primary transition">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="truncate text-lg">{route.name}</span>
                          {(route as any).badge && (
                            <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                              {(route as any).badge}
                            </span>
                          )}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={route.path}
                        href={route.path}
                        className={navItem({
                          active,
                        })}>
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-primary transition group-hover:bg-muted/80 group-hover:text-foreground">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="truncate text-lg">{route.name}</span>
                        {route.path === "/messages" && hasUnreadMessages && (
                          <span className="ml-auto h-2.5 w-2.5 rounded-full bg-primary" />
                        )}
                        {(route as any).badge && (
                          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                            {(route as any).badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                  <button
                    onClick={() => logoutAction()}
                    className={navItem({
                      active: false,
                    })}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-primary transition group-hover:bg-muted/80 group-hover:text-foreground">
                      <LogOut className="h-4 w-4" />
                    </span>
                    <span className="truncate text-lg">Log out</span>
                  </button>
                </div>
              </section>
            </div>

            <div className="rounded-[28px] bg-muted p-5 flex items-center justify-center">
              <Image
                src="/aeko-logo.png"
                alt="Aeko Logo"
                width={160}
                height={50}
                className="h-10 w-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
