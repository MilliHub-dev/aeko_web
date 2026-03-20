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
    // Allow navigation on all devices
    if ((event.target as HTMLElement).closest("button, a")) return;
    if (handle && id) {
      router.push(`/${handle}/posts/${id}`);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="relative w-full h-full snap-start flex flex-col justify-center items-center pt-3 pb-10 md:py-6 px-3 md:px-0 max-w-2xl md:max-w-[46rem] mx-auto">
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
            "relative flex flex-col justify-between aspect-[3/4] isolate transition-opacity duration-300 cursor-pointer",
            "rounded-xl md:rounded-4xl",
            isMedia
              ? "p-0 md:p-5 w-full h-full md:w-[88%] md:h-auto md:max-h-none"
              : "p-6 h-full w-full md:w-[88%]",
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
