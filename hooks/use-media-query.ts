"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook for responsive media queries
 * @param query - CSS media query string
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState<boolean>(() => {
		if (typeof window === "undefined") return false;
		return window.matchMedia(query).matches;
	});

	useEffect(() => {
		const mediaQuery = window.matchMedia(query);

		// Set initial state
		setMatches(mediaQuery.matches);

		// Create event listener function
		const handleChange = (event: MediaQueryListEvent) => {
			setMatches(event.matches);
		};

		// Add event listener
		mediaQuery.addEventListener("change", handleChange);

		// Cleanup
		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, [query]);

	return matches;
}

/**
 * Predefined breakpoint queries for common responsive design patterns
 */
export const breakpoints = {
	// Mobile first approach
	sm: "(min-width: 640px)",
	md: "(min-width: 768px)",
	lg: "(min-width: 1024px)",
	xl: "(min-width: 1280px)",
	"2xl": "(min-width: 1536px)",

	// Max-width queries (desktop first)
	"max-sm": "(max-width: 639px)",
	"max-md": "(max-width: 767px)",
	"max-lg": "(max-width: 1023px)",
	"max-xl": "(max-width: 1279px)",
	"max-2xl": "(max-width: 1535px)",

	// Device-specific queries
	mobile: "(max-width: 767px)",
	tablet: "(min-width: 768px) and (max-width: 1023px)",
	desktop: "(min-width: 1024px)",
	largerScreens:
		"(min-width: 1024px) and (max-width: 1279px)",

	// Orientation queries
	portrait: "(orientation: portrait)",
	landscape: "(orientation: landscape)",

	// Common device queries
	phone: "(max-width: 480px)",
	"phone-lg": "(max-width: 640px)",
	"tablet-sm":
		"(min-width: 640px) and (max-width: 768px)",
	"tablet-lg":
		"(min-width: 768px) and (max-width: 1024px)",

	// High resolution displays
	retina: "(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)",

	// Hover capability (useful for detecting touch devices)
	hover: "(hover: hover)",
	"no-hover": "(hover: none)",

	// Pointer precision (fine = mouse, coarse = touch)
	"fine-pointer": "(pointer: fine)",
	"coarse-pointer": "(pointer: coarse)",

	// Reduced motion preference
	"reduce-motion": "(prefers-reduced-motion: reduce)",
	"no-reduce-motion":
		"(prefers-reduced-motion: no-preference)",

	// Color scheme preference
	"dark-scheme": "(prefers-color-scheme: dark)",
	"light-scheme": "(prefers-color-scheme: light)"
} as const;

/**
 * Hook for using predefined breakpoints
 * @param breakpoint - Key from breakpoints object
 * @returns boolean indicating if the breakpoint matches
 */
export function useBreakpoint(
	breakpoint: keyof typeof breakpoints
): boolean {
	return useMediaQuery(breakpoints[breakpoint]);
}

/**
 * Hook that returns the current screen size category
 * @returns string indicating current screen size
 */
export function useScreenSize():
	| "mobile"
	| "tablet"
	| "desktop"
	| "largerScreens" {
	const isMobile = useMediaQuery(breakpoints.mobile);
	const isTablet = useMediaQuery(breakpoints.tablet);
	const isLargerScreens = useMediaQuery(
		breakpoints["xl"]
	);

	if (isMobile) return "mobile";
	if (isTablet) return "tablet";
	if (isLargerScreens) return "largerScreens";
	return "desktop";
}

/**
 * Hook for multiple breakpoint queries
 * @param queries - Object with query names as keys and media query strings as values
 * @returns Object with same keys but boolean values
 */
export function useMediaQueries<T extends Record<string, string>>(
	queries: T
): Record<keyof T, boolean> {
	const [matches, setMatches] = useState<Record<keyof T, boolean>>(() => {
		if (typeof window === "undefined") {
			return Object.keys(queries).reduce((acc, key) => {
				acc[key as keyof T] = false;
				return acc;
			}, {} as Record<keyof T, boolean>);
		}

		return Object.keys(queries).reduce((acc, key) => {
			acc[key as keyof T] = window.matchMedia(queries[key]).matches;
			return acc;
		}, {} as Record<keyof T, boolean>);
	});

	useEffect(() => {
		const mediaQueries = Object.keys(queries).map((key) => ({
			key,
			query: window.matchMedia(queries[key])
		}));

		// Set initial state
		const initialMatches = mediaQueries.reduce((acc, { key, query }) => {
			acc[key as keyof T] = query.matches;
			return acc;
		}, {} as Record<keyof T, boolean>);
		setMatches(initialMatches);

		// Create event listeners
		const handlers = mediaQueries.map(({ key, query }) => {
			const handler = (event: MediaQueryListEvent) => {
				setMatches((prev) => ({
					...prev,
					[key]: event.matches
				}));
			};
			query.addEventListener("change", handler);
			return { query, handler };
		});

		// Cleanup
		return () => {
			handlers.forEach(({ query, handler }) => {
				query.removeEventListener("change", handler);
			});
		};
	}, [queries]);

	return matches;
}

/**
 * Hook for responsive values based on screen size
 * @param values - Object with breakpoint keys and corresponding values
 * @param defaultValue - Default value to use
 * @returns Current value based on active breakpoint
 */
export function useResponsiveValue<T>(
	values: Partial<Record<keyof typeof breakpoints, T>>,
	defaultValue: T
): T {
	const queries = useMediaQueries(
		Object.keys(values).reduce((acc, key) => {
			acc[key] = breakpoints[key as keyof typeof breakpoints];
			return acc;
		}, {} as Record<string, string>)
	);

	// Find the largest matching breakpoint
	const breakpointOrder = ["2xl", "xl", "lg", "md", "sm"] as const;

	for (const bp of breakpointOrder) {
		if (values[bp] !== undefined && queries[bp]) {
			return values[bp] as T;
		}
	}

	return defaultValue;
}
