"use client";

import { PauseIcon, PlayIcon, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface VideoControlsProps {
	isPlaying: boolean;
	onPlayPause: () => void;
	videoRef: React.RefObject<HTMLVideoElement | null>;
	showOverlay: boolean;
}

const VideoControls = ({
	isPlaying,
	onPlayPause,
	videoRef,
	showOverlay
}: VideoControlsProps) => {
	const [isMuted, setIsMuted] = useState(true);
	const video = videoRef?.current;

	const currentTime = video?.currentTime ?? 0;
	const duration = video?.duration ?? 1;
	const progress = (currentTime / duration) * 100;

	const toggleMute = () => {
		if (!video) return;
		video.muted = !video.muted;
		setIsMuted(video.muted);
	};

	// Sync muted state on mount
	useEffect(() => {
		if (video) setIsMuted(video.muted);
	}, [video]);

	return (
		<>
			{/* Progress Bar */}
			<div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
				<div
					className="h-full bg-white transition-all duration-200"
					style={{ width: `${progress}%` }}
				/>
			</div>

			{/* Play/Pause Icon - centered, only on overlay */}
			<AnimatePresence>
				{showOverlay && (
					<motion.button
						className="absolute inset-0 flex items-center justify-center z-10"
						onClick={onPlayPause}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
					>
						<motion.div
							initial={{ scale: 0.8 }}
							animate={{ scale: 1 }}
							exit={{ scale: 0.8 }}
							transition={{ duration: 0.2 }}
							className="bg-black/60 p-3 rounded-full"
						>
							{isPlaying ? (
								<PauseIcon className="text-white w-6 h-6" />
							) : (
								<PlayIcon className="text-white w-6 h-6 ml-0.5" />
							)}
						</motion.div>
					</motion.button>
				)}
			</AnimatePresence>

			{/* Volume Control */}
			{video && (
				<motion.button
					className="absolute bottom-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70"
					onClick={toggleMute}
					initial={{ opacity: 0 }}
					animate={{ opacity: showOverlay ? 1 : 0 }}
					transition={{ duration: 0.2 }}
				>
					{isMuted ? (
						<VolumeX className="text-white w-5 h-5" />
					) : (
						<Volume2 className="text-white w-5 h-5" />
					)}
				</motion.button>
			)}
		</>
	);
};

export { VideoControls };
