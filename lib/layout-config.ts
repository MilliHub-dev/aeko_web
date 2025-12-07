export type LayoutVariant = "full" | "simple";

// Layout constants for consistent spacing and sizing
export const LAYOUT_CONSTANTS = {
  // Max widths
  MAX_WIDTH_FULL: "max-w-full",
  MAX_WIDTH_CONTAINER: "max-w-[1920px]",
  MAX_WIDTH_AUTH: "max-w-xl lg:max-w-7xl 2xl:max-w-[1600px]",

  // Grid column configurations
  GRID_COLS_SIMPLE: "md:grid-cols-[5.625rem_1fr] xl:grid-cols-[24rem_1fr]",
  GRID_COLS_FULL:
    "md:grid-cols-[5.625rem_1fr] xl:grid-cols-[24rem_minmax(0,1fr)_24rem]",

  // Standard padding
  PADDING_X: "px-6 sm:px-8 lg:px-12",
  PADDING_Y: "py-10 sm:py-14 lg:py-16",
} as const;

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

  const variant: LayoutVariant = isSimpleRoute ? "simple" : "full";

  // Keep behavior consistent with existing components:
  // - MobileHeader is not shown on /messages (component further hides on user-posts)
  // - MobileNavbar hides on user-posts route
  const showMobileHeader = path !== "/messages" && !isUserPostsRoute;
  const showMobileNavbar = !isUserPostsRoute;

  return {
    variant,
    isUserPostsRoute,
    isLandingPage,
    showMobileHeader,
    showMobileNavbar,
  };
}
