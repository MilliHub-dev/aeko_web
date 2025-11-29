"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePostUIStore, usePostsStore } from "@/features/posts/stores";
import { CommentSection } from "./post-modal-comment";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useFocusTrap } from "@/hooks/use-focus-trap";

export function CommentsPanel() {
	const { commentsPanel, closeCommentsPanel } = usePostUIStore();
	const { isOpen, postId } = commentsPanel;
	const posts = usePostsStore((state) => state.posts);
	const post = posts.find((p) => p._id === postId);
	const focusTrapRef = useFocusTrap(isOpen);

	// Lock body scroll when panel is open
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
					{/* Backdrop for click-away close */}
					<motion.div
						key="comments-desktop-overlay"
						className="hidden xl:block fixed inset-0 z-40 bg-black/30"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						onClick={closeCommentsPanel}
						aria-hidden="true"
					/>

					<motion.div
						key="comments-panel"
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={{
							duration: 0.25,
							ease: [0.16, 1, 0.3, 1]
						}}
						className="hidden xl:flex fixed top-0 right-0 h-screen w-[27.5vw] max-w-full bg-background border-l border-border z-50 shadow-2xl"
						role="dialog"
						aria-modal="true"
						aria-labelledby="comments-panel-title"
						aria-describedby="comments-panel-description"
					>
						<div className="flex flex-col w-full h-full" ref={focusTrapRef}>
							<div className="flex items-center justify-between p-4 border-b border-border">
								<div className="flex-1 min-w-0">
									<h2 
										id="comments-panel-title"
										className="text-lg font-semibold truncate"
									>
										Comments
									</h2>
									{post && (
										<p 
											id="comments-panel-description"
											className="text-sm text-muted-foreground truncate"
										>
											@{post.user.username}
										</p>
									)}
								</div>
								<button
									aria-label="Close comments panel"
									className="rounded-full p-2 hover:bg-secondary ml-2 shrink-0"
									onClick={closeCommentsPanel}
									type="button"
								>
									<X className="w-5 h-5" />
								</button>
							</div>
							<div className="flex-1 overflow-y-auto p-4">
								<CommentSection
									postId={postId}
								/>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
