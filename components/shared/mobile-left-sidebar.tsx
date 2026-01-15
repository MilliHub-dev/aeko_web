"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { sidebarRoutes } from "@/lib/routes";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/(aeko-auth)/actions";
import { useUser } from "./user-context";

const contactList = [
  { name: "Erik Gunsel", avatar: "/users/mike-chen.jpg" },
  {
    name: "Emily Smith",
    avatar: "/users/sarah-johnson.jpeg",
  },
  {
    name: "Arthur Adelak",
    avatar: "/users/alex-rivera.jpg",
  },
];

export function MobileLeftSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside className="sticky top-0 hidden h-screen w-full shrink-0 md:flex xl:hidden border-r">
      <div className="relative flex h-full w-full flex-col items-center overflow-hidden rounded-[32px] bg-card pb-4 text-muted-foreground">
        <div className="flex h-20 w-full items-center justify-center border-b px-4">
          <Avatar className="h-16 w-16 ">
            <AvatarImage src={user?.profilePicture} alt="User Avatar" />
            <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        <nav className="mt-6 flex flex-1 flex-col items-center gap-4">
          {sidebarRoutes.map((route) => {
            const Icon = route.icon;
            const active = pathname.startsWith(route.path);
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
