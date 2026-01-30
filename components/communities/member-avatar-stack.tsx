"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MemberAvatarStackProps {
  memberCount: number;
  avatars?: string[]; // Array of avatar URLs (max 3 will be shown)
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

export function MemberAvatarStack({
  memberCount,
  avatars = [],
  className,
  size = "md",
}: MemberAvatarStackProps) {
  const displayAvatars = avatars.slice(0, 3);
  const formattedCount =
    memberCount >= 1000
      ? `${(memberCount / 1000).toFixed(1)}k`
      : memberCount.toString();

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-xs text-white/90",
        className
      )}>
      <div className="flex -space-x-2">
        {displayAvatars.map((avatar, index) => (
          <Avatar
            key={index}
            className={cn(
              "border-2 border-white ring-1 ring-white/20",
              sizeClasses[size]
            )}>
            <AvatarImage src={avatar} alt="Community member" />
            <AvatarFallback className="bg-primary/20 text-[10px] text-white">
              <Image
                src="/profile_icon.jpg"
                alt="Profile"
                fill
                className="object-cover"
              />
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      <span className="font-medium">+ {formattedCount} others</span>
    </div>
  );
}
