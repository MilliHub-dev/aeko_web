"use client";

import { useOverlayActions } from "@/hooks/use-overlay-actions";
import { useVideoControls } from "@/hooks/use-video-controls";
import { PostMedia } from "./post-content";
import { PostFooter } from "./post-footer";
import { PostHeader } from "./post-header";
import { PostOverlay } from "./post-overlay";
import { PostWrapper } from "./post-wrapper";
import { PostPlayControl } from "./post-play-controls";
import { FeedPost } from "@/types/post";
import { usePostsStore } from "@/features/posts/stores";
import { useEffect, useCallback } from "react";
import { PostActions } from "./post-actions";
import { useUser } from "@/components/shared/user-context";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const PostCard = ({ isActive, ...post }: FeedPost & { isActive?: boolean }) => {
  // Sync post data with store
  const syncPost = usePostsStore((state) => state.syncPost);
  const toggleLike = usePostsStore((state) => state.toggleLike);
  const recordView = usePostsStore((state) => state.recordView);
  const { user } = useUser();
  const [showHeart, setShowHeart] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);
  const storePost = usePostsStore(
    (state) => state.posts.find((p) => p._id === post._id) || post
  );

  // Use store post if available, otherwise use prop
  const currentPost = storePost._id === post._id ? storePost : post;

  // Update store when post prop changes
  useEffect(() => {
    // Always sync the post to ensure it's in the store for actions like like/bookmark
    syncPost(post);
  }, [post._id, syncPost]);

  // Record view when post is active
  useEffect(() => {
    if (isActive && !hasViewed) {
      recordView(post._id);
      setHasViewed(true);
    }
  }, [isActive, hasViewed, post._id, recordView]);
  const {
    containerRef,
    showOverlay,
    handleMouseMove,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
    handleTouchCancel,
  } = useOverlayActions();

  const { videoRef, progress, isPlaying, isMuted, toggleMute, togglePlaying } =
    useVideoControls();

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (user) {
      const userId = user._id || user.id;
      const isLiked = currentPost.likes?.includes(userId);
      
      // Only toggle if NOT liked yet (Standard behavior: double click = like)
      if (!isLiked) {
        toggleLike(currentPost._id, userId);
      }
      
      // Trigger animation
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1000);
    }
  }, [user, currentPost, toggleLike]);

  const footerProps = {
    postId: currentPost._id,
    type: currentPost.type,
    text: currentPost.text,
    hashtags: [], // Assuming these might be added later to FeedPost or derived from text
    taggedUsers: [], // Same here
    // hashtags: currentPost.hashtags,
    // taggedUsers: currentPost.taggedUsers,
  };

  const postWrapperProps = {
    id: currentPost._id,
    handle: currentPost.user?.username,
    isMedia: currentPost.type === "image" || currentPost.type === "video",
    ref: containerRef,
    likes: currentPost.likesCount,
    shares: currentPost.engagement?.totalShares || 0,
    // bookmarks: currentPost.bookmarks,
    comments: currentPost.commentsCount,
    reposts: currentPost.reposts?.length || 0,
    isActive,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onDoubleClick: handleDoubleClick,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
  };

  const isMedia = currentPost.type === "image" || currentPost.type === "video";

  return (
    <PostWrapper {...postWrapperProps}>
      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <Heart className="w-24 h-24 text-white fill-white drop-shadow-lg" />
          </motion.div>
        )}
      </AnimatePresence>
      {isMedia && <PostOverlay show={showOverlay} />}
      <PostHeader
        {...currentPost}
        postId={currentPost._id}
        isHovered={showOverlay}
        isMuted={isMuted}
        toggleMute={toggleMute}
        views={currentPost.views}
      />
      <PostMedia
        type={currentPost.type}
        media={currentPost.media}
        mediaUrl={currentPost.mediaUrl}
        mediaUrls={currentPost.mediaUrls}
        text={currentPost.text}
        videoRef={videoRef}
        progress={progress}
      />
      
      {/* Post Actions Integration */}
      <PostActions
        postId={currentPost._id}
        post={currentPost}
        likes={currentPost.likesCount}
        shares={currentPost.engagement?.totalShares || 0}
        bookmarks={currentPost.bookmarksCount}
        comments={currentPost.commentsCount}
        reposts={currentPost.reposts?.length || 0}
        orientation={isMedia ? "vertical" : "horizontal"}
        className={
          isMedia
            ? "absolute right-2 bottom-28 z-30"
            : "w-full px-4 py-2 mt-2"
        }
      />

      <PostFooter {...footerProps} isHovered={showOverlay} />
      {currentPost.type === "video" && (
        <PostPlayControl togglePlaying={togglePlaying} isPlaying={isPlaying} />
      )}
    </PostWrapper>
  );
};

export { PostCard };
