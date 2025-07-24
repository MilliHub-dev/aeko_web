"use client";

import { CategoryTabs } from "@/components/category-tabs";
import { ExploreContent } from "@/components/explore/explore-content";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const categories = [
  "For You",
  "Trending",
  "DeFi",
  "NFTs",
  "Trading",
  "Technology",
];

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState<string>("For You");

  return (
    <div className="space-y-6 px-4">
      <div className="sticky top-16 md:top-0 z-10 bg-background mb-6 pt-4 border-b border-primary/30 -mx-4 px-4">
        <h1 className="hidden md:inline text-2xl font-bold text-primary dark:text-green-yellow-300">
          Explore
        </h1>
        <div className="bg-background/95 backdrop-blur-sm pb-2 pt-2">
          <div className="md:hidden mb-4">
            <Input
              placeholder="Search topics..."
              className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-full"
            />
          </div>
          {/* Category Tabs */}
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>
      </div>
      <ExploreContent />
    </div>
  );
}
