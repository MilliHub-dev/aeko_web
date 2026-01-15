import { useRef, useState, useCallback } from "react";

export function useOverlayActions() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);

  // Cleanup helper
  const clearHoldTimer = useCallback(() => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }, []);

  // 🖱️ Desktop
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseY = e.clientY - rect.top;
    setShowOverlay(mouseY < rect.height * 0.2 || mouseY > rect.height * 0.7);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowOverlay(true);
  }, []);

  // 📱 Mobile tap & hold
  const handleTouchStart = useCallback(() => {
    // Clear any existing timer first
    clearHoldTimer();

    // Start new timer to hide overlay after hold
    holdTimer.current = setTimeout(() => {
      setShowOverlay(false);
      holdTimer.current = null; // Clear ref after timeout fires
    }, 150);
  }, [clearHoldTimer]);

  const handleTouchEnd = useCallback(() => {
    clearHoldTimer();
    setShowOverlay(true); // Show overlay when released
  }, [clearHoldTimer]);

  const handleTouchCancel = useCallback(() => {
    clearHoldTimer();
    setShowOverlay(true); // Show overlay when touch is cancelled
  }, [clearHoldTimer]);

  return {
    containerRef,
    showOverlay,
    handleMouseMove,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
    handleTouchCancel,
  };
}
