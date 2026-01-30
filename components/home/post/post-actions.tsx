import { Heart, Share2, Bookmark, MessageCircle } from "lucide-react";
import clsx from "clsx";
import { Metric } from "./post-metric";
import { ReAeko } from "@/lib/icons";
import { usePostUIStore, usePostsStore } from "@/features/posts/stores";
import { Comment } from "@/types/comment";
import { useUser } from "@/components/shared/user-context";
import { useState } from "react";
import { SharePostModal } from "./share-post-modal";
import { FeedPost } from "@/types/post";
import { formatCount } from "@/lib/utils";

interface PostActionsProps {
  likes: number;
  shares: number;
  bookmarks: number;
  comments: number;
  reposts: number;
  postId: string;
  post?: FeedPost;
  orientation?: "vertical" | "horizontal";
  className?: string;
}

const PostActions = ({
  likes,
  shares,
  bookmarks,
  comments,
  reposts,
  postId,
  post,
  orientation = "vertical",
  className = "",
}: Partial<PostActionsProps>) => {
  const { openCommentsPanel } = usePostUIStore();
  const { user } = useUser();
  const { toggleLike, toggleBookmark, incrementShare, repost, bookmarkedPosts, posts } =
    usePostsStore();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Get current post from store if available, otherwise use props
  const storePost = posts.find((p) => p._id === postId) || post;
  const userId = user?._id ?? user?.id;
  const isLiked = userId ? (storePost?.likes?.includes(userId) ?? false) : false;
  const isBookmarked = bookmarkedPosts.has(postId!);

  const currentLikes = storePost?.likesCount ?? likes ?? 0;
  const currentShares = storePost?.engagement?.totalShares ?? shares ?? 0;
  const currentBookmarks = storePost?.bookmarksCount ?? bookmarks ?? 0;
  const currentComments = storePost?.commentsCount ?? comments ?? 0;
  const currentReposts = storePost?.reposts?.length ?? reposts ?? 0;

  const containerClasses =
    orientation === "vertical"
      ? "flex flex-col items-center gap-y-6"
      : "flex flex-row items-center justify-between w-full px-4";

  return (
    <div className={clsx(className)}>
      <div className={containerClasses}>
        <Metric
          icon={
            <Heart 
              className={clsx(
                "w-7 h-7 transition-colors",
                isLiked 
                  ? "fill-[var(--color-green-cyan-darker)] text-[var(--color-green-cyan-darker)]" 
                  : "text-[var(--color-green-cyan-normal)]"
              )} 
            />
          }
          value={formatCount(currentLikes)}
          onClick={(e) => {
            e.stopPropagation();
            if (userId) {
              toggleLike(postId!, userId);
            }
          }}
          className="cursor-pointer hover:scale-110 transition-transform"
        />
        
        <Metric
          icon={<MessageCircle className="w-7 h-7 text-[var(--color-green-cyan-normal)]" />}
          value={formatCount(currentComments)}
          onClick={(e) => {
            e.stopPropagation();
            openCommentsPanel(postId!);
          }}
          className="cursor-pointer hover:scale-110 transition-transform"
        />

        <Metric
          icon={
            <Bookmark
              className={clsx(
                "w-7 h-7 transition-colors",
                isBookmarked 
                  ? "fill-[var(--color-green-cyan-darker)] text-[var(--color-green-cyan-darker)]" 
                  : "text-[var(--color-green-cyan-normal)]"
              )}
            />
          }
          value={formatCount(currentBookmarks)}
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark && toggleBookmark(postId!);
          }}
          className="cursor-pointer hover:scale-110 transition-transform"
        />

        <Metric
          icon={<Share2 className="w-7 h-7 text-[var(--color-green-cyan-normal)]" />}
          value={formatCount(currentShares)}
          onClick={(e) => {
            e.stopPropagation();
            setIsShareModalOpen(true);
          }}
          className="cursor-pointer hover:scale-110 transition-transform"
        />
        
        <Metric
          icon={<ReAeko strokeWidth={4} className="w-7 h-7 text-[var(--color-green-cyan-normal)]" />}
          value={formatCount(currentReposts)}
          onClick={(e) => {
            e.stopPropagation();
            repost && repost(postId!);
          }}
          className="cursor-pointer hover:scale-110 transition-transform"
        />
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
};

export { PostActions };
