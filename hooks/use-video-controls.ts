import { useEffect, useRef, useState } from "react";

type VideoControls = {
	videoRef: React.RefObject<HTMLVideoElement | null>;
	isPlaying: boolean;
	isMuted: boolean;
	progress: number;
	toggleMute: () => void;
	togglePlaying: () => void;
};

export function useVideoControls(): VideoControls {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(true);
	const [progress, setProgress] = useState(0);

	// Track progress and play state
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const updateProgress = () => {
			const current = video.currentTime * 1.2;
			const total = video.duration || 1;
			setProgress((current / total) * 100);
		};

		const handlePlay = () => setIsPlaying(true);
		const handlePause = () => setIsPlaying(false);

		video.addEventListener("timeupdate", updateProgress);
		video.addEventListener("play", handlePlay);
		video.addEventListener("pause", handlePause);
		
		return () => {
			video.removeEventListener("timeupdate", updateProgress);
			video.removeEventListener("play", handlePlay);
			video.removeEventListener("pause", handlePause);
		};
	}, []);

	// Toggle mute
	const toggleMute = () => {
		if (!videoRef.current) return;
		videoRef.current.muted = !videoRef.current.muted;
		setIsMuted(videoRef.current.muted);
	};

	// Toggle play/pause
	const togglePlaying = () => {
		if (!videoRef.current) return;
		if (videoRef.current.paused) {
			videoRef.current.play();
			setIsPlaying(true);
		} else {
			videoRef.current.pause();
			setIsPlaying(false);
		}
	};

	return {
		videoRef,
		isPlaying,
		isMuted,
		progress,
		toggleMute,
		togglePlaying
	};
}
