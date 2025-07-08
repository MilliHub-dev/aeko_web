"use client";

import { LucideMoon, LucideSun, LucideMonitor } from "lucide-react";
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
  className = "" 
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
        <LucideSun className="h-4 w-4" />
      </Button>
    );
  }

  const cycleTheme = () => {
    const themes = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme || "system");
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <LucideSun className="h-4 w-4" />;
      case "dark":
        return <LucideMoon className="h-4 w-4" />;
      case "system":
        return <LucideMonitor className="h-4 w-4" />;
      default:
        return resolvedTheme === "dark" ? 
          <LucideMoon className="h-4 w-4" /> : 
          <LucideSun className="h-4 w-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
      default:
        return "Theme";
    }
  };

  const getAriaLabel = () => {
    const currentTheme = theme || "system";
    const nextTheme = {
      light: "dark",
      dark: "system",
      system: "light"
    }[currentTheme];
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
          <LucideSun className="h-4 w-4" />
          {showLabel && <span className="ml-2">Light</span>}
        </Button>
        <Button
          onClick={() => setTheme("dark")}
          variant={theme === "dark" ? "default" : "ghost"}
          size="sm"
          aria-label="Switch to dark theme"
          aria-pressed={theme === "dark"}
        >
          <LucideMoon className="h-4 w-4" />
          {showLabel && <span className="ml-2">Dark</span>}
        </Button>
        <Button
          onClick={() => setTheme("system")}
          variant={theme === "system" ? "default" : "ghost"}
          size="sm"
          aria-label="Switch to system theme"
          aria-pressed={theme === "system"}
        >
          <LucideMonitor className="h-4 w-4" />
          {showLabel && <span className="ml-2">System</span>}
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={cycleTheme}
      variant="ghost"
      size="icon"
      className={`transition-all duration-200 hover:scale-105 ${className}`}
      aria-label={getAriaLabel()}
      title={`Current theme: ${getThemeLabel()}. Click to cycle themes.`}
    >
      <div className="relative">
        {getThemeIcon()}
      </div>
      <span className="sr-only">
        {getAriaLabel()}
      </span>
    </Button>
  );
};

export { ThemeSwitcher };
export type { ThemeSwitcherProps };
