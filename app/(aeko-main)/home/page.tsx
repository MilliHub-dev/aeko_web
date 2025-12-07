"use client";

import { PostCard } from "@/components/home/post/post-card";
import { usePostsStore } from "@/features/posts/stores";
import { ClientPostsFetcher } from "@/components/home/post/client-posts-fetcher";
import { useState, useRef, useEffect } from "react";

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

      if (
        newIndex !== activeIndex &&
        newIndex >= 0 &&
        newIndex < posts.length
      ) {
        setActiveIndex(newIndex);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeIndex, posts.length]);

  return (
    <>
      <ClientPostsFetcher />
      <div
        ref={containerRef}
        className="h-dvh flex flex-col items-center overflow-y-auto snap-y snap-mandatory scrollbar-none"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}>
        {isFetching && posts.length === 0 ? (
          <div className="flex items-center justify-center p-8 h-full">
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : (
          posts.map((post, idx) => (
            <div key={`post-${post._id || idx}`} className="snap-start h-dvh">
              <PostCard {...post} isActive={idx === activeIndex} />
            </div>
          ))
        )}
      </div>
    </>
  );
}
