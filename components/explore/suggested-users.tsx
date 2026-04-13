"use client";

import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { SuggestedUser } from "@/types/explore";
import { useFollowUser } from "@/features/profile/hooks/use-follow-user";
import { useUserRelationsStore } from "@/features/profile/stores/user-relations-store";

interface SuggestedUsersProps {
  users: SuggestedUser[];
}

export function SuggestedUsers({ users }: SuggestedUsersProps) {
  const following = useUserRelationsStore((state) => state.following);

  const visibleUsers = useMemo(() => {
    const seen = new Set<string>();

    return (users ?? []).filter((user) => {
      const normalizedId = user._id ? String(user._id) : "";
      const dedupeKey = normalizedId || user.username.toLowerCase();

      if (!dedupeKey || (normalizedId && following.has(normalizedId))) {
        return false;
      }

      if (seen.has(dedupeKey)) {
        return false;
      }

      seen.add(dedupeKey);
      return true;
    });
  }, [users, following]);

  if (!visibleUsers.length) {
    return null;
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            People to Follow
          </h2>
          <p className="text-sm text-muted-foreground">
            Connect with creators and thinkers you might enjoy.
          </p>
        </div>
        <button
          type="button"
          className="text-sm font-semibold text-secondary transition hover:text-secondary/80">
          See more
        </button>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {visibleUsers.map((user, index) => (
          <SuggestedUserCard key={`${user._id}-${index}`} user={user} />
        ))}
      </div>
    </section>
  );
}

function SuggestedUserCard({ user }: { user: SuggestedUser }) {
  const { isFollowing, isLoading, toggleFollow } = useFollowUser(
    user._id,
    user.isFollowing
  );

  return (
    <article className="overflow-hidden rounded-[28px] border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,248,247,0.88))] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl">
      <div className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <Avatar className="h-14 w-14 border-2 border-border/60 shadow-sm">
            <AvatarImage src={user.profilePicture} alt={user.name} />
            <AvatarFallback>
              <Image
                src="/profile_icon.jpg"
                alt="Profile"
                fill
                className="object-cover"
              />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-base font-semibold truncate">{user.name}</p>
              {user.blueTick && (
                <Image
                  src="/ticks/blue_tick.jpg"
                  alt="Verified"
                  width={20}
                  height={20}
                  className="h-5 w-5 flex-shrink-0"
                />
              )}
              {user.goldenTick && (
                <Image
                  src="/ticks/gold_tick.jpg"
                  alt="Gold Verified"
                  width={20}
                  height={20}
                  className="h-5 w-5 flex-shrink-0"
                />
              )}
              {user.prideTick && (
                <Image
                  src="/ticks/pride_tick.jpg"
                  alt="Pride Verified"
                  width={20}
                  height={20}
                  className="h-5 w-5 flex-shrink-0"
                />
              )}
              {user.businessTick && (
                <Image
                  src="/ticks/green_tick.jpg"
                  alt="Business Verified"
                  width={20}
                  height={20}
                  className="h-5 w-5 flex-shrink-0"
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {user.followersCount.toLocaleString()} followers
            </p>
          </div>
        </div>
        {user.bio && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {user.bio}
          </p>
        )}
        <Button
          className="w-full rounded-full"
          variant={isFollowing ? "outline" : "secondary"}
          size="sm"
          onClick={toggleFollow}
          disabled={isLoading}>
          {isFollowing ? "Following" : "Follow"}
        </Button>
      </div>
    </article>
  );
}
