"use client";

import { LucideMoon, LucideSun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

interface ThemeSwitcherProps {
  variant?: "icon" | "dropdown";
  showLabel?: boolean;
  className?: string;
}

const ThemeSwitcher = ({
  variant = "icon",
  showLabel = false,
  className = "",
}: ThemeSwitcherProps) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`opacity-50 ${className}`}
        disabled
        aria-label="Loading theme switcher"
      >
        <LucideSun className="h-4 w-4 text" />
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const getThemeIcon = () => {
    if (theme === "dark" || (theme === "system" && resolvedTheme === "dark")) {
      return (
        <div className="flex items-center gap-x-3">
          <LucideMoon className="w-full" />
          <span className="hidden lg:inline">Dark</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-x-3">
        <LucideSun className="w-full" />
        <span className="hidden lg:inline">Light</span>
      </div>
    );
  };

  const getThemeLabel = () => {
    if (theme === "dark" || (theme === "system" && resolvedTheme === "dark")) {
      return "Dark";
    }
    return "Light";
  };

  const getAriaLabel = () => {
    const currentTheme =
      theme === "dark" || (theme === "system" && resolvedTheme === "dark")
        ? "dark"
        : "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    return `Switch to ${nextTheme} theme. Current theme: ${currentTheme}`;
  };

  if (variant === "dropdown") {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button
          onClick={() => setTheme("light")}
          variant={theme === "light" ? "default" : "ghost"}
          size="sm"
          aria-label="Switch to light theme"
          aria-pressed={theme === "light"}
        >
          <LucideSun className="h-4 w-4 text-white dark:text-primary" />
          {showLabel && <span className="ml-2">Light</span>}
        </Button>
        <Button
          onClick={() => setTheme("dark")}
          variant={theme === "dark" ? "default" : "ghost"}
          size="sm"
          aria-label="Switch to dark theme"
          aria-pressed={theme === "dark"}
        >
          <LucideMoon className="h-4 w-4 text-white dark:text-background" />
          {showLabel && <span className="ml-2">Dark</span>}
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      className={`rounded-full hover:bg-accent hover:text-primary transition-colors md:justify-center lg:justify-start lg:w-full text-blue-gem-50 dark:text-green-yellow-100 ${className}`}
      aria-label={getAriaLabel()}
      title={`Current theme: ${getThemeLabel()}. Click to toggle theme.`}
    >
      {getThemeIcon()}

      <span className="sr-only">{getAriaLabel()}</span>
    </Button>
  );
};

export { ThemeSwitcher };
export type { ThemeSwitcherProps };
