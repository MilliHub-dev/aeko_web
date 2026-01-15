"use client";

import { useRouter } from "next/navigation";
import clsx from "clsx";
import React from "react";
import { PostActions } from "./post-actions";

interface PostWrapperProps {
  id: string;
  handle: string;
  ref: React.Ref<HTMLDivElement>;
  children?: React.ReactNode;
  isMedia?: boolean;
  likes: number;
  shares: number;
  // bookmarks: string;
  comments: number;
  reposts: number;
  isActive?: boolean;
  onMouseMove?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onTouchStart?: (event: React.TouchEvent<HTMLDivElement>) => void;
  onTouchEnd?: (event: React.TouchEvent<HTMLDivElement>) => void;
  onTouchCancel?: (event: React.TouchEvent<HTMLDivElement>) => void;
}

const PostWrapper = ({
  children,
  handle,
  isMedia,
  id,
  ref,
  likes,
  shares,
  // bookmarks,
  comments,
  reposts,
  isActive = true,
  onMouseMove,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
  onTouchCancel,
}: Partial<PostWrapperProps>) => {
  const router = useRouter();

  const handleRoute = (event: React.MouseEvent<HTMLDivElement>) => {
    // Disable navigation on desktop (lg breakpoint is usually 1024px)
    if (window.innerWidth >= 1024) return;

    if ((event.target as HTMLElement).closest("button, a")) return;
    if (handle && id) {
      router.push(`/${handle}/posts/${id}`);
    }
  };

  return (
    <div className="">
      <div className="relative w-full h-dvh snap-start flex flex-col justify-center py-28 lg:py-6 lg:h-screen lg:snap-start lg:flex-row gap-x-6 max-w-md md:max-w-2xl">
        <div
          ref={ref}
          onClick={handleRoute}
          onMouseMove={isMedia ? onMouseMove : undefined}
          onMouseLeave={isMedia ? onMouseLeave : undefined}
          onTouchStart={isMedia ? onTouchStart : undefined}
          onTouchEnd={isMedia ? onTouchEnd : undefined}
          onTouchCancel={isMedia ? onTouchCancel : undefined}
          className={clsx(
            "relative flex flex-col justify-between w-full md:aspect-9/16 h-full rounded-4xl isolate p-6 transition-opacity duration-300 cursor-pointer lg:cursor-default",
            isActive ? "opacity-100" : "opacity-80",
            isMedia
              ? "overflow-hidden outline-primary/30 outline-2 outline-offset-0"
              : "border"
          )}>
          {children}
        </div>
        <PostActions
          likes={likes}
          shares={shares}
          // bookmarks={bookmarks}
          comments={comments}
          reposts={reposts}
          postId={id}
        />
      </div>
    </div>
  );
};

export { PostWrapper };
