"use client";

import clsx from "clsx";
import { motion } from "motion/react";

interface PostFooterProps {
  type: "image" | "video" | "text";
  text?: string;
  hashtags: string[];
  taggedUsers: string[];
  className: string;
  isHovered: boolean;
  postId: string;
}

const PostFooter = ({
  type,
  text,
  hashtags = [],
  taggedUsers = [],
  className,
  isHovered = false,
}: Partial<PostFooterProps>) => {
  const isText = type === "text";

  // If it's a text post, this component doesn't need to render anything
  // as the text is handled by PostMedia (PostText) and actions are handled by PostCard
  if (isText) return null;

  const detailPanel = clsx(
    "rounded-3xl px-6 py-6 shadow-[0_28px_85px_-48px_rgba(15,23,42,0.85)] transition-colors duration-300",
    "bg-white/12 border border-white/20 backdrop-blur-xl text-white/90"
  );

  return (
    <motion.div
      className={clsx(
        className,
        "relative z-20 flex flex-col justify-end",
        "mx-0 mb-0 px-4 pb-4 pt-20 md:-mx-8 md:-mb-8 md:px-8 md:pb-10 md:pt-32 bg-linear-to-t from-slate-950/92 via-slate-950/28 to-transparent"
      )}
      animate={{
        opacity: isHovered ? 1 : 0,
        y: isHovered ? 0 : 24,
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}>
      {(text || hashtags.length > 0 || taggedUsers.length > 0) && (
        <div className="absolute inset-x-4 bottom-4 md:inset-x-8 md:bottom-10">
          <div className={detailPanel}>
            {text && (
              <p className="text-base font-medium leading-relaxed md:text-lg">
                {text}
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
  );
};

export { PostFooter };

