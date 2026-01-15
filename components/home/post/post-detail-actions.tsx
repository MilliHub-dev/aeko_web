"use client";

import { Heart, Share2, Bookmark, MessageCircle } from "lucide-react";
import { ReAeko } from "@/lib/icons";
import { usePostsStore } from "@/features/posts/stores";

interface PostDetailActionsProps {
  postId: string;
  likes: number;
  shares: number;
  bookmarks: number;
  comments: number;
  reposts: number;
}

export function PostDetailActions({
  postId,
  likes,
  shares,
  bookmarks,
  comments,
  reposts,
}: PostDetailActionsProps) {
  const {
    toggleLike,
    toggleBookmark,
    incrementShare,
    likedPosts,
    bookmarkedPosts,
    posts,
  } = usePostsStore();

  const isLiked = likedPosts.has(postId);
  const isBookmarked = bookmarkedPosts.has(postId);

  // Get current post from store if available, otherwise use props
  const storePost = posts.find((p) => p._id === postId);
  const currentLikes = storePost?.likesCount ?? likes ?? 0;
  const currentShares = storePost?.engagement?.totalShares ?? shares ?? 0;
  const currentComments = storePost?.commentsCount ?? comments ?? 0;
  const currentReposts = storePost?.reposts?.length ?? reposts ?? 0;

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="border-y border-border py-4 px-6">
      <div className="flex items-center justify-around gap-4">
        {/* Like */}
        <button
          onClick={() => toggleLike(postId)}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity group">
          <Heart
            className={`w-6 h-6 transition-colors ${
              isLiked ? "fill-red-500 text-red-500" : "text-foreground"
            }`}
          />
          <span
            className={`text-sm font-medium ${isLiked ? "text-red-500" : ""}`}>
            {formatCount(currentLikes)}
          </span>
        </button>

        {/* Share */}
        <button
          onClick={() => incrementShare && incrementShare(postId)}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <Share2 className="w-6 h-6" />
          <span className="text-sm font-medium">
            {formatCount(currentShares)}
          </span>
        </button>

        {/* Bookmark */}
        <button
          onClick={() => toggleBookmark && toggleBookmark(postId)}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <Bookmark
            className={`w-6 h-6 ${isBookmarked ? "fill-current" : ""}`}
          />
          <span className="text-sm font-medium">
            {bookmarks > 0 ? formatCount(bookmarks) : ""}
          </span>
        </button>

        {/* Comment */}
        <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <MessageCircle className="w-6 h-6" />
          <span className="text-sm font-medium">
            {formatCount(currentComments)}
          </span>
        </button>

        {/* Repost */}
        <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <ReAeko strokeWidth={4} className="w-6 h-6" />
          <span className="text-sm font-medium">
            {formatCount(currentReposts)}
          </span>
        </button>
      </div>
    </div>
  );
}
