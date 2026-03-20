"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MemberAvatarStack } from "./member-avatar-stack";
import type { ExploreCommunity } from "@/types/explore";
import { cn } from "@/lib/utils";

interface CommunityCardProps {
  community: ExploreCommunity;
  variant?: "default" | "explore" | "compact";
  onFollowToggle?: (communityId: string, isFollowing: boolean) => void;
}

export function CommunityCard({
  community,
  variant = "default",
  onFollowToggle,
}: CommunityCardProps) {
  const handleFollowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFollowToggle) {
      onFollowToggle(community._id, !community.isFollowing);
    }
  };

  return (
    <Link
      href={`/communities/${community.slug || community._id}`}
      className={cn(
        "group relative block overflow-hidden rounded-[28px] border border-border/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,248,247,0.88))] shadow-sm transition-all duration-300",
        "hover:-translate-y-2 hover:shadow-xl hover:border-primary/30",
        variant === "compact" && "rounded-[20px]"
      )}>
      <div className="relative aspect-[4/3]">
        <Image
          src={community.cover}
          alt={community.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

        {/* Top badges */}
        <div className="absolute inset-x-4 top-4 flex items-center justify-between">
          <Badge className="rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
            {community.category}
          </Badge>
          {variant === "explore" && community.growth && (
            <Badge className="rounded-full bg-green-500/90 px-3 py-1 text-xs font-semibold text-white shadow-lg">
              {community.growth}
            </Badge>
          )}
        </div>

        {/* Bottom content */}
        <div className="absolute inset-x-4 bottom-4 space-y-3 text-white">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-tight line-clamp-1">
              {community.name}
            </h3>
            <p className="text-xs leading-relaxed text-white/90 line-clamp-2">
              {community.description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2">
            {community.membersCount !== undefined && (
              <MemberAvatarStack
                memberCount={community.membersCount}
                avatars={community.memberAvatars}
                size="sm"
              />
            )}

            {variant !== "compact" && (
              <Button
                onClick={handleFollowClick}
                variant="secondary"
                size="sm"
                className={cn(
                  "rounded-full px-4 text-xs font-semibold shadow-lg transition-all",
                  community.isFollowing
                    ? "bg-white/20 text-white hover:bg-white/30"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}>
                {community.isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop hover effect overlay */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hidden md:block pointer-events-none" />
    </Link>
  );
}
