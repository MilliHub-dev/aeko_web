"use client";

import { Bell, MessageCircle, User } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Logo } from "../logo";
import { useState } from "react";
import { ThemeSwitcher } from "../theme/theme-switcher";

interface User {
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}

interface MobileHeaderProps {
  className?: string;
  notificationCount?: number;
  messageCount?: number;
  user?: User;
  onNotificationClick?: () => void;
  onMessageClick?: () => void;
  onProfileClick?: () => void;
}

const MobileHeader = ({
  className = "",
  notificationCount = 0,
  messageCount = 0,
  user = { name: "User", email: "user@example.com", initials: "U" },
  onNotificationClick,
  onMessageClick,
  onProfileClick,
}: MobileHeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header
      className={`md:hidden fixed top-0 left-0 right-0 h-16 bg-primary dark:bg-background dark:border-b dark:border-border/30 text-white z-50 ${className}`}
      role="banner"
    >
      <div className="flex items-center justify-between h-full px-4">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <Logo />
        </div>

        {/* Actions Section */}
        <div className="flex items-center space-x-2">
          {/* Theme Switcher */}
          <ThemeSwitcher className="text-white" />

          {/* Messages */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-accent hover:text-primary transition-colors  text-white dark:text-green-yellow-100"
            onClick={onMessageClick}
            aria-label={`Messages${
              messageCount > 0 ? ` (${messageCount})` : ""
            }`}
          >
            <MessageCircle className="h-5 w-5" />
            {messageCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                {messageCount > 9 ? "9+" : messageCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export { MobileHeader };
export type { MobileHeaderProps, User };
