"use client";

import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const Stories = () => {

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full px-6.5 mx-auto backdrop-blur-md rounded-lg relative">
      {/* Left Navigation Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={scrollLeft}
        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-background/90"
      >
        <ChevronLeft className="w-4 h-4 text-primary" />
      </Button>

      {/* Right Navigation Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={scrollRight}
        className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-background/90"
      >
        <ChevronRight className="w-4 h-4 text-primary" />
      </Button>

      <div 
        ref={scrollContainerRef}
        className="max-w-screen-md overflow-x-scroll no-scrollbar snap-x snap-mandatory"
      >
        <div className="flex gap-6 w-max px-3 ml-1">
          {/* Add Story Button */}
          <div className="flex flex-col items-center gap-1 snap-center">
            <Button
              variant="outline"
              className="w-16 h-16 rounded-full border-2 border-border/30 bg-muted shrink-0 hover:bg-primary/10"
            >
              +
            </Button>
            <p className="text-xs text-muted-foreground truncate w-16 text-center">
              Add Story
            </p>
          </div>

          {/* Story Circles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 snap-center"
            >
              <div className="w-16 h-16 rounded-full border-2 border-border dark:border-border/50 bg-muted shrink-0 cursor-pointer hover:border-primary/80 transition-colors" />
              <p className="text-xs text-muted-foreground truncate w-16 text-center">
                user_{i + 1}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { Stories };
