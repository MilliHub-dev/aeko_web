"use client";

import React from "react";
import Image from "next/image";
import clsx from "clsx";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import { FeedPost } from "@/types/post";
import { API_BASE_URL } from "@/lib/config";

// Helper to resolve media URLs
const getMediaUrl = (url?: string) => {
  if (!url) return "";

  // Handle dummy/example URLs from backend
  if (url.includes("example.com") || url.includes("arrObj")) {
    return "/placeholder.svg";
  }

  if (url.startsWith("http") || url.startsWith("data:")) return url;
  
  // List of known local folders in public/
  const localPrefixes = ["/avatars", "/posts", "/stories", "/users", "/fonts", "/icons", "/profile", "/placeholder", "/aeko", "/blue_tick", "/gold_tick", "/cover", "/demo"];
  if (localPrefixes.some(prefix => url.startsWith(prefix))) {
    return url;
  }
  
  // Otherwise assume backend
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

import { PostMediaCarousel } from "./post-media-carousel";

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
  mediaUrl,
  mediaUrls,
  text,
}: Partial<PostMediaProps>) => {
  // Check for multiple files
  const hasMultiple = (mediaUrls && mediaUrls.length > 1) || (Array.isArray(media) && media.length > 1);
  
  if (hasMultiple) {
    const items = mediaUrls && mediaUrls.length > 0 ? mediaUrls : (media as string[]);
    return <PostMediaCarousel items={items} />;
  }

  // Fallback to single view
  const targetMedia = mediaUrl || (mediaUrls && mediaUrls.length > 0 ? mediaUrls[0] : (Array.isArray(media) ? media[0] : media));
  const resolvedMedia = getMediaUrl(targetMedia);

  switch (type) {
    case "image":
      if (!targetMedia) return null;
      return <PostImage backgroundImage={resolvedMedia} />;
    case "video":
      if (!targetMedia) return null;
      return (
        <PostVideo
          videoSrc={resolvedMedia}
          poster={resolvedMedia}
          muted={muted}
          videoRef={videoRef}
          progress={progress}
        />
      );
    case "text":
      return <PostText content={text!} hashtags={[]} taggedUsers={[]} />;
    default:
      // Fallback for when type is unknown but we have media (e.g. from array logic fallback)
      if (targetMedia) {
        if (targetMedia.endsWith('.mp4') || targetMedia.endsWith('.webm')) {
           return (
            <PostVideo
              videoSrc={resolvedMedia}
              poster={resolvedMedia}
              muted={muted}
              videoRef={videoRef}
              progress={progress}
            />
          );
        }
        return <PostImage backgroundImage={resolvedMedia} />;
      }
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
    <div className="flex flex-col justify-between bg-white w-full h-full relative">
      <video
        ref={videoRef}
        src={videoSrc}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        className={clsx(
        "absolute inset-0 w-full h-full object-contain object-center",
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
  const [error, setError] = React.useState(false);

  if (!backgroundImage || error) {
    return (
      <div className={clsx("w-full h-full bg-neutral-900 flex items-center justify-center", className)}>
         <span className="text-neutral-700 text-sm">Media unavailable</span>
      </div>
    );
  }
  
  return (
    <div className={clsx("relative w-full h-full bg-white", className)}>
      <Image
        src={backgroundImage}
        alt="Post media"
        fill
        priority
        style={{ objectFit: 'contain' }}
        className="object-contain object-center"
        onError={() => setError(true)}
      />
    </div>
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

  const renderFormattedText = (text: string) => {
    // Split by bold (**...**)
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      // Split by italic (*...*)
      const subParts = part.split(/(\*.*?\*)/g);
      return subParts.map((subPart, j) => {
        if (subPart.startsWith('*') && subPart.endsWith('*') && subPart.length >= 2) {
          return <em key={`${i}-${j}`}>{subPart.slice(1, -1)}</em>;
        }
        return subPart;
      });
    });
  };

  return (
    <div className={clsx("flex flex-col gap-4 py-6", className)}>
      <div className="relative">
        <p className="text-xl md:text-3xl leading-relaxed whitespace-pre-wrap">
          {renderFormattedText(displayContent)}
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
