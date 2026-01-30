"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { UserPlus } from "lucide-react";
import { FeedPost } from "@/types/post";

interface PostDetailTextProps {
  post: FeedPost;
}

export function PostDetailText({ post }: PostDetailTextProps) {
  const displayName = post.user?.name || "Unknown User";
  const displayHandle = post.user?.username || "";
  const displayProfileImage = post.user?.profilePicture || "";

  // Extract hashtags from text (simple implementation)
  const hashtags: string[] = [];
  const taggedUsers: string[] = [];

  return (
    <div className="px-6 py-4 space-y-4">
      {/* User Info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={displayProfileImage} alt={displayName} />
            <AvatarFallback>
              <Image
                src="/profile_icon.jpg"
                alt="Profile"
                fill
                className="object-cover"
              />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-base">{displayName}</span>
            <span className="text-sm text-muted-foreground">
              @{displayHandle}
            </span>
          </div>
        </div>

        {/* Follow Button */}
        <Button
          size="sm"
          className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-4">
          <UserPlus className="w-4 h-4 mr-1" />
          Follow
        </Button>
      </div>

      {/* Post Content */}
      <div className="space-y-3">
        {post.text && (
          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {post.text}
          </p>
        )}

        {/* Hashtags */}
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, i) => (
              <span
                key={i}
                className="text-primary hover:underline cursor-pointer text-sm">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Tagged Users */}
        {taggedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {taggedUsers.map((user, i) => (
              <span
                key={i}
                className="text-primary hover:underline cursor-pointer text-sm">
                @{user}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Timestamp */}
      <div className="text-sm text-muted-foreground">
        {new Date(post.createdAt).toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </div>
    </div>
  );
}
