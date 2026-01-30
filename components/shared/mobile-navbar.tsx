"use client";

import { useRouteName } from "@/hooks/use-route-name";
import { mobileRoutes } from "@/lib/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLayoutConfig } from "@/lib/layout-config";
import { CreatePost } from "../home/create-post";

const MobileNavbar = () => {
  const routeName = useRouteName();
  const path = usePathname();
  const { showMobileNavbar: show } = getLayoutConfig(path);

  // Hide navbar when on active chat route (e.g., /messages/username)
  const isChatActive = path.startsWith("/messages/") && path !== "/messages";
  const shouldShow = show && !isChatActive;

  return (
    <nav
      className={
        shouldShow
          ? "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 md:hidden isolation-auto"
          : "hidden"
      }>
      <div className="flex items-center gap-1 px-2 py-2 bg-[#484848] backdrop-blur-md border border-white/10 shadow-2xl rounded-full">
        {mobileRoutes.map((item) => {
          const IconComponent = item.icon;
          const isActive = item.label === routeName;
          
          const activeClass = "bg-white text-black rounded-full p-2.5 shadow-sm transform scale-105 transition-all duration-200";
          const inactiveClass = "text-gray-400 p-2.5 hover:text-white transition-colors duration-200";

          return item.id === "aeko" ? (
            <CreatePost
              key={item.id}
              trigger={
                <button
                  className="mx-1 bg-[var(--color-green-cyan-normal)] text-white rounded-full p-2.5 shadow-md hover:scale-105 hover:bg-[var(--color-green-cyan-dark)] transition-all"
                >
                  <IconComponent strokeWidth={3} size={24} />
                </button>
              }
            />
          ) : (
            <Link
              key={item.id}
              href={item.path}
              className={`flex items-center justify-center ${isActive ? activeClass : inactiveClass}`}>
              <IconComponent 
                strokeWidth={isActive ? 2.5 : 2} 
                size={22} 
                className={isActive ? "fill-current" : ""}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export { MobileNavbar };
