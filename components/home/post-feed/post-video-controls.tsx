import { motion } from "motion/react";
import { PauseIcon, PlayIcon, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

interface VideoControlsProps {
	isPlaying: boolean;
	onPlayPause: () => void;
	videoRef: React.RefObject<HTMLVideoElement>;
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
		setIsMuted(!isMuted);
	};

	return (
		<>
			{/* Progress Bar - Always at top */}
			<motion.div
				className="absolute bottom-0 left-0 right-0 h-1 bg-white/20"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.2 }}
			>
				<motion.div
					className="h-full bg-white"
					style={{ width: `${progress}%` }}
				/>
			</motion.div>

			{/* Center Play/Pause Button - Shows briefly on state change */}
			<motion.button
				className="absolute inset-0 w-full h-full flex items-center justify-center"
				onClick={onPlayPause}
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{
						opacity: isPlaying ? 0 : 1,
						scale: 1
					}}
					transition={{ duration: 0.2 }}
					className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
				>
					{isPlaying ? (
						<PauseIcon className="w-8 h-8 text-white" />
					) : (
						<PlayIcon className="w-8 h-8 text-white ml-1" />
					)}
				</motion.div>
			</motion.button>

			{/* Volume Control - Bottom right */}
			<motion.button
				className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
				onClick={toggleMute}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.2 }}
			>
				{isMuted ? (
					<VolumeX className="w-4 h-4 text-white" />
				) : (
					<Volume2 className="w-4 h-4 text-white" />
				)}
			</motion.button>

			{/* Hidden Range Input for Seeking */}
			<input
				type="range"
				min={0}
				max={100}
				value={progress}
				step={0.1}
				className="sr-only"
				onChange={(e) => {
					if (video) {
						video.currentTime = (Number(e.target.value) / 100) * duration;
					}
				}}
			/>
		</>
	);
};

export { VideoControls };
