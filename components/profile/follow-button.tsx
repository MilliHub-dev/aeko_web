"use client";

import { Button } from "@/components/ui/button";
import { useFollowUser } from "@/features/profile/hooks/use-follow-user";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  userId: string;
  initialIsFollowing?: boolean;
  className?: string;
}

export function FollowButton({ userId, initialIsFollowing = false, className }: FollowButtonProps) {
  const { isFollowing, isLoading, toggleFollow } = useFollowUser(userId, initialIsFollowing);

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      className={cn("min-w-[100px]", className)}
      onClick={toggleFollow}
      disabled={isLoading}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
