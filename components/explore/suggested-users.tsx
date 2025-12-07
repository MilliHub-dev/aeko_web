"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import type { SuggestedUser } from "@/types/explore";

interface SuggestedUsersProps {
  users: SuggestedUser[];
}

export function SuggestedUsers({ users }: SuggestedUsersProps) {
  if (!users || users.length === 0) {
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
        {users.map((user) => (
          <SuggestedUserCard key={user._id} user={user} />
        ))}
      </div>
    </section>
  );
}

function SuggestedUserCard({ user }: { user: SuggestedUser }) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-border/60 bg-background shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <Avatar className="h-14 w-14 border-2 border-border/60">
            <AvatarImage src={user.profilePicture} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-base font-semibold truncate">{user.name}</p>
              {user.blueTick && (
                <div className="flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
              {user.goldenTick && (
                <div className="flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-500">
                  <Check className="h-3 w-3 text-white" />
                </div>
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
          className="w-full"
          variant={user.isFollowing ? "outline" : "secondary"}
          size="sm">
          {user.isFollowing ? "Following" : "Follow"}
        </Button>
      </div>
    </article>
  );
}
