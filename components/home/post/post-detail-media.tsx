"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FeedPost } from "@/types/post";
import { API_BASE_URL } from "@/lib/config";
import { cn } from "@/lib/utils";
import { useUser } from "@/components/shared/user-context";
import { useFollowUser } from "@/features/profile/hooks/use-follow-user";

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

interface PostDetailMediaProps {
  post: FeedPost;
  className?: string;
}

export function PostDetailMedia({ post, className }: PostDetailMediaProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user: currentUser } = useUser();
  
  // Resolve media list
  const mediaList = post.mediaUrls && post.mediaUrls.length > 0 
    ? post.mediaUrls 
    : (Array.isArray(post.media) ? post.media : (post.media ? [post.media] : []));
    
  const currentMedia = mediaList[currentIndex];
  const resolvedMedia = getMediaUrl(currentMedia);
  // Determine if video based on extension or post type (fallback)
  const isVideo = currentMedia?.endsWith(".mp4") || currentMedia?.endsWith(".webm") || currentMedia?.endsWith(".mov") || (mediaList.length === 1 && post.type === "video");

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < mediaList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const displayName = post.user?.name || "Unknown User";
  const displayHandle = post.user?.username || "";
  const displayProfileImage = post.user?.profilePicture || "";

  const targetUserId = post.user?._id || "";
  const currentUserId = currentUser?._id || currentUser?.id;
  const isOwnPost = currentUserId && targetUserId && currentUserId === targetUserId;
  const { isFollowing, toggleFollow } = useFollowUser(targetUserId);
  const showFollowButton = targetUserId && !isOwnPost && !isFollowing;

  const MAX_LENGTH = 150;
  const shouldTruncate = post.text ? post.text.length > MAX_LENGTH : false;
  const displayText =
    post.text && shouldTruncate && !isExpanded
      ? post.text.slice(0, MAX_LENGTH) + "..."
      : post.text;

  // Extract hashtags from text (simple implementation)
  const hashtags: string[] = [];

  return (
    <div className={cn("relative w-full min-h-[100dvh] bg-black", className)}>
      {/* Media Content */}
      {resolvedMedia && (
        <div className="relative w-full h-full">
          {isVideo ? (
            <video
              key={resolvedMedia}
              src={resolvedMedia}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <Image
              src={resolvedMedia}
              alt="Post media"
              fill
              className="object-cover"
              priority
            />
          )}

          {/* Navigation Controls */}
          {mediaList.length > 1 && (
             <>
               {currentIndex > 0 && (
                 <button 
                   onClick={handlePrev}
                   className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-20"
                 >
                   <ChevronLeft className="w-8 h-8" />
                 </button>
               )}
               {currentIndex < mediaList.length - 1 && (
                 <button 
                   onClick={handleNext}
                   className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-20"
                 >
                   <ChevronRight className="w-8 h-8" />
                 </button>
               )}
               
               {/* Pagination Dots */}
               <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-2 z-20">
                 {mediaList.map((_, idx) => (
                   <div 
                     key={idx} 
                     className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentIndex ? "bg-white" : "bg-white/40"}`}
                   />
                 ))}
               </div>
             </>
           )}
        </div>
      )}

      {/* Bottom Overlay with User Info and Content */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-6 pb-24 pt-32">
        <div className="space-y-4">
          {/* User Info with Follow Button */}
          <div className="flex items-center justify-between">
            <Link 
              href={`/${displayHandle}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Avatar className="w-12 h-12 ring-2 ring-white/20">
                <AvatarImage src={displayProfileImage} alt={displayName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Image
                    src="/profile_icon.jpg"
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-white text-base flex items-center gap-1">
                  {displayName}
                  {post.user?.blueTick && (
                    <Image
                      src="/ticks/blue_tick.jpg"
                      alt="Verified"
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />
                  )}
                  {post.user?.goldenTick && (
                    <Image
                      src="/ticks/gold_tick.jpg"
                      alt="Gold Verified"
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />
                  )}
                  {post.user?.prideTick && (
                    <Image
                      src="/ticks/pride_tick.jpg"
                      alt="Pride Verified"
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />
                  )}
                  {post.user?.businessTick && (
                    <Image
                      src="/ticks/green_tick.jpg"
                      alt="Business Verified"
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />
                  )}
                </span>
                <span className="text-sm text-white/70">@{displayHandle}</span>
              </div>
            </Link>

            {/* Follow Button */}
            {showFollowButton && (
              <Button
                size="sm"
                onClick={(e) => toggleFollow(e)}
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-5 font-semibold">
                Follow
              </Button>
            )}
          </div>

          {/* Post Text */}
          {post.text && (
            <div className="space-y-2">
              <p className="text-white text-base leading-relaxed whitespace-pre-wrap">
                {displayText}
              </p>

              {shouldTruncate && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-primary hover:text-primary/80 font-medium text-sm transition-colors">
                  {isExpanded ? "Show less" : "see more"}
                </button>
              )}
            </div>
          )}

          {/* Hashtags */}
          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="text-primary hover:underline cursor-pointer text-sm font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Timestamp */}
          <div className="text-sm text-white/60">
            {new Date(post.createdAt).toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
