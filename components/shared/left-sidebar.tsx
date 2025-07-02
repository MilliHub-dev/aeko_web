"use client";

import Image from "next/image";
import { NavIcons } from "../icons";
import { useTheme } from "../theme-provider";
import { MoonStar, SunDim } from "lucide-react";
import { useReducer } from "react";
import { motion, AnimatePresence } from "motion/react";

// Dialog state and actions

type DialogState = {
  isMessagesOpen: boolean;
  isNotificationsOpen: boolean;
  isSearchOpen: boolean;
};

type DialogName = "Messages" | "Notifications" | "Search";

type DialogAction =
  | { type: "TOGGLE_MESSAGES" }
  | { type: "TOGGLE_NOTIFICATIONS" }
  | { type: "TOGGLE_SEARCH" }
  | { type: "CLOSE_ALL" };

const dialogReducer = (state: DialogState, action: DialogAction): DialogState => {
  switch (action.type) {
    case "TOGGLE_MESSAGES":
      return { isMessagesOpen: !state.isMessagesOpen, isNotificationsOpen: false, isSearchOpen: false };
    case "TOGGLE_NOTIFICATIONS":
      return { isMessagesOpen: false, isNotificationsOpen: !state.isNotificationsOpen, isSearchOpen: false };
    case "TOGGLE_SEARCH":
      return { isMessagesOpen: false, isNotificationsOpen: false, isSearchOpen: !state.isSearchOpen };
    case "CLOSE_ALL":
      return { isMessagesOpen: false, isNotificationsOpen: false, isSearchOpen: false };
    default:
      return state;
  }
};

const dialogActionMap: Record<DialogName, DialogAction["type"]> = {
  Messages: "TOGGLE_MESSAGES",
  Notifications: "TOGGLE_NOTIFICATIONS",
  Search: "TOGGLE_SEARCH",
};

function ThemeToggle({ theme, toggleTheme, isDialogOpen }: { theme: string; toggleTheme: () => void; isDialogOpen: boolean }) {
  const Icon = theme === "dark" ? SunDim : MoonStar;
  const label = theme === "dark" ? "Light" : "Dark";
  return (
    <button
      className="w-full p-3 flex items-center justify-center xl:justify-start hover:bg-accent hover:text-muted transition-colors group relative gap-3 rounded-md"
      onClick={toggleTheme}
      title="Toggle Theme"
    >
      <Icon className="size-6 m-0 text-primary hover:text-accent transition-colors" />
      <h2 className={`hidden xl:block text-secondary-foreground ${isDialogOpen ? "xl:hidden" : ""}`}>{label}</h2>
    </button>
  );
}

function SidebarLogo({ theme, isDialogOpen }: { theme: string; isDialogOpen: boolean }) {
  return (
    <div className={`w-full p-3 flex items-center justify-center ${isDialogOpen ? "xl:justify-center" : "xl:justify-start"}`}>
      <Image
        src={theme === "dark" ? "/aeko-dark.png" : "/aeko-light.png"}
        alt="aeko logo"
        width={70}
        height={70}
        className="object-contain ml-1"
      />
    </div>
  );
}

function DialogPanel({ label }: { label: DialogName }) {
  return (
    <motion.div
      id={`${label.toLowerCase()}-dialog`}
      className="hidden md:flex flex-col w-[320px] h-screen border-r border-secondary-foreground glass py-2 px-2.5 z-10"
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -320, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <h2>{label}</h2>
    </motion.div>
  );
}

export default function LeftSidebar() {
  const { theme, toggleTheme } = useTheme();
  const [dialogState, dispatch] = useReducer(dialogReducer, {
    isMessagesOpen: false,
    isNotificationsOpen: false,
    isSearchOpen: false,
  });

  const isDialogOpen = dialogState.isMessagesOpen || dialogState.isNotificationsOpen || dialogState.isSearchOpen;

  const handleClick = (name: DialogName) => {
    dispatch({ type: dialogActionMap[name] });
  };

  return (
    <div className={`hidden md:flex fixed left-0 h-screen bg-glass z-10 ${
        isDialogOpen ? "xl:w-[320px]" : ""
      }`}>
      <div
        className={`hidden md:flex flex-col w-[72px] transition-all duration-300 ease-in-out ${
          isDialogOpen ? "xl:w-[72px] border-r border-secondary-foreground" : "xl:w-[200px]"
        } h-screen bg-glass py-2  px-2.5`}
      >
        <div className="flex-1 flex flex-col justify-start items-center gap-4 py-4">
          <SidebarLogo theme={theme} isDialogOpen={isDialogOpen} />

          <nav className="flex-1 w-full flex flex-col items-center gap-4">
            {NavIcons.map((item) => (
              <button
                key={item.name}
                className={`w-full p-3 flex items-center justify-center xl:justify-start hover:bg-accent hover:text-muted transition-colors group relative gap-3 rounded-md ${
                  isDialogOpen ? "xl:justify-center" : ""
                }`}
                onClick={() => handleClick(item.name as DialogName)}
                aria-expanded={dialogState[`is${item.name}Open` as keyof DialogState] as boolean}
                aria-controls={`${item.name.toLowerCase()}-dialog`}
                title={`Open ${item.name}`}
              >
                <item.icon />
                <motion.h2 
                  initial={{ opacity: 1, x: 0 }}
                  animate={{ 
                    opacity: isDialogOpen ? 0 : 1,
                    x: isDialogOpen ? -20 : 0
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`hidden xl:block text-secondary-foreground ${isDialogOpen ? "xl:hidden" : ""}`}
                >
                  {item.name}
                </motion.h2>
              </button>
            ))}
          </nav>

          <div className="flex-1 w-full flex flex-col justify-end gap-4 mt-auto pb-4">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} isDialogOpen={isDialogOpen} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {dialogState.isMessagesOpen && <DialogPanel label="Messages" />}
        {dialogState.isNotificationsOpen && <DialogPanel label="Notifications" />}
        {dialogState.isSearchOpen && <DialogPanel label="Search" />}
      </AnimatePresence>
    </div>
  );
}
