"use client";

import clsx from "clsx";
import { motion } from "motion/react";
import {
	Bookmark,
	Heart,
	MessageCircle,
	Share2
} from "lucide-react";

import { usePostUIStore, usePostsStore } from "@/features/posts/stores";
import { Metric } from "./post-metric";
import { ReAeko } from "@/lib/icons";

interface PostFooterProps {
	type?: "image" | "video" | "text";
	content?: string;
	hashtags?: string[];
	taggedUsers?: string[];
	likes: string;
	shares: string;
	bookmarks: string;
	comments: string;
	className?: string;
	isHovered?: boolean;
	postId: string;
}

const PostFooter = ({
	type,
	content,
	hashtags = [],
	taggedUsers = [],
	likes,
	shares,
	bookmarks,
	comments,
	className,
	isHovered = false,
	postId
}: PostFooterProps) => {
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
	
	const isText = type === "text";

	const detailPanel = clsx(
		"rounded-3xl px-6 py-6 shadow-[0_28px_85px_-48px_rgba(15,23,42,0.85)] transition-colors duration-300",
		isText
			? ""
			: "bg-white/12 border border-white/20 backdrop-blur-xl",
		isText ? "text-slate-900" : "text-white/90"
	);

	const metricsRow = clsx(
		"lg:hidden flex items-center justify-around gap-x-4 rounded-full px-5 py-2 transition-all duration-300",
		isText
			? "text-slate-900"
			: "bg-white/12 border border-white/20 backdrop-blur-xl text-white/90"
	);

	return (
		<motion.div
			className={clsx(
				className,
				"relative z-20 flex flex-col justify-end",
				isText
					? "px-0"
					: "-mx-8 -mb-8 px-8 pb-10 pt-32 bg-gradient-to-t from-slate-950/92 via-slate-950/28 to-transparent"
			)}
			animate={{
				opacity: isHovered ? 1 : 0,
				y: isHovered ? 0 : 24
			}}
			transition={{ duration: 0.35, ease: "easeOut" }}
		>
			{!isText &&
				(content ||
					hashtags.length > 0 ||
					taggedUsers.length > 0) && (
					<div className="absolute inset-x-8 bottom-30 lg:bottom-10">
						<div className={detailPanel}>
							{content && (
								<p className="text-base font-medium leading-relaxed md:text-lg">
									{content}
								</p>
							)}

							{hashtags.length > 0 && (
								<div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold text-primary/90 md:text-base">
									{hashtags.map((tag) => (
										<span key={tag}>
											#{tag}
										</span>
									))}
								</div>
							)}

							{taggedUsers.length > 0 && (
								<div className="mt-2 flex flex-wrap gap-2 text-sm text-white/70">
									{taggedUsers.map(
										(user) => (
											<span
												key={user}
											>
												@{user}
											</span>
										)
									)}
								</div>
							)}
						</div>
					</div>
				)}

			<div className={metricsRow}>
				<Metric
					icon={
						<Heart className={`h-6 w-6 ${isLiked ? "text-rose-400 fill-rose-500/80" : ""}`} />
					}
					value={currentLikes}
					className="hover:scale-[1.05] cursor-pointer"
					onClick={() => toggleLike(postId)}
				/>
				<Metric
					icon={<Share2 className="h-6 w-6" />}
					value={currentShares}
					className="hover:scale-[1.05] cursor-pointer"
					onClick={() => incrementShare(postId)}
				/>
				<Metric
					icon={<Bookmark className={`h-6 w-6 ${isBookmarked ? "fill-current" : ""}`} />}
					value={currentBookmarks}
					className="hover:scale-[1.05] cursor-pointer"
					onClick={() => toggleBookmark(postId)}
				/>
				<Metric
					icon={
						<MessageCircle className="h-6 w-6" />
					}
					value={currentComments}
					className="hover:scale-[1.05] cursor-pointer"
					onClick={() => openCommentsPanel(postId)}
				/>
				<Metric
					icon={<ReAeko strokeWidth={4} />}
					value={120}
					className="hover:scale-[1.05]"
				/>
			</div>
		</motion.div>
	);
};

export { PostFooter };
