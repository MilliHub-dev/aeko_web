"use client";

import { LeftSidebar } from "./left-sidebar";
import { RightSidebar } from "./right-sidebar";
import { MobileNavbar } from "./mobile-navbar";
import { MobileHeader } from "./mobile-header";
import { MobileLeftSidebar } from "./mobile-left-sidebar";
import { usePathname } from "next/navigation";
import { Stories } from "../home/story/stories";
import { getLayoutConfig, LAYOUT_CONSTANTS } from "@/lib/layout-config";
import { CommentsPanel } from "@/components/home/post/comments-panel";
import { CommentsMobileModal } from "@/components/home/post/comments-mobile-modal";
import { MobileMenuProvider } from "./mobile-menu-context";
import { MobileMenuDrawer } from "./mobile-menu-drawer";

interface BaseLayoutProps {
  children: React.ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  const path = usePathname();
  const { variant, showMobileHeader } = getLayoutConfig(path);
  const isSimpleLayout = variant === "simple";

  // Grid column configurations for better maintainability
  const gridColsClass = isSimpleLayout
    ? LAYOUT_CONSTANTS.GRID_COLS_SIMPLE
    : LAYOUT_CONSTANTS.GRID_COLS_FULL;

  return (
    <MobileMenuProvider>
      <div className="relative w-full max-w-full bg-background">
        {showMobileHeader && <MobileHeader />}
        <div
          className={`xl:px-0 grid min-h-screen items-start ${gridColsClass}`}>
          <MobileLeftSidebar />
          <LeftSidebar />
          {/* {!isSimpleLayout && <Stories />} */}
          <main className="relative">{children}</main>
          {!isSimpleLayout && <RightSidebar />}
        </div>
        {/* Comments drawer overlays the right sidebar on xl screens */}
        {!isSimpleLayout && <CommentsPanel />}
        {/* Mobile full-screen comments modal */}
        <CommentsMobileModal />
        {/* Mobile hamburger right sidebar */}
        <div className="md:hidden">
          <MobileMenuDrawer />
        </div>
        <MobileNavbar />
      </div>
    </MobileMenuProvider>
  );
}
