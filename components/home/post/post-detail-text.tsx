"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { FeedPost } from "@/types/post";
import { useUser } from "@/components/shared/user-context";
import { useFollowUser } from "@/features/profile/hooks/use-follow-user";

interface PostDetailTextProps {
  post: FeedPost;
}

export function PostDetailText({ post }: PostDetailTextProps) {
  const { user: currentUser } = useUser();
  const displayName = post.user?.name || "Unknown User";
  const displayHandle = post.user?.username || "";
  const displayProfileImage = post.user?.profilePicture || "";

  const targetUserId = post.user?._id || "";
  const currentUserId = currentUser?._id || currentUser?.id;
  const isOwnPost = currentUserId && targetUserId && currentUserId === targetUserId;
  const { isFollowing, toggleFollow } = useFollowUser(targetUserId);
  const showFollowButton = targetUserId && !isOwnPost && !isFollowing;

  // Extract hashtags from text (simple implementation)
  const hashtags: string[] = [];
  const taggedUsers: string[] = [];

  return (
    <div className="px-4 py-4 md:px-6 space-y-4">
      {/* User Info */}
      <div className="flex items-start justify-between">
        <Link 
          href={`/${displayHandle}`}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
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
            <span className="font-semibold text-base flex items-center gap-1">
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
            <span className="text-sm text-muted-foreground">
              @{displayHandle}
            </span>
          </div>
        </Link>

        {/* Follow Button */}
        {showFollowButton && (
          <Button
            size="sm"
            onClick={(e) => toggleFollow(e)}
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-4">
            <UserPlus className="w-4 h-4 mr-1" />
            Follow
          </Button>
        )}
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
