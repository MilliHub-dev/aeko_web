"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FeedPost } from "@/types/post";

interface PostDetailMediaProps {
  post: FeedPost;
}

export function PostDetailMedia({ post }: PostDetailMediaProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayName = post.user?.name || "Unknown User";
  const displayHandle = post.user?.username || "";
  const displayProfileImage = post.user?.profilePicture || "";

  const MAX_LENGTH = 150;
  const shouldTruncate = post.text ? post.text.length > MAX_LENGTH : false;
  const displayText =
    post.text && shouldTruncate && !isExpanded
      ? post.text.slice(0, MAX_LENGTH) + "..."
      : post.text;

  // Extract hashtags from text (simple implementation)
  const hashtags: string[] = [];

  return (
    <div className="relative w-full min-h-screen bg-black">
      {/* Media Content */}
      {post.type === "image" && post.media && (
        <div className="relative w-full h-screen">
          <Image
            src={post.media}
            alt="Post media"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {post.type === "video" && post.media && (
        <div className="relative w-full h-screen">
          <video
            src={post.media}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      )}

      {/* Bottom Overlay with User Info and Content */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-6 pb-24 pt-32">
        <div className="space-y-4">
          {/* User Info with Follow Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 ring-2 ring-white/20">
                <AvatarImage src={displayProfileImage} alt={displayName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-white text-base">
                  {displayName}
                </span>
                <span className="text-sm text-white/70">@{displayHandle}</span>
              </div>
            </div>

            {/* Follow Button */}
            <Button
              size="sm"
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-5 font-semibold">
              Follow
            </Button>
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
