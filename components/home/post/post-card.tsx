"use client";

import { useOverlayActions } from "@/hooks/use-overlay-actions";
import { useVideoControls } from "@/hooks/use-video-controls";
import { PostMedia } from "./post-content";
import { PostFooter } from "./post-footer";
import { PostHeader } from "./post-header";
import { PostOverlay } from "./post-overlay";
import { PostWrapper } from "./post-wrapper";
import { PostPlayControl } from "./post-play-controls";
import React from "react";
import { PostProps } from "@/types/post";

const PostCard = (post: PostProps) => {
	const {
		containerRef,
		showOverlay,
		handleMouseMove,
		handleMouseLeave,
		handleTouchStart,
		handleTouchEnd
	} = useOverlayActions();

	const {
		videoRef,
		progress,
		isPlaying,
		isMuted,
		toggleMute,
		togglePlaying
	} = useVideoControls();

	const footerProps = {
		postId: post.id,
		type: post.type,
		content: post.content,
		hashtags: post.hashtags,
		taggedUsers: post.taggedUsers,
		likes: post.likes,
		shares: post.shares,
		bookmarks: post.bookmarks,
		comments: post.commentMetric
	};

	const postWrapperProps = {
		id: post.id,
		handle: post.handle,
		isMedia:
			post.type === "image" || post.type === "video",
		ref: containerRef,
		likes: post.likes,
		shares: post.shares,
		bookmarks: post.bookmarks,
		comments: post.commentMetric,
		onMouseMove: handleMouseMove,
		onMouseLeave: handleMouseLeave,
		onTouchStart: handleTouchStart,
		onTouchEnd: handleTouchEnd
	};

	const isMedia =
		post.type === "image" || post.type === "video";

	return (
		<PostWrapper {...postWrapperProps}>
			{isMedia && <PostOverlay show={showOverlay} />}
			<PostHeader
				{...post}
				isHovered={showOverlay}
				isMuted={isMuted}
				toggleMute={toggleMute}
			/>
			<PostMedia
				{...post}
				videoRef={videoRef}
				progress={progress}
			/>
			<PostFooter
				{...footerProps}
				isHovered={showOverlay}
			/>
			{post.type === "video" && (
				<PostPlayControl
					togglePlaying={togglePlaying}
					isPlaying={isPlaying}
				/>
			)}
		</PostWrapper>
	);
};

export { PostCard };
