"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface PostPlayControlProps {
	togglePlaying: () => void;
	isPlaying: boolean;
}

const PostPlayControl = ({
	togglePlaying,
	isPlaying
}: PostPlayControlProps) => {
	const [showFeedbackIcon, setShowFeedbackIcon] =
		useState(false);

	const handleClick = () => {
		togglePlaying();
		setShowFeedbackIcon(true);

		// Hide icon after 800ms
		setTimeout(() => {
			setShowFeedbackIcon(false);
		}, 200);
	};

	return (
		<motion.button
			onClick={handleClick}
			className="absolute inset-0 flex items-center justify-center z-5 bg-transparent"
		>
			<AnimatePresence mode="wait">
				{showFeedbackIcon && (
					<motion.div
						key={isPlaying ? "pause" : "play"}
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 1.2, opacity: 0 }}
						transition={{
							duration: 0.4,
							ease: "easeOut"
						}}
						className="flex items-center justify-center 
							bg-black/40 backdrop-blur-md 
							border border-white/20 rounded-full p-3 
							shadow-[inset_0_1px_4px_rgba(255,255,255,0.25),
							0_4px_10px_rgba(0,0,0,0.35),
							0_0_12px_rgba(255,255,255,0.15)]"
					>
						{isPlaying ? (
							<PauseIcon className="text-white w-16 h-16" />
						) : (
							<PlayIcon className="text-white w-16 h-16 ml-0.5" />
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</motion.button>
	);
};

export { PostPlayControl };
