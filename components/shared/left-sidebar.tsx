"use client";

import { useTheme } from "../theme-provider";
import {
  BellIcon,
  BookmarkIcon,
  HomeIcon,
  MessageCircle,
  MoonStar,
  MoreHorizontalIcon,
  SearchIcon,
  SunDim,
  UserIcon,
} from "lucide-react";
import { useReducer } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import ProfileCard from "./profile-card";

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

const dialogReducer = (
  state: DialogState,
  action: DialogAction
): DialogState => {
  switch (action.type) {
    case "TOGGLE_MESSAGES":
      return {
        isMessagesOpen: !state.isMessagesOpen,
        isNotificationsOpen: false,
        isSearchOpen: false,
      };
    case "TOGGLE_NOTIFICATIONS":
      return {
        isMessagesOpen: false,
        isNotificationsOpen: !state.isNotificationsOpen,
        isSearchOpen: false,
      };
    case "TOGGLE_SEARCH":
      return {
        isMessagesOpen: false,
        isNotificationsOpen: false,
        isSearchOpen: !state.isSearchOpen,
      };
    case "CLOSE_ALL":
      return {
        isMessagesOpen: false,
        isNotificationsOpen: false,
        isSearchOpen: false,
      };
    default:
      return state;
  }
};

const dialogActionMap: Record<DialogName, DialogAction["type"]> = {
  Messages: "TOGGLE_MESSAGES",
  Notifications: "TOGGLE_NOTIFICATIONS",
  Search: "TOGGLE_SEARCH",
};

function ThemeToggle({
  theme,
  toggleTheme,
  isDialogOpen,
}: {
  theme: string;
  toggleTheme: () => void;
  isDialogOpen: boolean;
}) {
  const Icon = theme === "dark" ? SunDim : MoonStar;
  const label = theme === "dark" ? "Light" : "Dark";
  return (
    <button
      className="w-full p-3 flex items-center justify-center xl:justify-start hover:bg-accent hover:text-muted transition-colors group relative gap-3 rounded-md"
      onClick={toggleTheme}
      title="Toggle Theme"
    >
      <Icon className="size-6 m-0 text-primary hover:text-accent transition-colors" />
      <h2
        className={`hidden xl:block text-secondary-foreground ${
          isDialogOpen ? "xl:hidden" : ""
        }`}
      >
        {label}
      </h2>
    </button>
  );
}

function DialogPanel({ label }: { label: DialogName }) {
  return (
    <motion.div
      id={`${label.toLowerCase()}-dialog`}
      className="h-screen border-r border-secondary-foreground bg-glass py-4 px-4 z-10 overflow-hidden"
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 280, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ type: "tween", duration: 0.25 }}
    >
      <h2 className="text-foreground font-semibold text-lg">{label}</h2>
    </motion.div>
  );
}

const routes = [
  {
    name: "Home",
    icon: HomeIcon,
    path: "/",
  },
  {
    name: "Search",
    icon: SearchIcon,
    path: "",
  },
  {
    name: "Notifications",
    icon: BellIcon,
    path: "",
  },
  {
    name: "Messages",
    icon: MessageCircle,
    path: "",
  },
  {
    name: "Bookmarks",
    icon: BookmarkIcon,
    path: "/bookmarks",
  },
  {
    name: "Profile",
    icon: UserIcon,
    path: "/profile",
  },
  {
    name: "More",
    icon: MoreHorizontalIcon,
    path: "/settings",
  },
];

export default function LeftSidebar() {
  const { theme, toggleTheme } = useTheme();
  const [dialogState, dispatch] = useReducer(dialogReducer, {
    isMessagesOpen: false,
    isNotificationsOpen: false,
    isSearchOpen: false,
  });

  const isDialogOpen =
    dialogState.isMessagesOpen ||
    dialogState.isNotificationsOpen ||
    dialogState.isSearchOpen;

  const handleClick = (name: DialogName) => {
    dispatch({ type: dialogActionMap[name] });
  };

  return (
    <div className={`hidden md:flex fixed left-[max(0px,calc(42%-640px))] h-screen z-10 md:px-4 lg:px-6 ${isDialogOpen && "glass"}`}>
      {/* Static sidebar - fixed widths */}
      <div
        className={`hidden md:flex flex-col transition-all duration-300 ease-in-out ${
          isDialogOpen ? "w-20" : "xl:w-64"
        } h-screen`}
      >
        <div className="flex flex-col gap-5 h-full">
          <ProfileCard isDialogOpen={isDialogOpen} />
          
           <nav className="flex-2 w-full flex flex-col items-center gap-2 bg-accent-foreground/80 backdrop-blur-md rounded-xl px-4 py-6">
            {routes.map((item) => {
              const isDialogItem = [
                "Messages",
                "Notifications", 
                "Search",
              ].includes(item.name);

              const commonProps = {
                className: `w-full py-2.5 px-3 flex items-center justify-center xl:justify-start hover:bg-accent-foreground hover:text-background transition-colors group relative gap-3 rounded-full ${
                  isDialogOpen ? "xl:justify-center" : ""
                }` as string,
                onClick: isDialogItem
                  ? () => handleClick(item.name as DialogName)
                  : undefined,
                "aria-expanded": isDialogItem
                  ? (dialogState[
                      `is${item.name}Open` as keyof DialogState
                    ] as boolean)
                  : undefined,
                "aria-controls": isDialogItem
                  ? `${item.name.toLowerCase()}-dialog`
                  : undefined,
                title: isDialogItem ? `Open ${item.name}` : item.name,
              };

              return isDialogItem ? (
                <button key={item.name} {...commonProps}>
                  <item.icon />
                  <motion.h2
                    initial={{ opacity: 1, x: 0 }}
                    animate={{
                      opacity: isDialogOpen ? 0 : 1,
                      x: isDialogOpen ? -20 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`hidden xl:block ${
                      isDialogOpen ? "xl:hidden" : ""
                    }`}
                  >
                    {item.name}
                  </motion.h2>
                </button>
              ) : (
                <Link key={item.name} href={item.path} replace {...commonProps}>
                  <item.icon />
                  <motion.h2
                    initial={{ opacity: 1, x: 0 }}
                    animate={{
                      opacity: isDialogOpen ? 0 : 1,
                      x: isDialogOpen ? -20 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`hidden xl:block ${
                      isDialogOpen ? "xl:hidden" : ""
                    }`}
                  >
                    {item.name}
                  </motion.h2>
                </Link>
              );
            })}
          </nav>

          <div className="flex-1 w-full flex flex-col pb-5">
            <ThemeToggle
              theme={theme}
              toggleTheme={toggleTheme}
              isDialogOpen={isDialogOpen}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {dialogState.isMessagesOpen && (
          <DialogPanel label="Messages" key="messages" />
        )}
        {dialogState.isNotificationsOpen && (
          <DialogPanel label="Notifications" key="notifications" />
        )}
        {dialogState.isSearchOpen && (
          <DialogPanel label="Search" key="search" />
        )}
      </AnimatePresence>
    </div>
  );
}
