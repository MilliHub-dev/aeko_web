import { useRef, useState } from "react";

export function useOverlayActions() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [showOverlay, setShowOverlay] = useState(true);
	const holdTimer = useRef<NodeJS.Timeout | null>(null);

	// 🖱️ Desktop
	const handleMouseMove = (
		e: React.MouseEvent<HTMLDivElement>
	) => {
		const rect =
			containerRef.current?.getBoundingClientRect();
		if (!rect) return;
		const mouseY = e.clientY - rect.top;
		setShowOverlay(
			mouseY < rect.height * 0.2 ||
				mouseY > rect.height * 0.7
		);
	};

	const handleMouseLeave = () => {
		setShowOverlay(true);
	};

	// 📱 Mobile tap & hold → simpler: anywhere triggers overlay
	const handleTouchStart = () => {
		holdTimer.current = setTimeout(() => {
			setShowOverlay(false); // always show overlay on hold
		}, 150); // slight delay for "press & hold" feel
	};

	const handleTouchEnd = () => {
		if (holdTimer.current) {
			clearTimeout(holdTimer.current);
			holdTimer.current = null;
		}
		setShowOverlay(true); // hide overlay when released
	};

	return {
		containerRef,
		showOverlay,
		handleMouseMove,
		handleMouseLeave,
		handleTouchStart,
		handleTouchEnd
	};
}
