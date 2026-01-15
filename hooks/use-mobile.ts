"use client";

import { useEffect, useState } from "react";

export function useMobile(breakpoint: number = 768): boolean {
	const [isMobile, setIsMobile] = useState<boolean>(() => {
		if (typeof window === "undefined") return false;
		return window.innerWidth <= breakpoint;
	});

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= breakpoint);
		};

		handleResize(); // Ensure correct value on mount
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [breakpoint]);

	return isMobile;
}
