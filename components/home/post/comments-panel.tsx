"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCommentsPanel } from "./comments-panel-context";
import { CommentSection } from "./post-modal-comment";

export function CommentsPanel() {
	const { isOpen, postId, close } = useCommentsPanel();

	useEffect(() => {
		if (!isOpen) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
		};
		window.addEventListener("keydown", onKey);
		return () =>
			window.removeEventListener("keydown", onKey);
	}, [isOpen, close]);

	return (
		<AnimatePresence>
			{isOpen && postId && (
				<>
					{/* backdrop for click-away close */}
					{/* <motion.div
						key="comments-desktop-overlay"
						className="hidden xl:block fixed inset-0 z-40 bg-black/30"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						onClick={close}
					/> */}

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
					>
						<div className="flex flex-col w-full h-full">
							<div className="flex items-center justify-between p-4 border-b border-border">
								<h2 className="text-lg font-semibold">
									Comments
								</h2>
								<button
									aria-label="Close comments"
									className="rounded-full p-2 hover:bg-secondary"
									onClick={close}
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
