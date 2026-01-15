"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { ExploreCommunity } from "@/types/explore";

interface ExploreCommunitiesProps {
  communities: ExploreCommunity[];
}

export function ExploreCommunities({ communities }: ExploreCommunitiesProps) {
  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Communities to Explore
          </h2>
          <p className="text-sm text-muted-foreground">
            Discover circles sharing stories, challenges, and new drops.
          </p>
        </div>
        <button
          type="button"
          className="text-sm font-semibold text-secondary transition hover:text-secondary/80">
          See more
        </button>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {communities.map((community) => (
          <article
            key={community._id}
            className="overflow-hidden rounded-[28px] border border-border/60 bg-background shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="relative aspect-4/3">
              <Image
                fill
                src={community.cover}
                alt={community.name}
                sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/20 to-black/60" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-4 text-white">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  {community.category}
                </span>
                {community.membersCount !== undefined && (
                  <span className="text-xs font-medium text-white/85">
                    {community.membersCount.toLocaleString()} members
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-4 p-5">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {community.name}
                </h3>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {community.description}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="h-9 w-full text-sm font-semibold">
                Follow
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
