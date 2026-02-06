"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";

// Helper to resolve media URLs
const getMediaUrl = (url?: string) => {
  if (!url) return "";
  
  // Handle dummy/example URLs from backend
  if (url.includes("example.com") || url.includes("arrObj")) {
    return "/placeholder.svg";
  }

  if (url.startsWith("http") || url.startsWith("data:")) return url;
  
  const localPrefixes = ["/avatars", "/posts", "/stories", "/users", "/fonts", "/icons", "/profile", "/placeholder", "/aeko", "/blue_tick", "/gold_tick", "/cover", "/demo"];
  if (localPrefixes.some(prefix => url.startsWith(prefix))) {
    return url;
  }
  
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

interface PostMediaCarouselProps {
  items: string[];
  className?: string;
}

export function PostMediaCarousel({ items, className }: PostMediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const currentItem = items[currentIndex];
  const resolved = getMediaUrl(currentItem);
  const isVideo = currentItem?.endsWith(".mp4") || currentItem?.endsWith(".webm") || currentItem?.endsWith(".mov");

  return (
    <div className={cn("relative w-full h-full bg-white overflow-hidden group", className)}>
      {/* Media */}
      <div className="w-full h-full relative flex items-center justify-center bg-white">
        {isVideo ? (
           <>
             <video src={resolved} className="w-full h-full object-contain" />
             <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
               <div className="p-3 bg-black/40 rounded-full backdrop-blur-sm">
                 <Play className="w-6 h-6 text-white fill-white" />
               </div>
             </div>
           </>
        ) : (
          <Image
            src={resolved}
            alt={`Slide ${currentIndex + 1}`}
            fill
            className="object-contain"
          />
        )}
      </div>

      {/* Controls */}
      {items.length > 1 && (
        <>
          {/* Prev Button */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-opacity z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Next Button */}
          {currentIndex < items.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-opacity z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Dots */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none z-10">
            {items.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all shadow-sm",
                  idx === currentIndex ? "bg-white scale-110" : "bg-white/40"
                )}
              />
            ))}
          </div>
          
          {/* Index Counter */}
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/60 text-white text-xs font-medium pointer-events-none z-10">
            {currentIndex + 1}/{items.length}
          </div>
        </>
      )}
    </div>
  );
}
