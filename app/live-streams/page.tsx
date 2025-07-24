"use client";

import { CategoryTabs } from "@/components/category-tabs";
import { LiveStreamContent } from "@/components/live-streams/live-stream-content";
import { useState } from "react";

export default function LiveStreamsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = [
    "All",
    "Gaming",
    "Music",
    "Talk Shows",
    "Sports",
    "Education",
    "Creative",
  ];

  return (
    <div className="space-y-6 px-4 min-h-screen">
      <div className="sticky top-16 md:top-0 z-10 bg-background mb-6 pt-4 border-b border-primary/30 -mx-4 px-4">
        <h1 className="hidden md:inline text-2xl font-bold text-primary dark:text-green-yellow-300">
          Live Streams
        </h1>
        <div className="bg-background/95 backdrop-blur-sm pb-2 pt-2">
          {/* Category Tabs */}
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>
      </div>
      <LiveStreamContent activeCategory={activeCategory} />
    </div>
  );
}
