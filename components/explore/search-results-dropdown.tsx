"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SuggestedUser, ExploreCommunity } from "@/types/explore";

interface SearchResultsDropdownProps {
  users: SuggestedUser[];
  communities: ExploreCommunity[];
  isLoading: boolean;
  query: string;
  className?: string;
}

export function SearchResultsDropdown({
  users,
  communities,
  isLoading,
  query,
  className,
}: SearchResultsDropdownProps) {
  const hasResults = users.length > 0 || communities.length > 0;

  if (!query) return null;

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-3xl rounded-2xl border border-border/60 bg-background shadow-xl",
        className
      )}>
      {isLoading ? (
        <div className="p-6 text-center text-sm text-muted-foreground">
          Searching...
        </div>
      ) : !hasResults ? (
        <div className="p-6 text-center text-sm text-muted-foreground">
          No results found for "{query}"
        </div>
      ) : (
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Users Section */}
          {users.length > 0 && (
            <div className="border-b border-border/30 last:border-b-0">
              <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                People ({users.length})
              </div>
              <div className="divide-y divide-border/30">
                {users.map((user) => (
                  <Link
                    key={user._id}
                    href={`/home/@${user.username}`}
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-muted/50">
                    <Avatar className="h-12 w-12 border border-border/60">
                      <AvatarImage
                        src={user.profilePicture || user.avatar || ""}
                        alt={user.name}
                      />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-semibold">
                          {user.name}
                        </p>
                        {user.blueTick && (
                          <div className="shrink-0 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                            <Check className="h-2.5 w-2.5 text-white" />
                          </div>
                        )}
                        {user.goldenTick && (
                          <div className="shrink-0 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-500">
                            <Check className="h-2.5 w-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        @{user.username}
                      </p>
                      {user.bio && (
                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                          {user.bio}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.followersCount.toLocaleString()} followers
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Communities Section */}
          {communities.length > 0 && (
            <div className="border-b border-border/30 last:border-b-0">
              <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Communities ({communities.length})
              </div>
              <div className="divide-y divide-border/30">
                {communities.map((community) => (
                  <Link
                    key={community._id}
                    href={`/communities/${community._id}`}
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-muted/50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {community.name}
                      </p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {community.description}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {community.category}
                      </p>
                    </div>
                    {community.membersCount !== undefined && (
                      <div className="text-xs text-muted-foreground">
                        {community.membersCount.toLocaleString()} members
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
