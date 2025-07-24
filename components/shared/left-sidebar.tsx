"use client";

import { sidebarRoutes } from "@/lib/routes";
import Link from "next/link";
import { Button } from "../ui/button";
import { ThemeSwitcher } from "../theme/theme-switcher";
import { Logo } from "../logo";
import React from "react";
import {  SearchPanel, useSearchDialog } from "./search-panel";
import { AnimatePresence, motion } from "motion/react";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { usePathname } from "next/navigation";

const LeftSidebar = () => {
  const { dialogState, handleRouteClick, handleBackdropClick, toggleSearch } = useSearchDialog();

  const path = usePathname()

  return (
    <React.Fragment>
      <aside className="hidden md:block fixed left-[max(0px,calc(50%-640px))] top-0 bottom-0 w-16 lg:w-64 bg-primary dark:bg-background border-r border-border/30 overflow-y-auto z-20">
        <div className="px-2 lg:px-6 py-6 md:py-8 h-full flex flex-col justify-between">
          <div className="space-y-5">
            <div className="mb-9">
              <Logo size={90} />
            </div>
            <nav className="flex flex-col md:items-center lg:items-start gap-y-4">
              {/* Navigation Links */}
              <Button
                className="flex items-center gap-x-3 rounded-full hover:bg-accent hover:text-primary transition-colors md:justify-center lg:justify-start lg:w-full lg:flex-1 text-blue-gem-50 dark:text-green-yellow-100"
                onClick={() => handleRouteClick("Search")}
                variant={"ghost"}
              >
                <div className="flex justify-center items-center">
                  <SearchIcon className="w-full" />
                </div>
                <span className="hidden lg:block font-medium">Search</span>
              </Button>
              {sidebarRoutes.map((route) => {
                const Icon = route.icon;
                return (
                  <Link
                    href={route.path}
                    key={route.name}
                    className={`
                      w-full flex-1 flex items-center gap-x-3 p-2 rounded-full 
                      hover:bg-accent hover:text-primary
                      md:justify-center lg:justify-start 
                      text-blue-gem-50 dark:text-green-yellow-100
                      transition-all duration-200 ease-in-out
                      ${path === route.path ? 'bg-accent text-primary scale-105 border-primary/30 border' : 'bg-transparent'}
                    `}
                  >
                    <div className="flex justify-center items-center">
                      <Icon 
                        className={`w-full transition-transform duration-200 ${path === route.path ? 'scale-110' : ''}`} 
                        strokeWidth={1.5} 
                      />
                    </div>
                    <span className="hidden lg:block font-medium">
                      {route.name}
                    </span>
                  </Link>
                );
              })}

              <Button
                className="flex items-center gap-x-3 rounded-full hover:bg-accent hover:text-primary transition-colors md:justify-center lg:justify-start lg:w-full lg:flex-1 text-blue-gem-50 dark:text-green-yellow-100"
                variant={"ghost"}
              >
                <div className="flex justify-center items-center">
                  <PlusIcon className="w-full" />
                </div>
                <span className="hidden lg:block font-medium">Create Post</span>
              </Button>
              {/* Theme Switcher */}
              <ThemeSwitcher className="w-full lg:block" />
            </nav>
          </div>

          {/* User Profile avatar */}
          <div className="flex items-center gap-x-3 p-2 rounded-full text-border md:justify-center lg:justify-start lg:w-full cursor-pointer">

            <div className="flex justify-center items-center">
              <div className="w-full rounded-full bg-accent flex items-center justify-center overflow-hidden border border-primary/20 text-primary">
                <Avatar>
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <span className="hidden lg:block font-medium">
              Profile
            </span>
          </div>
        </div>
      </aside>

      {/* Blur Background Overlay */}
      <AnimatePresence>
        {dialogState.isSearchOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 left-[max(0px,calc(50%-640px))] top-0 bottom-0 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleBackdropClick}
          />
        )}
      </AnimatePresence>

      {/* Search Panel */}
      <AnimatePresence>
        {dialogState.isSearchOpen && <SearchPanel onClose={handleBackdropClick} />}
      </AnimatePresence>
    </React.Fragment>
  );
};

export { LeftSidebar };
