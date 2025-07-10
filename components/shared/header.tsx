"use client";

import { LucideSearch } from "lucide-react";
import { Input } from "../ui/input";
import { useState, useCallback } from "react";

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
      className={`hidden md:block sticky top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border z-50 ${className}`}
      role="banner"
      onKeyDown={handleKeyDown}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center h-full px-4 lg:px-6">
        {/* Logo Section */}
        {/* <div className="flex-shrink-0">
          <Logo />
        </div> */}

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
                className="pl-10 pr-4 transition-all duration-200 focus:ring-2 focus:ring-primary/20 ring-2"
                aria-label="Search"
                autoComplete="off"
              />
            </div>
          </form>
        </div>

        {/* Actions Section */}
        
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
