"use client";

import clsx from "clsx";
import { motion } from "motion/react";
import {
	Bookmark,
	Heart,
	MessageCircle,
	Share2
} from "lucide-react";

import { useCommentsPanel } from "./comments-panel-context";
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
	const { open } = useCommentsPanel();
	const isText = type === "text";

	const detailPanel = clsx(
		"rounded-3xl px-6 py-6 shadow-[0_28px_85px_-48px_rgba(15,23,42,0.85)] transition-colors duration-300",
		isText
			? "bg-white/95 border border-slate-200/70"
			: "bg-white/12 border border-white/20 backdrop-blur-xl",
		isText ? "text-slate-900" : "text-white/90"
	);

	const metricsRow = clsx(
		"flex w-full items-center justify-between gap-x-4 rounded-full px-5 py-3 shadow-[0_22px_50px_-30px_rgba(15,23,42,0.65)] transition-all duration-300",
		isText
			? "bg-slate-900/5 border border-slate-200/70 text-slate-900"
			: "bg-white/12 border border-white/20 backdrop-blur-xl text-white/90"
	);

	return (
		<>
			<motion.div
				className={clsx(
					className,
					"relative z-20 flex flex-col justify-end",
					isText
						? "px-0 pt-8"
						: "px-4 pb-10 pt-24 bg-gradient-to-t from-slate-950/92 via-slate-950/28 to-transparent md:-mx-8 md:-mb-8 md:px-8 md:pb-10 md:pt-32"
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
						<div className="absolute inset-x-4 bottom-10 md:inset-x-8">
							<div className={detailPanel}>
								{content && (
									<p className="text-base font-medium leading-relaxed md:text-lg">
										{content}
									</p>
								)}

								{hashtags.length > 0 && (
									<div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold text-primary/90 md:text-base">
										{hashtags.map((tag) => (
											<span key={tag}>#{tag}</span>
										))}
									</div>
								)}

								{taggedUsers.length > 0 && (
									<div className="mt-2 flex flex-wrap gap-2 text-sm text-white/70">
										{taggedUsers.map((user) => (
											<span key={user}>@{user}</span>
										))}
									</div>
								)}
							</div>
						</div>
					)}
			</motion.div>

			<div className="lg:hidden mt-4 w-full">
				<div className={metricsRow}>
					<Metric
						icon={
							<Heart className="h-6 w-6 text-rose-400 fill-rose-500/80" />
						}
						value={likes}
					/>
					<Metric icon={<Share2 className="h-6 w-6" />} value={shares} />
					<Metric icon={<Bookmark className="h-6 w-6" />} value={bookmarks} />
					<Metric
						icon={<MessageCircle className="h-6 w-6" />}
						value={comments}
						className="hover:scale-[1.05]"
						onClick={() => open(postId)}
					/>
					<Metric icon={<ReAeko strokeWidth={4} />} value={120} className="hover:scale-[1.05]" />
				</div>
			</div>
		</>
	);
};

export { PostFooter };
