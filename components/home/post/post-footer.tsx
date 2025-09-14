"use client";

import { motion } from "motion/react";
import clsx from "clsx";
import {
	Heart,
	Share2,
	Bookmark,
	MessageCircle
} from "lucide-react";
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
}

const PostFooter = ({
	type,
	content,
	hashtags,
	taggedUsers,
	likes,
	shares,
	bookmarks,
	comments,
	className,
	isHovered = false
}: PostFooterProps) => {
	const isText = type === "text";
	const textColor = isText ? "text-black" : "text-white";

	const maskStyles = !isText
		? "relative mask-t-from-80% mask-radial-[70%_100%] mask-radial-from-60% backdrop-blur-sm -mx-8 -mb-8"
		: "";

	const contentWrapper = !isText
		? "absolute bottom-10 left-10 right-10 "
		: "";

	return (
		<motion.div
			className={clsx(
				className,
				maskStyles,
				"z-10 isolate h-[40%] md:h-[25%]"
			)}
			animate={{
				opacity: isHovered ? 1 : 0,
				y: isHovered ? 0 : 20
			}}
			transition={{ duration: 0.3 }}
		>
			<div className={contentWrapper}>
				{/* Post text, hashtags, and tagged users */}
				{!isText && (
					<div
						className={clsx(
							textColor,
							"flex flex-col gap-3 mb-4"
						)}
					>
						{content && (
							<p className="text-lg font-medium leading-relaxed text-ellipsis overflow-hidden">
								{content}
							</p>
						)}

						{hashtags?.length! > 0 && (
							<div className="flex flex-wrap gap-1">
								{hashtags?.map((tag, i) => (
									<span
										key={i}
										className="text-base font-semibold"
									>
										#{tag}
									</span>
								))}
							</div>
						)}

						{taggedUsers?.length! > 0 && (
							<div className="flex flex-wrap gap-1">
								{taggedUsers?.map(
									(user, i) => (
										<span
											key={i}
											className="text-base"
										>
											@{user}
										</span>
									)
								)}
							</div>
						)}
					</div>
				)}
				<div
					className={clsx(
						"flex lg:hidden items-center justify-between gap-x-3",
						textColor
					)}
				>
					<Metric
						icon={
							<Heart className="w-6 h-6 fill-red-500" />
						}
						value={likes}
					/>
					<Metric
						icon={
							<Share2 className="w-6 h-6" />
						}
						value={shares}
					/>
					<Metric
						icon={
							<Bookmark className="w-6 h-6" />
						}
						value={bookmarks}
					/>
					<Metric
						icon={
							<MessageCircle className="w-6 h-6" />
						}
						value={comments}
						className="cursor-pointer hover:opacity-80 transition-opacity"
					/>
					<Metric
						icon={<ReAeko strokeWidth={4} />}
						value={120}
						className="cursor-pointer hover:opacity-80 transition-opacity"
					/>
				</div>
			</div>
		</motion.div>
	);
};

export { PostFooter };
