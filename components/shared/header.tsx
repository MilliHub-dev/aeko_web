"use client";

import { LucideBell, LucideMessageCircle, LucideSearch, LucideChevronDown, LucideUser, LucideSettings, LucideLogOut } from "lucide-react";
import { Logo } from "../logo";
import { ThemeSwitcher } from "../theme/theme-switcher";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface User {
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}

interface HeaderProps {
  className?: string;
  onSearch?: (query: string) => void;
  notificationCount?: number;
  messageCount?: number;
  user?: User;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

const Header = ({ 
  className = "", 
  onSearch, 
  notificationCount = 0, 
  messageCount = 0,
  user = { name: "User", email: "user@example.com", initials: "U" },
  onProfileClick,
  onSettingsClick,
  onLogoutClick
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  }, [onSearch]);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  }, [onSearch, searchQuery]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      (document.querySelector('input[type="search"]') as HTMLInputElement)?.focus();
    }
  }, []);

  return (
    <header 
      className={`hidden md:block fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border z-50 ${className}`}
      role="banner"
      onKeyDown={handleKeyDown}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-4 lg:px-6">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <Logo />
        </div>

        {/* Search Section */}
        <div className="flex-1 max-w-md mx-4 lg:mx-8">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative group">
              <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="search"
                placeholder="Search... (⌘K)"
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                aria-label="Search"
                autoComplete="off"
              />
            </div>
          </form>
        </div>

        {/* Actions Section */}
        <nav className="flex items-center space-x-2 lg:space-x-3" role="navigation" aria-label="Header actions">
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon"
            className="relative hover:bg-accent transition-colors"
            aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} unread)` : ''}`}
          >
            <LucideBell className="h-4 w-4" />
            {notificationCount > 0 && (
              <span 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium animate-pulse"
                aria-hidden="true"
              >
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </Button>

          {/* Messages */}
          <Button 
            variant="ghost" 
            size="icon"
            className="relative hover:bg-accent transition-colors"
            aria-label={`Messages${messageCount > 0 ? ` (${messageCount} unread)` : ''}`}
          >
            <LucideMessageCircle className="h-4 w-4" />
            {messageCount > 0 && (
              <span 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium animate-pulse"
                aria-hidden="true"
              >
                {messageCount > 99 ? '99+' : messageCount}
              </span>
            )}
          </Button>

          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* User Profile Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 px-2 hover:bg-accent transition-colors"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              aria-expanded={isProfileOpen}
              aria-haspopup="menu"
              aria-label={`User menu for ${user.name}`}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xs font-medium">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <LucideChevronDown className={`h-3 w-3 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </Button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-md shadow-lg z-50">
                <div className="p-3 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="py-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-3 py-2 text-sm"
                    onClick={() => {
                      onProfileClick?.();
                      setIsProfileOpen(false);
                    }}
                  >
                    <LucideUser className="h-4 w-4 mr-3" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-3 py-2 text-sm"
                    onClick={() => {
                      onSettingsClick?.();
                      setIsProfileOpen(false);
                    }}
                  >
                    <LucideSettings className="h-4 w-4 mr-3" />
                    Settings
                  </Button>
                  <div className="border-t border-border my-1" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-3 py-2 text-sm text-destructive hover:text-destructive"
                    onClick={() => {
                      onLogoutClick?.();
                      setIsProfileOpen(false);
                    }}
                  >
                    <LucideLogOut className="h-4 w-4 mr-3" />
                    Sign out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </nav>
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

export { Header };
export type { HeaderProps, User };
