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
          ? "flex justify-center md:hidden fixed bottom-4 left-0 right-0 bg-transparent isolation-auto"
          : "hidden"
      }>
      <div className="flex items-center justify-around px-4 py-3 w-[350px] h-20 bg-black/30 backdrop-blur-md border border-white/20 shadow-[inset_0_1px_4px_rgba(255,255,255,0.25),0_4px_10px_rgba(0,0,0,0.35),0_0_12px_rgba(255,255,255,0.15)] rounded-full ">
        {mobileRoutes.map((item) => {
          const IconComponent = item.icon;
          return item.id === "aeko" ? (
            <CreatePost
              key={item.id}
              trigger={
                <button
                  className={`flex flex-col items-center justify-center p-3 rounded-full hover:bg-accent text-gray-100/60 hover:text-primary transition-colors ${
                    item.label === routeName
                      ? "bg-white text-primary!"
                      : "bg-none"
                  }`}>
                  <IconComponent strokeWidth={1.5} size={24} />
                </button>
              }
            />
          ) : (
            <Link
              key={item.id}
              href={item.path}
              className={`flex flex-col items-center justify-center p-3 rounded-full hover:bg-accent text-gray-100/60 hover:text-primary transition-colors ${
                item.label === routeName ? "bg-white text-primary!" : "bg-none"
              }`}>
              <IconComponent strokeWidth={1.5} size={24} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export { MobileNavbar };
