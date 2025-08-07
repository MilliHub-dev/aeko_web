"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

// Optional: define a route-to-name map
const routeMap: Record<string, string> = {
	"/": "Home",
	"/explore": "Explore",
	"/notifications": "Notifications",
	"/messages": "Messages",
	"/profile": "Profile",
	"/settings": "Settings",
	"/post": "Post",
	"/create": "Create",
	"/login": "Login",
	"/register": "Register"
};

export function useRouteName(): string {
	const pathname = usePathname();

	const routeName = useMemo(() => {
		if (!pathname) return "";

		// Normalize dynamic routes
		const basePath = pathname.split("/")[1] || "/";

		// Handle root path
		if (pathname === "/") return "Home";

		// Check direct match
		if (routeMap[pathname]) return routeMap[pathname];

		// Handle basePath match (e.g. /profile/maikel)
		if (routeMap[`/${basePath}`]) return routeMap[`/${basePath}`];

		// Default fallback
		return basePath.charAt(0).toUpperCase() + basePath.slice(1);
	}, [pathname]);

	return routeName;
}
