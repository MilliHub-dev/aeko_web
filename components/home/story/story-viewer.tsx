"use client";

import { Button } from "@/components/ui/button";
import { UserStoryGroup } from "@/types/story";
import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import clsx from "clsx";
import { ArrowLeft, ArrowRight, X, Heart, Trash2 } from "lucide-react";
import { ReAeko } from "@/lib/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useStoriesStore } from "@/features/stories/stores";
import { useUser } from "@/components/shared/user-context";
import { toast } from "sonner";

interface StoryViewerProps {
  userStories: UserStoryGroup;
  storyId: string;
  prevUser?: UserStoryGroup | null;
  nextUser?: UserStoryGroup | null;
}

const STORY_DURATION = 10000; // 10 seconds default for images
const VIDEO_BUFFER_TIME = 500; // Extra time after video ends

const StoryViewer = ({ userStories, storyId, prevUser, nextUser }: StoryViewerProps) => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const focusTrapRef = useFocusTrap(true);
  const { markStoryAsSeen } = useStoriesStore();
  const holdStartTimeRef = useRef<number | null>(null);

  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(false);
  const [isResharing, setIsResharing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Lock body scroll when viewer is open
  useBodyScrollLock(true);

  const currentStoryIndex = userStories.stories.findIndex((s) => s.id === storyId);
  const currentStory = userStories.stories[currentStoryIndex];
  
  const isOwner = user && (user._id === userStories.userId || user.id === userStories.userId);

  // Reset like state when story changes
  useEffect(() => {
    setIsLiked(false);
  }, [currentStory]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
    setIsPaused(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/status/${currentStory.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Story deleted");
        handleClose();
      } else {
        toast.error("Failed to delete story");
      }
    } catch (err) {
      console.error("Error deleting story:", err);
      toast.error("Error deleting story");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setIsPaused(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setIsPaused(false);
  };

  const handleReshare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isResharing) return;
    
    setIsResharing(true);
    try {
        const res = await fetch(`/api/status/${currentStory.id}/reshare`, { 
            method: 'POST',
            headers: {
              "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
            }
        });
        const data = await res.json();
        
        if (res.ok) {
            toast.success("Story reshared to your profile!");
        } else {
             toast.error(data.message || "Failed to reshare story");
        }
    } catch(e) {
         console.error("Error resharing story:", e);
         toast.error("Error resharing story");
    } finally {
        setIsResharing(false);
    }
  }

  // Define handleClose before it's used in useEffect
  const handleClose = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    // Log the reason – helpful during debugging
    console.info("[StoryViewer] close button → navigating to /home");
    // Navigate to a safe, authenticated route instead of “back”
    router.push("/home");
  }, [router]);

  // Error handling: if story not found, close viewer
  useEffect(() => {
    if (currentStoryIndex === -1 || !currentStory) {
      handleClose();
    }
  }, [currentStoryIndex, currentStory, handleClose]);

  // Mark story as seen when viewed
  useEffect(() => {
    if (currentStory) {
      markStoryAsSeen(currentStory.id);
    }
  }, [currentStory, markStoryAsSeen]);

  // Auto-advance: Only moves to next story within current user (Instagram behavior)
  // Stops at last story of user - does NOT auto-advance to next user
  const goNextStory = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setProgress(0);

    const nextStory = userStories.stories[currentStoryIndex + 1];

    if (nextStory) {
      router.replace(`/home/stories/${userStories.username}/story/${nextStory.id}`);
    } else {
      // At last story of user - pause (Instagram behavior: stops here, doesn't auto-advance to next user)
      setIsPaused(true);
    }
  }, [userStories, currentStoryIndex, router]);

  // Manual navigation: Can move between users (for buttons/swipes/keyboard)
  const goNext = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setProgress(0);

    const nextStory = userStories.stories[currentStoryIndex + 1];

    if (nextStory) {
      // Next story in current user
      router.replace(`/home/stories/${userStories.username}/story/${nextStory.id}`);
    } else if (nextUser && Array.isArray(nextUser.stories) && nextUser.stories.length > 0) {
      // Move to first story of next user
      const firstNextId = nextUser.stories[0].id;
      router.replace(`/home/stories/${nextUser.username}/story/${firstNextId}`);
    } else {
      // No more stories - close viewer
      handleClose();
    }
  }, [userStories, currentStoryIndex, nextUser, router, handleClose]);

  const goPrev = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setProgress(0);

    const prevStory = userStories.stories[currentStoryIndex - 1];

    if (prevStory) {
      // Previous story in current user
      router.replace(`/home/stories/${userStories.username}/story/${prevStory.id}`);
    } else if (prevUser && Array.isArray(prevUser.stories) && prevUser.stories.length > 0) {
      // Move to last story of previous user
      const lastStory = prevUser.stories[prevUser.stories.length - 1];
      router.replace(`/home/stories/${prevUser.username}/story/${lastStory.id}`);
    } else {
      // No previous stories - close viewer
      handleClose();
    }
  }, [userStories, currentStoryIndex, prevUser, router, handleClose]);

  // Progress bar for images - auto-advance only within user (Instagram behavior)
  useEffect(() => {
    if (!currentStory || isPaused) return;

    if (currentStory.mediaType === "image" || currentStory.mediaType === "text") {
      // Enforce minimum 10s duration for text/image stories
      // If backend returns 0 or undefined, use default. If backend returns < 10s, use 10s.
      const duration = Math.max(currentStory.duration || 0, STORY_DURATION);
      const interval = 50; // Update every 50ms
      const increment = (100 / duration) * interval;

      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressIntervalRef.current!);
            // Use goNextStory (only advances within user, stops at last story)
            // Defer navigation to avoid router.replace during render
            setTimeout(() => goNextStory(), 0);
            return 100;
          }
          return prev + increment;
        });
      }, interval);

      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
    }
  }, [currentStory, isPaused, goNextStory]);

  // Video progress tracking
  useEffect(() => {
    if (!currentStory || currentStory.mediaType !== "video") return;
    if (!videoRef.current) return;

    const video = videoRef.current;

    const handleTimeUpdate = () => {
      if (video.duration) {
        const progressPercent = (video.currentTime / video.duration) * 100;
        setProgress(progressPercent);
      }
    };

    const handleEnded = () => {
      setTimeout(() => {
        // Use goNextStory (only advances within user, stops at last story)
        goNextStory();
      }, VIDEO_BUFFER_TIME);
    };

    const handlePlay = () => setIsPaused(false);
    const handlePause = () => setIsPaused(true);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    // Reset progress when story changes
    setProgress(0);
    video.currentTime = 0;

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [currentStory, goNextStory]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowLeft") {
        goPrev();
      } else if (e.key === "ArrowRight") {
        goNext();
      } else if (e.key === " ") {
        e.preventDefault();
        if (currentStory?.mediaType === "video" && videoRef.current) {
          if (videoRef.current.paused) {
            videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
        } else {
          setIsPaused((prev) => !prev);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose, goPrev, goNext, currentStory]);

  // Swipe gestures for mobile & Hold-to-pause logic
  const minSwipeDistance = 50;

  const onPointerDown = (e: React.PointerEvent | React.TouchEvent) => {
    setIsPaused(true);
    holdStartTimeRef.current = Date.now();
    
    // For swipe detection
    if ('touches' in e) {
       setTouchEnd(null);
       setTouchStart(e.touches[0].clientX);
    } else {
       // Mouse pointer
       setTouchEnd(null);
       setTouchStart((e as React.PointerEvent).clientX);
    }
  };

  const onPointerUp = (e: React.PointerEvent | React.TouchEvent) => {
    setIsPaused(false);
    
    // Check for swipe
    let clientX = 0;
    if ('changedTouches' in e) {
      clientX = e.changedTouches[0].clientX;
    } else {
      clientX = (e as React.PointerEvent).clientX;
    }
    
    setTouchEnd(clientX);
    
    // If it was a hold (> 200ms), don't treat as a click/tap.
    // The onClick handler will check holdStartTimeRef too, or we can handle click here.
    // Ideally, we let onClick handle navigation if it wasn't a swipe.
  };
  
  const onPointerLeave = () => {
    setIsPaused(false);
    setTouchStart(null);
    setTouchEnd(null);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // Click handlers for navigation (left/right sides of story)
  const handleStoryClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If swipe occurred, don't navigate via click
    if (touchStart !== null && touchEnd !== null) {
      const distance = touchStart - touchEnd;
      if (Math.abs(distance) > minSwipeDistance) {
        if (distance > minSwipeDistance) goNext();
        else goPrev();
        return;
      }
    }

    // If hold occurred (> 200ms), don't navigate
    if (holdStartTimeRef.current) {
      const holdDuration = Date.now() - holdStartTimeRef.current;
      if (holdDuration > 200) {
        return;
      }
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const splitPoint = width * 0.3; // 30% left for prev, 70% right for next

    if (clickX < splitPoint) {
      goPrev();
    } else {
      goNext();
    }
  };

  if (!currentStory) {
    return null;
  }

  const isImage = currentStory.mediaType === "image";
  const isVideo = currentStory.mediaType === "video";
  const isText = currentStory.mediaType === "text";

  return (
    <>
      <BaseDialog.Root
        key={`${userStories.username}-${storyId}`}
        defaultOpen={true}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
      >
        <BaseDialog.Portal>
          <BaseDialog.Backdrop className="isolate relative">
            <div className="fixed inset-0 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(0,127,109,0.2),transparent_40%),radial-gradient(100%_120%_at_100%_0%,rgba(255,255,255,0.08),transparent_35%),rgba(3,7,18,0.92)] backdrop-blur-md" />
          </BaseDialog.Backdrop>
          <BaseDialog.Popup
            className="fixed inset-0 m-0 flex items-center justify-center gap-2 px-2 py-3 outline-none sm:gap-4 sm:px-4 sm:py-6 lg:gap-6"
            ref={focusTrapRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="story-viewer-title"
          >
            {/* Close Button */}
            <div className="fixed right-3 top-3 z-40 sm:right-6 sm:top-6">
              <BaseDialog.Close
                autoFocus
                className="flex h-11 w-11 cursor-pointer select-none items-center justify-center rounded-full border border-white/15 bg-black/35 shadow-[0_18px_44px_-22px_rgba(0,0,0,0.8)] backdrop-blur-md focus-visible:border-ring focus-visible:outline-2 focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:h-12 sm:w-12"
                onClick={handleClose}
                aria-label="Close story viewer"
                type="button"
              >
                <X className="w-5 h-5 text-white" />
              </BaseDialog.Close>
            </div>

          {/* Previous Button */}
          <Button
            size="icon"
            onClick={goPrev}
            className="z-20 hidden h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/35 shadow-[0_18px_44px_-22px_rgba(0,0,0,0.8)] backdrop-blur-md transition-colors hover:bg-black/50 sm:flex lg:h-14 lg:w-14"
            aria-label="Previous story"
            type="button"
          >
            <ArrowLeft className="h-5 w-5 text-white lg:h-6 lg:w-6" />
          </Button>

          {/* Story Container */}
          <div
            className="relative flex h-[100dvh] w-full max-w-[420px] flex-col items-center justify-center overflow-hidden rounded-none bg-black cursor-pointer select-none sm:h-[88dvh] sm:max-h-[820px] sm:rounded-[32px] lg:max-w-[560px]"
            onClick={handleStoryClick}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerLeave}
            onTouchMove={onTouchMove}
            role="region"
            aria-label={`Story by ${userStories.username}`}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_18%,transparent_82%,rgba(255,255,255,0.06))]" />
            {/* Progress Bar */}
            <div className="absolute left-0 right-0 top-0 z-30 px-3 pt-3 sm:px-4 sm:pt-4">
              <div className="flex gap-1">
                {userStories.stories.map((story, index) => {
                  const isCurrent = index === currentStoryIndex;
                  const isComplete = index < currentStoryIndex;
                  const width = isCurrent ? `${progress}%` : isComplete ? "100%" : "0%";

                  return (
                    <div
                      key={story.id}
                      className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/20"
                      aria-label={`Story ${index + 1} of ${userStories.stories.length}`}
                    >
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-white transition-all duration-75 ease-linear"
                        style={{ width }}
                        aria-valuenow={isCurrent ? progress : isComplete ? 100 : 0}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        role={isCurrent ? "progressbar" : undefined}
                        aria-label={isCurrent ? "Story progress" : undefined}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* User Info Header */}
            <div className="absolute left-0 right-0 top-0 z-30 px-3 pt-8 sm:px-4 sm:pt-10">
              <div className="rounded-[24px] border border-white/12 bg-black/26 p-3 shadow-[0_18px_44px_-22px_rgba(0,0,0,0.75)] backdrop-blur-md">
                <div className="flex items-center gap-3">
              <div 
                className="flex min-w-0 flex-1 items-center gap-3 cursor-pointer transition-opacity hover:opacity-80"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/${userStories.username}`);
                }}
              >
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/40">
                  <Image
                    src={userStories.avatarUrl}
                    alt={`${userStories.username}'s avatar`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <span id="story-viewer-title" className="block truncate text-sm font-semibold text-white">
                    {userStories.username}
                  </span>
                  <span className="block truncate text-xs text-white/70">
                    {currentStoryIndex + 1} of {userStories.stories.length}
                  </span>
                </div>
              </div>
              {isPaused && (
                <div className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white">
                  Paused
                </div>
              )}
            </div>
              </div>
            </div>

            {/* Media Content */}
            <div className="flex items-center justify-center w-full h-full relative">
              {isText ? (
                <div className={`flex h-full w-full items-center justify-center p-6 text-center sm:p-10 ${currentStory.backgroundColor || "bg-gradient-to-br from-[#0f766e] via-[#115e59] to-[#111827]"}`}>
                  <p className={`max-w-[90%] whitespace-pre-wrap break-words text-2xl font-bold text-white sm:text-3xl ${currentStory.font || "font-sans"}`}>
                    {currentStory.content}
                  </p>
                </div>
              ) : isImage ? (
                currentStory.mediaUrl ? (
                  <Image
                    src={currentStory.mediaUrl}
                    alt={`Story by ${userStories.username}`}
                    fill
                    priority
                    className={clsx("object-contain")}
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-white">
                    <p>Image unavailable</p>
                  </div>
                )
              ) : (
                <video
                  ref={videoRef}
                  src={currentStory.mediaUrl}
                  autoPlay
                  muted
                  playsInline
                  className="h-full w-full object-contain"
                  onError={() => {
                    // If video fails to load, skip to next story (within user)
                    setTimeout(() => goNextStory(), 1000);
                  }}
                />
              )}
            </div>

            {/* Caption/Description Overlay */}
            {(!isText && currentStory.content) && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-4 pb-24 pt-16 sm:px-5 sm:pb-28">
                <p className="max-w-[92%] whitespace-pre-wrap break-words text-sm font-medium text-white drop-shadow-md sm:text-base">
                  {currentStory.content}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute bottom-3 left-3 right-3 z-30 sm:bottom-4 sm:left-4 sm:right-4">
              <div className="flex items-center justify-between gap-3 rounded-[24px] border border-white/12 bg-black/30 px-3 py-2.5 shadow-[0_18px_44px_-22px_rgba(0,0,0,0.75)] backdrop-blur-md sm:px-4">
                <div className="min-w-0">
                  <p className="truncate text-xs uppercase tracking-[0.22em] text-white/60">
                    {isText ? "Text status" : isVideo ? "Video status" : "Photo status"}
                  </p>
                  <p className="truncate text-sm font-medium text-white/90">
                    Tap right to continue, left to go back
                  </p>
                </div>
                <div className="flex items-center gap-1">
              {/* Delete Button (Owner Only) */}
              {isOwner && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="rounded-full p-2 transition-colors hover:bg-white/10"
                  aria-label="Delete story"
                >
                   <Trash2 className="h-5 w-5 text-white transition-colors hover:text-red-400 sm:h-6 sm:w-6" />
                </button>
              )}

              {/* Reshare Button */}
              <button
                onClick={handleReshare}
                disabled={isResharing}
                className="rounded-full p-2 transition-colors hover:bg-white/10"
                aria-label="Reshare story"
              >
                <div className="relative h-5 w-5 sm:h-6 sm:w-6">
                   <Image 
                     src="/aeko-dark.png" 
                     alt="Reshare" 
                     fill 
                     className="object-contain invert brightness-0 invert-100"
                   />
                </div>
              </button>

              {/* Like Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLiked(!isLiked);
                }}
                className="rounded-full p-2 transition-colors hover:bg-white/10"
                aria-label={isLiked ? "Unlike story" : "Like story"}
              >
                <Heart 
                  className={clsx("h-6 w-6 transition-colors sm:h-7 sm:w-7", isLiked ? "fill-red-500 text-red-500" : "text-white")} 
                />
              </button>
                </div>
              </div>
            </div>
          </div>

          {/* Next Button */}
          <Button
            size="icon"
            onClick={goNext}
            className="z-20 hidden h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/35 shadow-[0_18px_44px_-22px_rgba(0,0,0,0.8)] backdrop-blur-md transition-colors hover:bg-black/50 sm:flex lg:h-14 lg:w-14"
            aria-label="Next story"
            type="button"
          >
            <ArrowRight className="h-5 w-5 text-white lg:h-6 lg:w-6" />
          </Button>
          </BaseDialog.Popup>
        </BaseDialog.Portal>
      </BaseDialog.Root>

      <Dialog open={showDeleteDialog} onOpenChange={(open) => {
          setShowDeleteDialog(open);
          if (!open) setIsPaused(false);
      }}>
          <DialogContent className="sm:max-w-md bg-white text-black z-[9999]">
              <DialogHeader>
                  <DialogTitle>Delete Story</DialogTitle>
                  <DialogDescription>
                      Are you sure you want to delete this story? This action cannot be undone.
                  </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-end gap-2">
                  <DialogClose asChild>
                      <Button type="button" variant="secondary" onClick={cancelDelete}>
                          Cancel
                      </Button>
                  </DialogClose>
                  <Button type="button" variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
                      {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
};

export { StoryViewer };
