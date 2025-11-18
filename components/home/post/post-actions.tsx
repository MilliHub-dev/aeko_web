import {
	Heart,
	Share2,
	Bookmark,
	MessageCircle
} from "lucide-react";
import { Metric } from "./post-metric";
import { ReAeko } from "@/lib/icons";
import { usePostUIStore, usePostsStore } from "@/features/posts/stores";

interface PostActionsProps {
	likes: string;
	shares: string;
	bookmarks: string;
	comments: string;
	postId: string;
}

const PostActions = ({
	likes,
	shares,
	bookmarks,
	comments,
	postId
}: PostActionsProps) => {
	const { openCommentsPanel } = usePostUIStore();
	const { toggleLike, toggleBookmark, incrementShare, likedPosts, bookmarkedPosts, posts } = usePostsStore();
	const isLiked = likedPosts.has(postId);
	const isBookmarked = bookmarkedPosts.has(postId);
	
	// Get current post from store if available, otherwise use props
	const storePost = posts.find((p) => p.id === postId);
	const currentLikes = storePost?.likes || likes;
	const currentShares = storePost?.shares || shares;
	const currentBookmarks = storePost?.bookmarks || bookmarks;
	const currentComments = storePost?.commentMetric || comments;

	return (
		<div className="hidden lg:flex lg:items-center lg:justify-between">
			<div className="flex flex-col items-center gap-y-8 px-2">
				<Metric
					icon={
						<Heart className={`w-8 h-8 ${isLiked ? "fill-red-500" : ""}`} />
					}
					value={currentLikes}
					onClick={() => toggleLike(postId)}
					className="cursor-pointer hover:opacity-80 transition-opacity"
				/>
				<Metric
					icon={<Share2 className="w-8 h-8" />}
					value={currentShares}
					onClick={() => incrementShare(postId)}
					className="cursor-pointer hover:opacity-80 transition-opacity"
				/>
				<Metric
					icon={<Bookmark className={`w-8 h-8 ${isBookmarked ? "fill-current" : ""}`} />}
					value={currentBookmarks}
					onClick={() => toggleBookmark(postId)}
					className="cursor-pointer hover:opacity-80 transition-opacity"
				/>
				<Metric
					icon={
						<MessageCircle className="w-8 h-8" />
					}
					value={currentComments}
					onClick={() => openCommentsPanel(postId)}
					className="cursor-pointer hover:opacity-80 transition-opacity"
				/>
				<Metric
					icon={<ReAeko strokeWidth={4} />}
					value={120}
					className="cursor-pointer hover:opacity-80 transition-opacity"
				/>
			</div>
		</div>
	);
};

export { PostActions };
