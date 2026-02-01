"use client";

import { useRouter } from "next/navigation";
import clsx from "clsx";
import React from "react";

interface PostWrapperProps {
  id: string;
  handle: string;
  ref: React.Ref<HTMLDivElement>;
  children?: React.ReactNode;
  isMedia?: boolean;
  isActive?: boolean;
  onMouseMove?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onDoubleClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
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
  isActive = true,
  onMouseMove,
  onMouseLeave,
  onDoubleClick,
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
    <div className="w-full h-full">
      <div className="relative w-full h-full snap-start flex flex-col justify-center py-2 md:py-6 max-w-md md:max-w-2xl mx-auto">
        <div
          ref={ref}
          onClick={handleRoute}
          onDoubleClick={onDoubleClick}
          onMouseMove={isMedia ? onMouseMove : undefined}
          onMouseLeave={isMedia ? onMouseLeave : undefined}
          onTouchStart={isMedia ? onTouchStart : undefined}
          onTouchEnd={isMedia ? onTouchEnd : undefined}
          onTouchCancel={isMedia ? onTouchCancel : undefined}
          className={clsx(
            "relative flex flex-col justify-between w-full md:aspect-9/16 isolate transition-opacity duration-300 cursor-pointer lg:cursor-default",
            "rounded-xl md:rounded-4xl",
            isMedia ? "p-0 md:p-6 aspect-[9/16]" : "p-6 h-full",
            isActive ? "opacity-100" : "opacity-80",
            isMedia
              ? "overflow-hidden outline-primary/30 outline-2 outline-offset-0"
              : "border bg-card text-card-foreground" // Use theme colors
          )}>
          {children}
        </div>
      </div>
    </div>
  );
};

export { PostWrapper };
