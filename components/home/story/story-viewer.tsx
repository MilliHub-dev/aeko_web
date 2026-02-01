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
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </BaseDialog.Backdrop>
          <BaseDialog.Popup
            className="fixed inset-0 flex items-center justify-center outline-none m-0 gap-6"
            ref={focusTrapRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="story-viewer-title"
          >
            {/* Close Button */}
            <div className="fixed top-8 right-12 z-10">
              <BaseDialog.Close
                autoFocus
                className="bg-black/30 backdrop-blur-md border border-white/20 shadow-[inset_0_1px_4px_rgba(255,255,255,0.25),0_4px_10px_rgba(0,0,0,0.35),0_0_12px_rgba(255,255,255,0.15)] w-16 h-16 rounded-full flex items-center justify-center cursor-pointer select-none focus-visible:outline-2 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
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
            className="bg-black/30 backdrop-blur-md border border-white/20 shadow-[inset_0_1px_4px_rgba(255,255,255,0.25),0_4px_10px_rgba(0,0,0,0.35),0_0_12px_rgba(255,255,255,0.15)] w-16 h-16 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/40 transition-colors z-10"
            aria-label="Previous story"
            type="button"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </Button>

          {/* Story Container */}
          <div
            className="relative flex flex-col items-center justify-center bg-black lg:w-[35rem] lg:h-[61.12rem] w-[40rem] h-[71.12rem] rounded-lg overflow-hidden cursor-pointer select-none"
            onClick={handleStoryClick}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerLeave}
            onTouchMove={onTouchMove}
            role="region"
            aria-label={`Story by ${userStories.username}`}
          >
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-black/30 z-20">
              <div
                className="h-full bg-white transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
                aria-label="Story progress"
              />
            </div>

            {/* User Info Header */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center gap-3">
              <div 
                className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/${userStories.username}`);
                }}
              >
                <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-white flex-shrink-0">
                  <Image
                    src={userStories.avatarUrl}
                    alt={`${userStories.username}'s avatar`}
                    fill
                    className="object-cover"
                  />
                </div>
                <span id="story-viewer-title" className="text-white font-semibold text-sm truncate">
                  {userStories.username}
                </span>
              </div>
              {isPaused && (
                <div className="text-white text-xs bg-black/30 px-2 py-1 rounded">Paused</div>
              )}
            </div>

            {/* Media Content */}
            <div className="flex items-center justify-center w-full h-full relative">
              {isText ? (
                <div className={`w-full h-full flex items-center justify-center p-8 text-center ${currentStory.backgroundColor || "bg-gradient-to-br from-purple-500 to-pink-500"}`}>
                  <p className={`text-white text-2xl font-bold break-words whitespace-pre-wrap max-w-full overflow-hidden text-ellipsis ${currentStory.font || "font-sans"}`}>
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
                  className="w-full h-full object-contain"
                  onError={() => {
                    // If video fails to load, skip to next story (within user)
                    setTimeout(() => goNextStory(), 1000);
                  }}
                />
              )}
            </div>

            {/* Caption/Description Overlay */}
            {(!isText && currentStory.content) && (
              <div className="absolute bottom-0 left-0 right-0 p-8 pt-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20 pointer-events-none">
                <p className="text-white text-base font-medium break-words whitespace-pre-wrap drop-shadow-md">
                  {currentStory.content}
                </p>
              </div>
            )}
            
            {/* Story Index Indicator */}
            <div className="absolute bottom-4 left-4 right-32 z-20">
              <div className="flex gap-1 justify-center">
                {userStories.stories.map((story, index) => (
                  <div
                    key={story.id}
                    className={`h-1 rounded-full transition-all ${
                      index === currentStoryIndex
                        ? "bg-white flex-1"
                        : "bg-white/30 flex-1 max-w-[40px]"
                    }`}
                    aria-label={`Story ${index + 1} of ${userStories.stories.length}`}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2">
              {/* Delete Button (Owner Only) */}
              {isOwner && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-2 rounded-full hover:bg-black/20 transition-colors"
                  aria-label="Delete story"
                >
                   <Trash2 className="w-6 h-6 text-white hover:text-red-500 transition-colors" />
                </button>
              )}

              {/* Reshare Button */}
              <button
                onClick={handleReshare}
                disabled={isResharing}
                className="p-2 rounded-full hover:bg-black/20 transition-colors"
                aria-label="Reshare story"
              >
                <div className="relative w-6 h-6">
                   <Image 
                     src="/aeko-dark.png" 
                     alt="Reshare" 
                     fill 
                     className="object-contain invert brightness-0 invert-100" // Invert to white if the icon is dark
                   />
                </div>
              </button>

              {/* Like Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLiked(!isLiked);
                }}
                className="p-2 rounded-full hover:bg-black/20 transition-colors"
                aria-label={isLiked ? "Unlike story" : "Like story"}
              >
                <Heart 
                  className={clsx("w-8 h-8 transition-colors", isLiked ? "fill-red-500 text-red-500" : "text-white")} 
                />
              </button>
            </div>
          </div>

          {/* Next Button */}
          <Button
            size="icon"
            onClick={goNext}
            className="bg-black/30 backdrop-blur-md border border-white/20 shadow-[inset_0_1px_4px_rgba(255,255,255,0.25),0_4px_10px_rgba(0,0,0,0.35),0_0_12px_rgba(255,255,255,0.15)] w-16 h-16 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/40 transition-colors z-10"
            aria-label="Next story"
            type="button"
          >
            <ArrowRight className="w-6 h-6 text-white" />
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
