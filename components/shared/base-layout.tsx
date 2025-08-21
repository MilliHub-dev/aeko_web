"use client";

import { LeftSidebar } from "./left-sidebar";
import { RightSidebar } from "./right-sidebar";
import { MobileNavbar } from "./mobile-navbar";
import { MobileHeader } from "./mobile-header";
import { MobileLeftSidebar } from "./mobile-left-sidebar";
import { usePathname } from "next/navigation";

interface BaseLayoutProps {
  children: React.ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  const path = usePathname();

  const isSimpleLayout =
    path === "/explore" ||
    path === "/communities" ||
    path === "/live-streams" ||
    path.startsWith("/live-streams/") ||
    path === "/wallet" ||
    path === "/messages";

  return (
    <div className="relative max-w-full bg-background root">
      {path !== "/messages" && <MobileHeader />}
      <div
        className={`xl:container xl:max-w-[1800px] xl:mx-auto xl:px-8 grid ${
          isSimpleLayout
            ? "md:grid-cols-[5.625rem_1fr] xl:grid-cols-[22rem_1fr] max-w-full"
            : "md:grid-cols-[5.625rem_1fr] xl:grid-cols-[22rem_minmax(0,1fr)_28rem]"
        }`}
      >
        <MobileLeftSidebar />
        <LeftSidebar />
        <main className="relative">{children}</main>
        {!isSimpleLayout && <RightSidebar />}
      </div>
      <MobileNavbar />
    </div>
  );
}
