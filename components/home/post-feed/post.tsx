// components/Post/Post.tsx
"use client";

import { useRef, useState } from "react";
import { TextPost } from "./text-post";
import { PostHeader } from "./post-header";
import { PostFooter } from "./post-footer";
import { PostModal } from "./post-modal";
import { PostVideoPlayer } from "./post-video-player";
import { PostImageViewer } from "./post-image-viewer";

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
  hashtags = [],
}: PostProps) => {
  const [showOverlay, setShowOverlay] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(
    null
  ) as React.RefObject<HTMLVideoElement>;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseY = event.clientY - rect.top;
    const height = rect.height;

    const isInHeaderArea = mouseY < height * 0.2;
    const isInFooterArea = mouseY > height * 0.7;

    setShowOverlay(isInHeaderArea || isInFooterArea);
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
          comments,
        }}
      />
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className="relative flex-1 w-full max-w-md md:max-w-lg lg:max-w-2xl mx-auto aspect-[4/4] md:aspect-[4/5] rounded-4xl overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => !isPlaying && setShowOverlay(true)}
      >
        {/* <Link href={`/${username}`}> */}
        {type === "image" ? (
          <PostImageViewer
            backgroundImage={backgroundImage}
            profileImage={profileImage}
            onOpenModal={() => setIsModalOpen(true)}
            showOverlay={showOverlay}
            header={
              <PostHeader
                username={username}
                handle={handle}
                profileImage={profileImage}
              />
            }
            footer={
              <PostFooter
                content={content}
                hashtags={hashtags}
                likes={likes}
                shares={shares}
                bookmarks={bookmarks}
                comments={comments}
                onCommentClick={() => setIsModalOpen(true)}
              />
            }
          />
        ) : (
          <PostVideoPlayer
            videoSrc={videoSrc}
            poster={backgroundImage}
            header={
              <PostHeader
                username={username}
                handle={handle}
                profileImage={profileImage}
              />
            }
            footer={
              <PostFooter
                content={content}
                hashtags={hashtags}
                likes={likes}
                shares={shares}
                bookmarks={bookmarks}
                comments={comments}
                onCommentClick={() => setIsModalOpen(true)}
              />
            }
          />
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
