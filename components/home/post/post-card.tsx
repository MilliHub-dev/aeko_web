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
import { useEffect } from "react";

const PostCard = ({ isActive, ...post }: FeedPost & { isActive?: boolean }) => {
  // Sync post data with store
  const updatePost = usePostsStore((state) => state.updatePost);
  const storePost = usePostsStore(
    (state) => state.posts.find((p) => p._id === post._id) || post
  );

  // Use store post if available, otherwise use prop
  const currentPost = storePost._id === post._id ? storePost : post;

  // Update store when post prop changes
  useEffect(() => {
    if (storePost._id !== post._id) {
      // Post not in store yet, will be added by PostsInitializer
      return;
    }
    // Sync any prop changes to store
    updatePost(post._id, post);
  }, [post._id, updatePost, storePost._id]);
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

  const footerProps = {
    postId: currentPost._id,
    type: currentPost.type,
    text: currentPost.text,
    // hashtags: currentPost.hashtags,
    // taggedUsers: currentPost.taggedUsers,
    likes: currentPost.likesCount,
    // shares: currentPost.shares,
    // bookmarks: currentPost.bookmarks,
    // comments: currentPost.commentsCount
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
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
  };

  const isMedia = currentPost.type === "image" || currentPost.type === "video";

  return (
    <PostWrapper {...postWrapperProps}>
      {isMedia && <PostOverlay show={showOverlay} />}
      <PostHeader
        {...currentPost}
        isHovered={showOverlay}
        isMuted={isMuted}
        toggleMute={toggleMute}
      />
      <PostMedia
        type={currentPost.type}
        media={currentPost.media}
        text={currentPost.text}
        videoRef={videoRef}
        progress={progress}
      />
      <PostFooter {...footerProps} isHovered={showOverlay} />
      {currentPost.type === "video" && (
        <PostPlayControl togglePlaying={togglePlaying} isPlaying={isPlaying} />
      )}
    </PostWrapper>
  );
};

export { PostCard };
