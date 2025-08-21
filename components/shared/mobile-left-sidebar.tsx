"use client";

import { sidebarRoutes } from "@/lib/routes";
import Link from "next/link";
import { Logo } from "../logo";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const MobileLeftSidebar = () => {
  const path = usePathname();

  return (
    <aside className="hidden md:flex flex-col xl:hidden border-r border-gray-300">
      <div className="sticky top-0 h-[calc(100vh-1rem)] flex flex-col items-center py-6 xl:h-full">
        {/* User Profile at the bottom */}
        <div className="flex gap-x-4 mt-auto mb-12">
          <Avatar className="h-13 w-13 aspect-square outline-2 outline-offset-2 outline-normal-active">
            <AvatarImage src="/profile.jpeg" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col items-center gap-y-8 flex-1">
          {sidebarRoutes.map((route) => {
            const Icon = route.icon;
            return (
              <Link
                href={route.path}
                key={route.name}
                className={`
                      flex items-center justify-center size-18 rounded-full 
                      hover:bg-secondary hover:text-primary
                      transition-all duration-200 ease-in-out
                      ${
                        path === route.path
                          ? "bg-secondary text-primary"
                          : "bg-transparent"
                      }
                    `}
                title={route.name}
              >
                <Icon
                  className="transition-transform duration-200"
                  strokeWidth={1.5}
                  size={35}
                />
              </Link>
            );
          })}
        </nav>

        {/* Logo at the top */}
        <div className="inline-block w-16 mt-auto flex-shrink-0">
          <Logo />
        </div>
      </div>
    </aside>
  );
};

export { MobileLeftSidebar };
