// components/Post/Post.tsx
"use client";

import { useRef, useState } from "react";
import { motion, useAnimation } from "motion/react";
import Image from "next/image";
import { TextPost } from "./text-post";
import { PostHeader } from "./post-header";
import { PostFooter } from "./post-footer";
import { VideoControls } from "./post-video-controls";
import { PostModal } from "./post-modal";

export type PostType = "text" | "image" | "video";

export interface PostProps {
	type?: PostType;
	username?: string;
	handle?: string;
	profileImage?: string;
	backgroundImage?: string;
	videoSrc?: string;
	content?: string;
	likes?: string;
	shares?: string;
	bookmarks?: string;
	comments?: string;
	hashtags?: string[];
	timePosted?: string;
}

const Post = ({
	type,
	username = "Joshua Martins",
	handle = "@dJoshmart",
	profileImage = "/profile.jpeg",
	backgroundImage = "/profile.jpeg",
	videoSrc = "/video.mp4",
	content = "Just had an amazing breakthrough in my latest project!",
	likes = "120K",
	shares = "200",
	bookmarks = "15",
	comments = "25",
	hashtags = []
}: PostProps) => {
	const isMedia = type === "image" || type === "video";
	const controls = useAnimation();
	const [showOverlay, setShowOverlay] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null) as React.RefObject<HTMLVideoElement>;

	const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		if (!containerRef.current) return;

		const rect = containerRef.current.getBoundingClientRect();
		const mouseY = event.clientY - rect.top;
		const height = rect.height;

		const isInHeaderArea = mouseY < height * 0.2;
		const isInFooterArea = mouseY > height * 0.7;

		setShowOverlay(isInHeaderArea || isInFooterArea);
	};

	const handleVideoPlayPause = () => {
		if (!videoRef.current) return;

		if (videoRef.current.paused) {
			videoRef.current.play();
			setIsPlaying(true);
			setShowOverlay(false);
		} else {
			videoRef.current.pause();
			setIsPlaying(false);
			setShowOverlay(true);
		}
	};

	if (type === "text") {
		return (
			<TextPost
				{...{
					username,
					handle,
					profileImage,
					content,
					hashtags,
					likes,
					shares,
					bookmarks,
					comments
				}}
			/>
		);
	}

	return (
		<>
			<div
				ref={containerRef}
				className="relative flex-1 w-full max-w-sm md:max-w-xl mx-auto aspect-[4/4] rounded-2xl overflow-hidden"
				onMouseMove={handleMouseMove}
				onMouseLeave={() => !isPlaying && setShowOverlay(true)}
			>
				{type === "image" ? (
					<>
						<Image
							src={backgroundImage}
							alt="Post media"
							fill
							className="object-cover"
							priority
						/>
						<motion.div
							className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"
							animate={{ opacity: showOverlay ? 1 : 0 }}
							transition={{ duration: 0.3 }}
							onClick={() => setIsModalOpen(true)}
						/>
						<motion.div
							className="absolute top-4 left-4 right-4"
							animate={{ opacity: showOverlay ? 1 : 0 }}
							transition={{ duration: 0.3 }}
						>
							<PostHeader
								username={username}
								handle={handle}
								profileImage={profileImage}
							/>
						</motion.div>
						<motion.div
							className="absolute bottom-0 left-0 right-0 p-4"
							animate={{ opacity: showOverlay ? 1 : 0 }}
							transition={{ duration: 0.3 }}
						>
							<PostFooter
								content={content}
								hashtags={hashtags}
								likes={likes}
								shares={shares}
								bookmarks={bookmarks}
								comments={comments}
							/>
						</motion.div>
					</>
				) : (
					<>
						<video
							ref={videoRef}
							src={videoSrc}
							className="w-full h-full object-cover absolute inset-0"
							onClick={handleVideoPlayPause}
							poster={backgroundImage}
							autoPlay
							loop
						/>
						<motion.div
							className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"
							animate={{ opacity: showOverlay && !isPlaying ? 1 : 0 }}
							transition={{ duration: 0.3 }}
						/>
						<motion.div
							className="absolute top-4 left-4 right-4"
							animate={{
								opacity: showOverlay && !isPlaying ? 1 : 0,
								y: showOverlay && !isPlaying ? 0 : -20
							}}
							transition={{ duration: 0.3 }}
						>
							<PostHeader
								username={username}
								handle={handle}
								profileImage={profileImage}
							/>
						</motion.div>
						<VideoControls
							isPlaying={isPlaying}
							onPlayPause={handleVideoPlayPause}
							videoRef={videoRef}
							showOverlay={showOverlay}
						/>
						<motion.div
							className="absolute bottom-0 left-0 right-0 p-4"
							animate={{
								opacity: showOverlay && !isPlaying ? 1 : 0,
								y: showOverlay && !isPlaying ? 0 : 20
							}}
							transition={{ duration: 0.3 }}
						>
							<PostFooter
								content={content}
								hashtags={hashtags}
								likes={likes}
								shares={shares}
								bookmarks={bookmarks}
								comments={comments}
							/>
						</motion.div>
					</>
				)}
			</div>
			<PostModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				type={type}
				username={username}
				handle={handle}
				profileImage={profileImage}
				backgroundImage={backgroundImage}
				videoSrc={videoSrc}
				content={content}
				likes={likes}
				shares={shares}
				bookmarks={bookmarks}
				comments={comments}
				hashtags={hashtags}
				// timePosted={timePosted}
			/>
		</>
	);
};

export { Post };
