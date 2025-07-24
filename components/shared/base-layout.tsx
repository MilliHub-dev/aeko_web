"use client";

import { LeftSidebar } from "./left-sidebar";
import { RightSidebar } from "./right-sidebar";
import { MobileNavbar } from "./mobile-navbar";
import { MobileHeader } from "./mobile-header";
import { usePathname } from "next/navigation";

interface BaseLayoutProps {
  children: React.ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  const path = usePathname();
  return (
    <div className="min-h-screen bg-primary dark:bg-background">
      <MobileHeader />
      <div className="max-w-7xl mx-auto bg-background w-full">
        <LeftSidebar />
        <main
          className={`relative flex-1 md:ml-16 lg:ml-64 ${
            path === "/wallet" || path === "/live-streams" || path === "/explore" || path === "/settings" || !path
              ? "mr-0"
              : "xl:mr-80"
          }`}
        >
          {children}
        </main>
        <RightSidebar />
      </div>
      <MobileNavbar />
    </div>
  );
}
