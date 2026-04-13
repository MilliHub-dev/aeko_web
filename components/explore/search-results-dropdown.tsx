"use client";

import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SuggestedUser, ExploreCommunity } from "@/types/explore";
import type { FeedPost } from "@/types/post";

interface SearchResultsDropdownProps {
  users: SuggestedUser[];
  communities: ExploreCommunity[];
  posts?: FeedPost[];
  isLoading: boolean;
  query: string;
  className?: string;
}

export function SearchResultsDropdown({
  users,
  communities,
  posts = [],
  isLoading,
  query,
  className,
}: SearchResultsDropdownProps) {
  const hasResults = users.length > 0 || communities.length > 0 || posts.length > 0;

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
          {/* Posts Section */}
          {posts.length > 0 && (
            <div className="border-b border-border/30 last:border-b-0">
              <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Posts ({posts.length})
              </div>
              <div className="divide-y divide-border/30">
                {posts.slice(0, 5).map((post, index) => (
                  <Link
                    key={`${post._id}-${index}`}
                    href={`/${encodeURIComponent(post.user.username)}/posts/${post._id}`}
                    className="flex items-start gap-3 px-4 py-3 transition hover:bg-muted/50">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-2 text-sm font-medium">
                        {post.text || "Media Post"}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>@{post.user.username}</span>
                        <span>•</span>
                        <span>{post.likesCount || 0} likes</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Users Section */}
          {users.length > 0 && (
            <div className="border-b border-border/30 last:border-b-0">
              <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                People ({users.length})
              </div>
              <div className="divide-y divide-border/30">
                {users.map((user, index) => (
                  <Link
                    key={`${user._id}-${index}`}
                    href={`/${encodeURIComponent(user.username)}`}
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-muted/50">
                    <Avatar className="h-12 w-12 border border-border/60">
                      <AvatarImage
                        src={user.profilePicture || user.avatar || undefined}
                        alt={user.name}
                      />
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
                        <p className="truncate text-sm font-semibold">
                          {user.name}
                        </p>
                        {user.blueTick && (
                          <Image
                            src="/ticks/blue_tick.jpg"
                            alt="Verified"
                            width={20}
                            height={20}
                            className="h-5 w-5 shrink-0"
                          />
                        )}
                        {user.goldenTick && (
                          <Image
                            src="/ticks/gold_tick.jpg"
                            alt="Gold Verified"
                            width={20}
                            height={20}
                            className="h-5 w-5 shrink-0"
                          />
                        )}
                        {user.prideTick && (
                          <Image
                            src="/ticks/pride_tick.jpg"
                            alt="Pride Verified"
                            width={20}
                            height={20}
                            className="h-5 w-5 shrink-0"
                          />
                        )}
                        {user.businessTick && (
                          <Image
                            src="/ticks/green_tick.jpg"
                            alt="Business Verified"
                            width={20}
                            height={20}
                            className="h-5 w-5 shrink-0"
                          />
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
                {communities.map((community, index) => (
                  <Link
                    key={`${community._id}-${index}`}
                    href={`/communities/${community.slug || community._id}`}
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
