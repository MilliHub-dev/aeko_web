"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCommentsPanel } from "./comments-panel-context";
import { CommentSection } from "./post-modal-comment";

export function CommentsMobileModal() {
  const { isOpen, postId, close } = useCommentsPanel();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

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
            onClick={close}
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
              if (info.offset.y > 80 || info.velocity.y > 800) close();
            }}
            className="xl:hidden fixed inset-x-0 bottom-0 z-50 h-[92vh] max-h-[92vh] rounded-t-2xl bg-background shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex flex-col w-full h-full">
              {/* Grabber */}
              <div className="flex items-center justify-center pt-3">
                <div className="h-1.5 w-12 rounded-full bg-muted" />
              </div>
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h2 className="text-base font-semibold">Comments</h2>
                <button
                  aria-label="Close comments"
                  className="rounded-full p-2 hover:bg-secondary"
                  onClick={close}
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
