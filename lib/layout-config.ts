export type LayoutVariant = "full" | "simple";

// Centralized layout decisions based on pathname
export function getLayoutConfig(path: string): {
	variant: LayoutVariant;
	isUserPostsRoute: boolean;
	isLandingPage: boolean;
	showMobileHeader: boolean;
	showMobileNavbar: boolean;
} {
	// Matches /{handle}/posts/{id} OR /home/{handle}/posts/{id}
	const isUserPostsRoute =
		/^\/[^/]+\/posts\/[^/]+$/.test(path) ||
		/^\/home\/[^/]+\/posts\/[^/]+$/.test(path);

	const isSimpleRoute =
		/^\/(explore|communities|wallet|nft-marketplace|messages|notifications|settings)(\/|$)/.test(
			path
		) || /^\/live-streams(\/|$)/.test(path);

	const isLandingPage = /^\/$|^\/.+\/?$/.test(path);

	const variant: LayoutVariant = isSimpleRoute
		? "simple"
		: "full";

	// Keep behavior consistent with existing components:
	// - MobileHeader is not shown on /messages (component further hides on user-posts)
	// - MobileNavbar hides on user-posts route
	const showMobileHeader =
		path !== "/messages" && !isUserPostsRoute;
	const showMobileNavbar = !isUserPostsRoute;

	return {
		variant,
		isUserPostsRoute,
		isLandingPage,
		showMobileHeader,
		showMobileNavbar
	};
}
