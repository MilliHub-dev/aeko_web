"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define interfaces
interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const CategoryTabs = ({
  categories,
  activeCategory,
  setActiveCategory,
}: CategoryTabsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-[calc(100%+30px)] -ml-5 md:w-full md:mx-auto md:px-6.5 lg:px-3 backdrop-blur-md rounded-lg relative">
      {/* Left Navigation Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={scrollLeft}
        className="hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-background/90 justify-center items-center"
      >
        <ChevronLeft className="w-4 h-4 text-primary" />
      </Button>

      {/* Right Navigation Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={scrollRight}
        className="hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-background/90 justify-center items-center"
      >
        <ChevronRight className="w-4 h-4 text-primary" />
      </Button>

      <div
        ref={scrollContainerRef}
        className="max-w-screen-md flex overflow-x-auto pb-3 pt-2 snap-x snap-mandatory no-scrollbar"
      >
        <div className="flex gap-2 px-3 md:ml-1 lg:ml-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors snap-center ${
                activeCategory === category
                  ? "bg-primary text-white"
                  : "border border-primary text-black "
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export { CategoryTabs };
