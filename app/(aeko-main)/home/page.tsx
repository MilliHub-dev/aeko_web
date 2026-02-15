"use client";

import { PostCard } from "@/components/home/post/post-card";
import { usePostsStore } from "@/features/posts/stores";
import { ClientPostsFetcher } from "@/components/home/post/client-posts-fetcher";
import { Stories } from "@/components/home/story/stories";
import { useState, useRef, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAds } from "@/hooks/use-ads";
import { FeedPost } from "@/types/post";
import { MobileWhoToFollow } from "@/components/home/mobile-who-to-follow";

type FeedItem = FeedPost | { _id: string; isWhoToFollow: true };

export default function Home() {
  const posts = usePostsStore((state) => state.posts);
  const isFetching = usePostsStore((state) => state.isFetching);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"feed" | "reels">("feed");
  const containerRef = useRef<HTMLDivElement>(null);

  // Swipe logic
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeTab === "feed") {
      setActiveTab("reels");
    }
    if (isRightSwipe && activeTab === "reels") {
      setActiveTab("feed");
    }
  };

  const filteredPosts = useMemo(() => {
    if (activeTab === "reels") {
      return posts.filter((post) => post.type === "video");
    }
    return posts;
  }, [posts, activeTab]);

  const { ads } = useAds();

  const postsWithAds = useMemo(() => {
    const result: FeedItem[] = [];
    let adIndex = 0;
    
    // If no ads, just map filteredPosts to result
    if (ads.length === 0) {
      filteredPosts.forEach((post, index) => {
        result.push(post);
        // Insert "Who to follow" after 5 posts (index 4)
        if (index === 4) {
          result.push({ _id: "who-to-follow-section", isWhoToFollow: true });
        }
      });
      return result;
    }
    
    filteredPosts.forEach((post, index) => {
      result.push(post);
      
      // Insert "Who to follow" after 5 posts (index 4)
      if (index === 4) {
        result.push({ _id: "who-to-follow-section", isWhoToFollow: true });
      }

      // Insert ad after every 7 posts
      if ((index + 1) % 7 === 0) {
        // Use modulus to cycle through ads if we have more slots than ads
        const ad = ads[adIndex % ads.length];
        // Create a unique ID for the ad instance to avoid key conflicts
        result.push({ ...ad, _id: `${ad._id}-instance-${index}` });
        adIndex++;
      }
    });
    
    return result;
  }, [filteredPosts, ads]);

  // Reset scroll and index when tab changes
  useEffect(() => {
    setActiveIndex(0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [activeTab]);

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
        newIndex < postsWithAds.length
      ) {
        setActiveIndex(newIndex);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeIndex, postsWithAds.length]);

  return (
    <div 
      className="flex flex-col h-dvh overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <ClientPostsFetcher />

      {/* Header Section */}
      <div className="flex-none w-full md:max-w-2xl mx-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 border-b border-border/40">
        <Stories />
        
        {/* Tab Switcher */}
        <div className="flex w-full">
          <button
            onClick={() => setActiveTab("feed")}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors relative",
              activeTab === "feed" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Feed
            {activeTab === "feed" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("reels")}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors relative",
              activeTab === "reels" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Reels
            {activeTab === "reels" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
            )}
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className={cn(
          "flex-1 w-full flex flex-col items-center overflow-y-auto scrollbar-none",
          activeTab === "reels" && "snap-y snap-mandatory"
        )}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {isFetching && posts.length === 0 && (
          <div className="w-full flex justify-center py-6 flex-none">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {postsWithAds.length > 0 ? (
          postsWithAds.map((item, idx) => (
            <div
              key={`post-${item._id || idx}`}
              className={cn(
                "w-full flex justify-center flex-none",
                activeTab === "reels" ? "snap-start h-full" : "py-4",
                "isWhoToFollow" in item && "md:hidden"
              )}
            >
              {"isWhoToFollow" in item ? (
                 <div className="w-full h-full flex items-center justify-center bg-background/50 backdrop-blur-sm">
                    <MobileWhoToFollow />
                 </div>
              ) : (
                <PostCard {...(item as FeedPost)} isActive={idx === activeIndex} />
              )}
            </div>
          ))
        ) : (
          !isFetching && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <p>No {activeTab === "reels" ? "reels" : "posts"} available</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
