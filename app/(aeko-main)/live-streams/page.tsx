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
    <div className="space-y-5 px-6 min-h-screen">
      <div className="sticky top-16 md:top-0 z-10 mb-6 pt-12  text-black bg-background">
        <div>
          <h1 className="hidden md:block text-3xl font-semibold">
            Live Streams
          </h1>
        </div>
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      </div>

      <LiveStreamContent activeCategory={activeCategory} />
    </div>
  );
}
