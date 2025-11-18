import { useEffect, useRef } from "react";

/**
 * Hook to lock/unlock body scroll when a modal or panel is open
 */
export function useBodyScrollLock(isLocked: boolean) {
	const originalOverflowRef = useRef<string | null>(null);

	useEffect(() => {
		if (isLocked) {
			// Store original overflow value if not already stored
			if (originalOverflowRef.current === null) {
				originalOverflowRef.current = window.getComputedStyle(document.body).overflow;
			}
			// Lock scroll
			document.body.style.overflow = "hidden";
		} else {
			// Unlock scroll - restore original value
			if (originalOverflowRef.current !== null) {
				document.body.style.overflow = originalOverflowRef.current;
				originalOverflowRef.current = null;
			} else {
				// Fallback: just remove the style if we don't have original
				document.body.style.overflow = "";
			}
		}

		// Cleanup: restore scroll when component unmounts
		return () => {
			if (originalOverflowRef.current !== null) {
				document.body.style.overflow = originalOverflowRef.current;
				originalOverflowRef.current = null;
			} else {
				document.body.style.overflow = "";
			}
		};
	}, [isLocked]);
}

