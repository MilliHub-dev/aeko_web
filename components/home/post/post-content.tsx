"use client";

import Image from "next/image";
import clsx from "clsx";
import { motion } from "motion/react";
import { PostProps } from "@/types/post";

// ---------------------------------------------------------
// Main Wrapper
// ---------------------------------------------------------
interface PostMediaProps extends PostProps {
	videoRef?: React.RefObject<HTMLVideoElement | null>;
	progress?: number;
	muted?: boolean;
}

const PostMedia = ({
	backgroundImage,
	videoSrc,
	content,
	hashtags,
	taggedUsers,
	type,
	videoRef,
	progress,
	muted
}: PostMediaProps) => {
	switch (type) {
		case "image":
			return (
				<PostImage
					backgroundImage={backgroundImage!}
				/>
			);
		case "video":
			return (
				<PostVideo
					videoSrc={videoSrc!}
					poster={backgroundImage}
					muted={muted}
					videoRef={videoRef}
					progress={progress}
				/>
			);
		case "text":
			return (
				<PostText
					content={content}
					hashtags={hashtags}
					taggedUsers={taggedUsers}
				/>
			);
		default:
			return null;
	}
};

// ---------------------------------------------------------
// Video Component
// ---------------------------------------------------------
interface PostVideoProps {
	videoSrc: string;
	videoRef?: React.RefObject<HTMLVideoElement | null>;
	poster?: string;
	autoPlay?: boolean;
	loop?: boolean;
	muted?: boolean;
	className?: string;
	progress?: number;
}

const PostVideo = ({
	videoSrc,
	videoRef,
	poster,
	autoPlay = true,
	loop = true,
	muted = true,
	progress,
	className
}: PostVideoProps) => {
	return (
		<div className="flex flex-col justify-between">
			<video
				ref={videoRef}
				src={videoSrc}
				poster={poster}
				autoPlay={autoPlay}
				loop={loop}
				muted={muted}
				playsInline
				className={clsx(
					"absolute inset-0 w-full h-full object-cover",
					className
				)}
			/>
			{/* Progress Bar */}
			<div className="absolute top-0 left-0 right-0 h-2 bg-black/30 z-10">
				<motion.div
					className="h-full bg-white rounded-2xl"
					initial={{ width: 0 }}
					animate={{ width: `${progress}%` }}
					transition={{
						ease: "linear",
						duration: 0.1
					}}
				/>
			</div>
		</div>
	);
};

// ---------------------------------------------------------
// Image Component
// ---------------------------------------------------------
interface PostImageProps {
	backgroundImage: string;
	className?: string;
}

const PostImage = ({
	backgroundImage,
	className
}: PostImageProps) => {
	return (
		<Image
			src={backgroundImage}
			alt="Post media"
			fill
			priority
			className={clsx("object-cover", className)}
		/>
	);
};

// ---------------------------------------------------------
// Text Component
// ---------------------------------------------------------

interface PostTextProps {
	content: string;
	hashtags?: string[];
	taggedUsers?: string[];
	className?: string;
}

const PostText = ({
	content,
	hashtags,
	taggedUsers,
	className
}: PostTextProps) => {
	return (
		<div
			className={clsx(
				"flex flex-col gap-4 py-6",
				className
			)}
		>
			<p className="text-xl md:text-3xl leading-relaxed">
				{content}
			</p>

			{hashtags && hashtags.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{hashtags.map((tag, i) => (
						<span
							key={i}
							className="text-primary hover:underline cursor-pointer text-lg"
						>
							#{tag}
						</span>
					))}
				</div>
			)}

			{taggedUsers && taggedUsers.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{taggedUsers.map((tagUser, i) => (
						<span
							key={i}
							className="text-primary hover:underline cursor-pointer text-lg"
						>
							@{tagUser}
						</span>
					))}
				</div>
			)}
		</div>
	);
};

// ---------------------------------------------------------
export { PostMedia, PostImage, PostVideo, PostText };
