"use client";

import React from "react";
import Image from "next/image";
import clsx from "clsx";
import { motion } from "motion/react";
import { FeedPost } from "@/types/post";

// ---------------------------------------------------------
// Main Wrapper
// ---------------------------------------------------------
interface PostMediaProps extends Partial<FeedPost> {
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  progress?: number;
  muted?: boolean;
}

const PostMedia = ({
  type,
  videoRef,
  progress,
  muted,
  media,
  text,
}: Partial<PostMediaProps>) => {
  switch (type) {
    case "image":
      return <PostImage backgroundImage={media!} />;
    case "video":
      return (
        <PostVideo
          videoSrc={media!}
          poster={media}
          muted={muted}
          videoRef={videoRef}
          progress={progress}
        />
      );
    case "text":
      return <PostText content={text!} hashtags={[]} taggedUsers={[]} />;
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
  className,
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
            duration: 0.1,
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

const PostImage = ({ backgroundImage, className }: PostImageProps) => {
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
  hashtags: string[];
  taggedUsers: string[];
  className: string;
}

const PostText = ({
  content,
  hashtags,
  taggedUsers,
  className,
}: Partial<PostTextProps>) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const MAX_LENGTH = 300; // Character limit before truncation

  if (!content) return null;

  const shouldTruncate = content.length > MAX_LENGTH;
  const displayContent =
    shouldTruncate && !isExpanded
      ? content.slice(0, MAX_LENGTH) + "..."
      : content;

  return (
    <div className={clsx("flex flex-col gap-4 py-6", className)}>
      <div className="relative">
        <p className="text-xl md:text-3xl leading-relaxed whitespace-pre-wrap">
          {displayContent}
        </p>

        {shouldTruncate && (
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary hover:text-primary/80 font-medium mt-2 text-lg transition-colors"
            whileTap={{ scale: 0.95 }}>
            {isExpanded ? "Show less" : "Read more"}
          </motion.button>
        )}
      </div>

      {hashtags && hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag, i) => (
            <span
              key={i}
              className="text-primary hover:underline cursor-pointer text-lg">
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
              className="text-primary hover:underline cursor-pointer text-lg">
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
