"use client";

import { useState } from "react";
import Link from "next/link";
import { CategoryTabs } from "@/components/category-tabs";
import { LiveStreamContent } from "@/components/live-streams/live-stream-content";
import { Button } from "@/components/ui/button";
import { Radio } from "lucide-react";

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
    <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Live Streams
            </h1>
            <Link href="/live-streams/create">
              <Button className="gap-2">
                <Radio className="h-4 w-4" />
                Go Live
              </Button>
            </Link>
          </div>
          <CategoryTabs
            categories={CATEGORIES}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </header>

        <main>
          <LiveStreamContent activeCategory={activeCategory} />
        </main>
      </div>
    </div>
  );
}
