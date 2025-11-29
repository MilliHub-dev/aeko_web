"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePostUIStore, usePostsStore } from "@/features/posts/stores";
import { CommentSection } from "./post-modal-comment";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useFocusTrap } from "@/hooks/use-focus-trap";

export function CommentsMobileModal() {
  const { commentsPanel, closeCommentsPanel } = usePostUIStore();
  const { isOpen, postId } = commentsPanel;
  const posts = usePostsStore((state) => state.posts);
  const post = posts.find((p) => p._id === postId);
  const focusTrapRef = useFocusTrap(isOpen);

  // Lock body scroll when modal is open
  useBodyScrollLock(isOpen);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCommentsPanel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCommentsPanel]);

  return (
    <AnimatePresence>
      {isOpen && postId && (
        <>
          {/* Dimmed backdrop */}
          <motion.div
            key="comments-mobile-overlay"
            className="xl:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCommentsPanel}
          />

          {/* Sheet */}
          <motion.div
            key="comments-mobile-modal"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (info.offset.y > 80 || info.velocity.y > 800) closeCommentsPanel();
            }}
            className="xl:hidden fixed inset-x-0 bottom-0 z-50 h-[92vh] max-h-[92vh] rounded-t-2xl bg-background shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="comments-mobile-title"
            aria-describedby="comments-mobile-description"
          >
            <div className="flex flex-col w-full h-full" ref={focusTrapRef}>
              {/* Grabber */}
              <div className="flex items-center justify-center pt-3">
                <div className="h-1.5 w-12 rounded-full bg-muted" />
              </div>
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex-1 min-w-0">
                  <h2 id="comments-mobile-title" className="text-base font-semibold">
                    Comments
                  </h2>
                  {post && (
                    <p 
                      id="comments-mobile-description"
                      className="text-xs text-muted-foreground truncate"
                    >
                      @{post.user.username}
                    </p>
                  )}
                </div>
                <button
                  aria-label="Close comments modal"
                  className="rounded-full p-2 hover:bg-secondary ml-2 shrink-0"
                  onClick={closeCommentsPanel}
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 pb-8">
                <CommentSection postId={postId} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
