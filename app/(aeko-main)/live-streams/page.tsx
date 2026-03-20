"use client";

import { useState } from "react";
import Link from "next/link";
import { CategoryTabs } from "@/components/category-tabs";
import { LiveStreamContent } from "@/components/live-streams/live-stream-content";
import { Button } from "@/components/ui/button";
import { Radio, Sparkles } from "lucide-react";

const CATEGORIES = [
  "All",
  "Gaming",
  "Music",
  "Talk Shows",
  "Sports",
  "Education",
  "Creative",
  "Technology",
  "Entertainment",
];

export default function LiveStreamsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(70%_120%_at_0%_0%,rgba(0,127,109,0.18),transparent_55%),radial-gradient(55%_100%_at_100%_10%,rgba(15,23,42,0.12),transparent_55%)]" />
      <section className="relative overflow-hidden rounded-[32px] border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,248,247,0.92))] shadow-[0_26px_90px_-56px_rgba(15,23,42,0.45)]">
        <div className="flex flex-col gap-6 p-5 md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Broadcast
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Live Streams
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                  Discover rooms that are heating up right now and jump straight into the conversation.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 shadow-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Category
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">{activeCategory}</p>
              </div>
              <Link href="/live-streams/create">
                <Button className="gap-2 rounded-full">
                  <Radio className="h-4 w-4" />
                  Go Live
                </Button>
              </Link>
            </div>
          </div>

          <CategoryTabs
            categories={CATEGORIES}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>
      </section>

      <main className="relative">
        <LiveStreamContent activeCategory={activeCategory} />
      </main>
    </div>
  );
}
