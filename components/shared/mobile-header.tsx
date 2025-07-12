"use client";

import { Bell, MessageCircle, User } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Logo, MobileLogo } from "../logo";
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
  onProfileClick
}: MobileHeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header 
      className={`md:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50 ${className}`}
      role="banner"
    >
      <div className="flex items-center justify-between h-full px-4">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <MobileLogo />
        </div>

        {/* Actions Section */}
        <div className="flex items-center space-x-2">
                  <ThemeSwitcher />
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground"
            onClick={onNotificationClick}
            aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount})` : ''}`}
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </Button>

          {/* Messages */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground"
            onClick={onMessageClick}
            aria-label={`Messages${messageCount > 0 ? ` (${messageCount})` : ''}`}
          >
            <MessageCircle className="h-5 w-5" />
            {messageCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                {messageCount > 9 ? '9+' : messageCount}
              </span>
            )}
          </Button>

          {/* Profile */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              onProfileClick?.();
            }}
            aria-label="Profile menu"
          >
            {user.avatar ? (
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xs">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
            ) : (
              <User className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsProfileOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
};

export { MobileHeader };
export type { MobileHeaderProps, User };
