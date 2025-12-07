"use client";

import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface ExploreHeaderProps {
  className?: string;
}

export function ExploreHeader({ className }: ExploreHeaderProps) {
  return (
    <header
      className={cn("flex items-center justify-between gap-6", className)}>
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Explore
        </h1>
      </div>
    </header>
  );
}

interface HeaderIconButtonProps {
  icon: LucideIcon;
  label: string;
  variant?: "default" | "accent";
}

function HeaderIconButton({
  icon: Icon,
  label,
  variant = "default",
}: HeaderIconButtonProps) {
  const baseStyles =
    "flex h-12 w-12 items-center justify-center rounded-full border border-transparent bg-muted/60 text-muted-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";
  const accentStyles =
    "bg-secondary/15 text-secondary border-secondary/20 hover:bg-secondary/25";

  return (
    <button
      type="button"
      aria-label={label}
      className={cn(baseStyles, variant === "accent" && accentStyles)}>
      <Icon className="h-5 w-5" />
    </button>
  );
}
