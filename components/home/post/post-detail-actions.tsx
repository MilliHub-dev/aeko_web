"use client";

import { Heart, Share2, Bookmark, MessageCircle } from "lucide-react";
import { ReAeko } from "@/lib/icons";
import { usePostsStore } from "@/features/posts/stores";
import { useUser } from "@/components/shared/user-context";
import { useState } from "react";
import { SharePostModal } from "./share-post-modal";
import { FeedPost } from "@/types/post";

interface PostDetailActionsProps {
  postId: string;
  post?: FeedPost;
  likes: number;
  shares: number;
  bookmarks: number;
  comments: number;
  reposts: number;
}

export function PostDetailActions({
  postId,
  post,
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
    repost,
    bookmarkedPosts,
    posts,
  } = usePostsStore();
  const { user } = useUser();
  const userId = user?._id ?? user?.id;
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Get current post from store if available, otherwise use props
  const storePost = posts.find((p) => p._id === postId) || post;

  const isLiked = userId ? (storePost?.likes?.includes(userId) ?? false) : false;
  const isBookmarked = bookmarkedPosts.has(postId) || (userId ? (storePost?.bookmarks?.includes(userId) ?? false) : false);
  const isReposted = userId ? (storePost?.reposts?.includes(userId) ?? false) : false;

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
          onClick={() => userId && toggleLike(postId, userId)}
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
          onClick={() => setIsShareModalOpen(true)}
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
        <button
          onClick={() => repost && repost(postId, userId)}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <ReAeko 
            strokeWidth={4} 
            className={`w-6 h-6 transition-colors ${
              isReposted ? "text-[var(--color-green-cyan-normal)]" : "text-gray-400"
            }`} 
          />
          <span className={`text-sm font-medium ${isReposted ? "text-[var(--color-green-cyan-normal)]" : ""}`}>
            {formatCount(currentReposts)}
          </span>
        </button>
      </div>

      {storePost && (
        <SharePostModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          post={storePost}
        />
      )}
    </div>
  );
}
