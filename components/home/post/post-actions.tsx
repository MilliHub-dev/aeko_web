import { Heart, Share2, Bookmark, MessageCircle } from "lucide-react";
import { Metric } from "./post-metric";
import { ReAeko } from "@/lib/icons";
import { usePostUIStore, usePostsStore } from "@/features/posts/stores";
import { Comment } from "@/types/comment";
import { useUser } from "@/components/shared/user-context";

interface PostActionsProps {
  likes: number;
  shares: number;
  bookmarks: number;
  comments: number;
  reposts: number;
  postId: string;
}

const PostActions = ({
  likes,
  shares,
  bookmarks,
  comments,
  reposts,
  postId,
}: Partial<PostActionsProps>) => {
  const { openCommentsPanel } = usePostUIStore();
  const { user } = useUser();
  const { toggleLike, toggleBookmark, incrementShare, bookmarkedPosts, posts } =
    usePostsStore();

  // Get current post from store if available, otherwise use props
  const storePost = posts.find((p) => p._id === postId);
  const isLiked = storePost?.likes?.includes(user?._id!) ?? false;
  const isBookmarked = bookmarkedPosts.has(postId!);

  const currentLikes = storePost?.likesCount ?? likes ?? 0;
  const currentShares = storePost?.engagement?.totalShares ?? shares ?? 0;
  const currentBookmarks = storePost?.bookmarksCount ?? bookmarks ?? 0;
  const currentComments = storePost?.commentsCount ?? comments ?? 0;
  const currentReposts = storePost?.reposts?.length ?? reposts ?? 0;

  return (
    <div className="hidden lg:flex lg:items-center lg:justify-between">
      <div className="flex flex-col items-center gap-y-8 px-2">
        <Metric
          icon={
            <Heart className={`w-8 h-8 ${isLiked ? "fill-red-500" : ""}`} />
          }
          value={currentLikes}
          onClick={() => {
            if (user?._id) {
              toggleLike(postId!, user._id);
            }
          }}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        />
        <Metric
          icon={<Share2 className="w-8 h-8" />}
          value={currentShares}
          onClick={() => incrementShare && incrementShare(postId!)}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        />
        <Metric
          icon={
            <Bookmark
              className={`w-8 h-8 ${isBookmarked ? "fill-current" : ""}`}
            />
          }
          value={currentBookmarks}
          onClick={() => toggleBookmark && toggleBookmark(postId!)}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        />
        <Metric
          icon={<MessageCircle className="w-8 h-8" />}
          value={currentComments}
          onClick={() => openCommentsPanel(postId!)}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        />
        <Metric
          icon={<ReAeko strokeWidth={4} />}
          value={currentReposts}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        />
      </div>
    </div>
  );
};

export { PostActions };
