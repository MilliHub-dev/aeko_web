"use client";

import {
  Bell,
  Menu,
  Scan,
  Settings,
  Search,
  UserPlus,
  ChevronDown,
} from "lucide-react";
import { Button } from "../ui/button"; // Adjust to your actual Button import
import { Logo } from "../logo";
import { useRouteName } from "@/hooks";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChatIcon } from "@/lib/icons";
import { useMobileMenu } from "./mobile-menu-context";
import { getLayoutConfig } from "@/lib/layout-config";
import { CreateCommunityDialog } from "@/components/communities/create-community-dialog";

const MobileHeader = () => {
  const routeName = useRouteName();
  const path = usePathname();
  const { isUserPostsRoute } = getLayoutConfig(path);
  const { toggleMenu } = useMobileMenu();

  const isWallet = path.startsWith("/wallet");
  const isCommunities = path.startsWith("/communities");
  const isHome = path === "/home";
  const isProfile = path == "/profile";
  const isLiveStream = path == "/live-streams";

  const renderLeft = () => {
    if (isWallet) {
      return (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-secondary hover:bg-primary hover:text-secondary h-15 w-15 md:h-13 md:w-13"
          aria-label="Scan">
          <Scan className="size-6" />
        </Button>
      );
    }

    if (isLiveStream) return;
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-secondary hover:bg-primary hover:text-secondary h-15 w-15 md:h-13 md:w-13"
        onClick={toggleMenu}
        aria-label="Open menu">
        <Menu className="size-6" />
      </Button>
    );
  };

  const renderCenter = () => {
    if (isWallet) {
      return (
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Aeko wallet</h1>
          <ChevronDown className="size-5" />
        </div>
      );
    }
    if (isHome) {
      return (
        <div className="w-16 h-16 flex items-center justify-center">
          <Logo />
        </div>
      );
    }
    if (isProfile) return;
    if (isLiveStream) return;
    return <h1 className="text-3xl font-bold">{routeName}</h1>;
  };

  const renderRight = () => {
    if (isWallet) {
      return (
        <Link
          href="/settings"
          className="rounded-full bg-secondary hover:bg-primary hover:text-secondary h-15 w-15 md:h-13 md:w-13 flex justify-center items-center">
          <Settings className="size-6" />
        </Link>
      );
    }
    if (isLiveStream) return;
    if (isHome) return <div className="flex items-center gap-2 ml-12"></div>;
    if (isCommunities) {
      return (
        <div className="flex justify-center items-center space-x-4">
          <CreateCommunityDialog
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-secondary hover:bg-primary hover:text-secondary h-15 w-15 md:h-13 md:w-13">
                <UserPlus className="size-6" />
              </Button>
            }
          />
        </div>
      );
    }
    if (isProfile) return;
    return (
      <div className="flex justify-center items-center space-x-4">
        <Link
          href="/notifications"
          className="rounded-full bg-secondary hover:bg-primary hover:text-secondary h-15 w-15 md:h-13 md:w-13 flex justify-center items-center">
          <Bell className="size-6" />
        </Link>
        {path !== "/messages" && (
          <Link
            href="/messages"
            className="rounded-full bg-secondary hover:bg-primary hover:text-secondary h-15 w-15 md:h-13 md:w-13 flex justify-center items-center">
            <ChatIcon className="size-6" />
          </Link>
        )}
      </div>
    );
  };

  return (
    <header
      className={
        isUserPostsRoute
          ? "hidden "
          : "fixed top-0 left-0 right-0 bg-transparent mask-b-from-80% mask-radial-[70%_100%] mask-radial-from-100% backdrop-blur-sm px-4 py-3 md:hidden z-10 isolate"
      }>
      <div className="flex items-center justify-between">
        {/* Left Icon */}
        {renderLeft()}

        {/* Center Logo/Title */}
        <div className="flex-shrink-0">{renderCenter()}</div>

        {/* Right Icons */}
        {renderRight()}
      </div>
    </header>
  );
};

export { MobileHeader };
