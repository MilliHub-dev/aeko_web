"use client";

import { PostCard } from "@/components/home/post/post-card";
import { usePostsStore } from "@/features/posts/stores";
import { ClientPostsFetcher } from "@/components/home/post/client-posts-fetcher";
import { Stories } from "@/components/home/story/stories";
import { useState, useRef, useEffect } from "react";
// import type { Viewport } from "next";

// export const viewport: Viewport = {
//   themeColor: "black",
// };

import { Loader2 } from "lucide-react";

export default function Home() {
  const posts = usePostsStore((state) => state.posts);
  const isFetching = usePostsStore((state) => state.isFetching);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const windowHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / windowHeight);

      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < posts.length) {
        setActiveIndex(newIndex);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeIndex, posts.length]);

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <ClientPostsFetcher />
      
      {/* Stories Bar */}
      <div className="flex-none w-full md:max-w-2xl mx-auto border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <Stories />
      </div>

      <div
        ref={containerRef}
        className="flex-1 w-full flex flex-col items-center overflow-y-auto snap-y snap-mandatory scrollbar-none"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {isFetching && (
          <div className="w-full flex justify-center py-6 flex-none">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {posts.length > 0 ? (
          posts.map((post, idx) => (
            <div key={`post-${post._id || idx}`} className="snap-start h-full w-full flex justify-center flex-none">
              <PostCard {...post} isActive={idx === activeIndex} />
            </div>
          ))
        ) : (
          !isFetching && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <p>No posts available</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
