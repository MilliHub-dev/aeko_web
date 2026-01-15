"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PauseIcon, PlayIcon, Volume2, VolumeX } from "lucide-react";

interface PostVideoPlayerProps {
	videoSrc: string;
	poster?: string;
	header?: ReactNode;
	footer?: ReactNode;
	className?: string;
	autoPlay?: boolean;
	loop?: boolean;
	muted?: boolean;
}

const PostVideoPlayer = ({
	videoSrc,
	poster,
	header,
	footer,
	className = "",
	autoPlay = true,
	loop = true,
	muted = true
}: PostVideoPlayerProps) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isPlaying, setIsPlaying] = useState(autoPlay);
	const [isMuted, setIsMuted] = useState(muted);
	const [showOverlay, setShowOverlay] = useState(true);
	const [progress, setProgress] = useState(0);

	// Update progress bar
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const updateProgress = () => {
			const current = video.currentTime;
			const total = video.duration || 1;
			setProgress((current / total) * 100);
		};

		video.addEventListener("timeupdate", updateProgress);
		return () => {
			video.removeEventListener("timeupdate", updateProgress);
		};
	}, []);

	// Handle play/pause
	const togglePlayPause = () => {
		if (!videoRef.current) return;
		if (videoRef.current.paused) {
			videoRef.current.play();
			setIsPlaying(true);
			setShowOverlay(false);
		} else {
			videoRef.current.pause();
			setIsPlaying(false);
			setShowOverlay(true);
		}
	};

	// Handle mute toggle
	const toggleMute = () => {
		if (!videoRef.current) return;
		videoRef.current.muted = !videoRef.current.muted;
		setIsMuted(videoRef.current.muted);
	};

	// Show overlay on mouse move
	const handleMouseMove = () => {
		setShowOverlay(true);
		if (isPlaying) {
			const timer = setTimeout(() => setShowOverlay(false), 2000);
			return () => clearTimeout(timer);
		}
	};

	return (
		<div
			className={`relative w-full h-full overflow-hidden isolate ${className}`}
			onMouseMove={handleMouseMove}
		>
			{/* Video */}
			<video
				ref={videoRef}
				src={videoSrc}
				className="w-full h-full object-cover absolute inset-0"
				poster={poster}
				autoPlay={autoPlay}
				loop={loop}
				muted={isMuted}
				onClick={togglePlayPause}
			/>

			{/* Overlay gradient */}
			<motion.div
				className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/40"
				animate={{ opacity: showOverlay && !isPlaying ? 1 : 0 }}
				transition={{ duration: 0.3 }}
			/>

			{/* Header */}
			{header && (
				<motion.div
					className="absolute top-4 left-4 right-4"
					animate={{
						opacity: showOverlay ? 1 : 0,
						y: showOverlay ? 0 : -20
					}}
					transition={{ duration: 0.3 }}
				>
					{header}
				</motion.div>
			)}

			{/* Footer */}
			{footer && (
				<motion.div
					className="absolute bottom-0 left-0 right-0 p-4"
					animate={{
						opacity: showOverlay ? 1 : 0,
						y: showOverlay ? 0 : 20
					}}
					transition={{ duration: 0.3 }}
				>
					{footer}
				</motion.div>
			)}

			{/* Progress Bar */}
			<div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 z-10">
				<div
					className="h-full bg-white transition-all duration-200"
					style={{ width: `${progress}%` }}
				/>
			</div>

			{/* Play/Pause Button */}
			<AnimatePresence>
				{showOverlay && (
					<motion.button
						className="absolute inset-0 flex items-center justify-center z-10"
						onClick={togglePlayPause}
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
		</div>
	);
};

export { PostVideoPlayer };
