/**
 * Responsive Grid Layout Template
 *
 * A comprehensive, reusable layout template with full responsive breakpoint support
 * for mobile, tablet, desktop, and laptop screens.
 *
 * This template is extracted from a production codebase and includes:
 * - All Tailwind CSS breakpoints (sm, md, lg, xl, 2xl)
 * - Grid configurations for different layout variants
 * - Responsive padding and spacing utilities
 * - TypeScript types for type safety
 *
 * @example
 * ```tsx
 * import { LAYOUT_TEMPLATE, getGridClasses } from './layout-template';
 *
 * function MyLayout({ variant = 'full' }) {
 *   const gridClass = getGridClasses(variant);
 *   return (
 *     <div className={`grid min-h-screen ${gridClass}`}>
 *       <aside>Sidebar</aside>
 *       <main>Content</main>
 *     </div>
 *   );
 * }
 * ```
 */

// ============================================================================
// BREAKPOINT DEFINITIONS
// ============================================================================

/**
 * Tailwind CSS breakpoint values (in pixels)
 * These match Tailwind's default breakpoint system
 */
export const BREAKPOINTS = {
  /** Small devices (landscape phones) - 640px and up */
  sm: 640,
  /** Medium devices (tablets) - 768px and up */
  md: 768,
  /** Large devices (desktops) - 1024px and up */
  lg: 1024,
  /** Extra large devices (large desktops) - 1280px and up */
  xl: 1280,
  /** 2X Large devices (larger desktops) - 1536px and up */
  "2xl": 1536,
} as const;

/**
 * Device category breakpoints
 */
export const DEVICE_BREAKPOINTS = {
  /** Mobile devices - up to 767px */
  mobile: { max: 767 },
  /** Tablet devices - 768px to 1023px */
  tablet: { min: 768, max: 1023 },
  /** Desktop devices - 1024px and up */
  desktop: { min: 1024 },
  /** Laptop devices - 1024px to 1279px */
  laptop: { min: 1024, max: 1279 },
  /** Large screens - 1280px and up */
  largeScreen: { min: 1280 },
} as const;

// ============================================================================
// LAYOUT VARIANTS
// ============================================================================

export type LayoutVariant = "full" | "simple" | "centered" | "wide";

/**
 * Grid column configurations for different layout variants
 *
 * Format: [leftSidebar, middleColumn?, mainContent, rightSidebar?]
 *
 * Breakpoint behavior:
 * - Mobile (< 768px): Single column, no grid
 * - Tablet (768px - 1279px): 2-3 columns
 * - Desktop/Laptop (1280px+): Full multi-column layout
 */
export const GRID_CONFIGS = {
  /**
   * Simple layout: Left sidebar + Main content
   * Mobile: Single column
   * Tablet (md): [5.625rem sidebar, 1fr main]
   * Desktop (xl): [24rem sidebar, 1fr main]
   */
  simple: {
    mobile: "grid-cols-1",
    tablet: "md:grid-cols-[5.625rem_1fr]",
    desktop: "xl:grid-cols-[24rem_1fr]",
    full: "md:grid-cols-[5.625rem_1fr] xl:grid-cols-[24rem_1fr]",
  },

  /**
   * Full layout: Left sidebar + Main content + Right sidebar
   * Mobile: Single column
   * Tablet (md): [5.625rem sidebar, minmax(0, 1fr) main]
   * Desktop (xl): [24rem sidebar, minmax(0, 1fr) main, 28rem right sidebar]
   */
  full: {
    mobile: "grid-cols-1",
    tablet: "md:grid-cols-[5.625rem_minmax(0,1fr)]",
    desktop: "xl:grid-cols-[24rem_minmax(0,1fr)_28rem]",
    full: "md:grid-cols-[5.625rem_minmax(0,1fr)] xl:grid-cols-[24rem_minmax(0,1fr)_28rem]",
  },

  /**
   * Centered layout: Centered content with optional sidebars
   * Mobile: Single column
   * Tablet (md): [auto, 1fr max-w-4xl, auto]
   * Desktop (xl): [auto, 1fr max-w-6xl, auto]
   */
  centered: {
    mobile: "grid-cols-1",
    tablet: "md:grid-cols-[auto_1fr_auto] md:max-w-4xl md:mx-auto",
    desktop: "xl:grid-cols-[auto_1fr_auto] xl:max-w-6xl xl:mx-auto",
    full: "md:grid-cols-[auto_1fr_auto] md:max-w-4xl md:mx-auto xl:max-w-6xl",
  },

  /**
   * Wide layout: Full width with constrained content
   * Mobile: Single column
   * Tablet (md): 1fr with max-width
   * Desktop (xl): 1fr with larger max-width
   */
  wide: {
    mobile: "grid-cols-1",
    tablet: "md:grid-cols-1 md:max-w-5xl md:mx-auto",
    desktop: "xl:grid-cols-1 xl:max-w-7xl xl:mx-auto",
    full: "md:grid-cols-1 md:max-w-5xl md:mx-auto xl:max-w-7xl",
  },
} as const;

// ============================================================================
// RESPONSIVE SPACING
// ============================================================================

/**
 * Responsive padding configurations
 * Provides consistent spacing across breakpoints
 */
export const RESPONSIVE_PADDING = {
  /**
   * Horizontal padding
   * Mobile: 1.5rem (24px)
   * Small: 2rem (32px)
   * Large: 3rem (48px)
   */
  x: {
    mobile: "px-6",
    tablet: "sm:px-8",
    desktop: "lg:px-12",
    full: "px-6 sm:px-8 lg:px-12",
  },

  /**
   * Vertical padding
   * Mobile: 2.5rem (40px)
   * Small: 3.5rem (56px)
   * Large: 4rem (64px)
   */
  y: {
    mobile: "py-10",
    tablet: "sm:py-14",
    desktop: "lg:py-16",
    full: "py-10 sm:py-14 lg:py-16",
  },

  /**
   * Container padding (for layout wrapper)
   * Desktop: 2rem (32px) horizontal padding
   */
  container: {
    desktop: "xl:px-8",
  },
} as const;

/**
 * Responsive gap spacing for grid layouts
 */
export const RESPONSIVE_GAP = {
  /** Small gap: 1rem (16px) */
  sm: "gap-4",
  /** Medium gap: 1.5rem (24px) */
  md: "gap-6",
  /** Large gap: 2rem (32px) */
  lg: "gap-8",
  /** Extra large gap: 3rem (48px) */
  xl: "gap-12",
  /** Responsive gap: increases with screen size */
  responsive: "gap-4 md:gap-6 lg:gap-8 xl:gap-12",
} as const;

// ============================================================================
// MAX WIDTH CONFIGURATIONS
// ============================================================================

/**
 * Container max-width configurations
 */
export const MAX_WIDTHS = {
  /** Full width (no constraint) */
  full: "max-w-full",
  /** Standard container: 1920px */
  container: "max-w-[1920px]",
  /** Auth pages: responsive max-width */
  auth: "max-w-xl lg:max-w-7xl 2xl:max-w-[1600px]",
  /** Content container: 1280px */
  content: "max-w-7xl",
  /** Wide container: 1536px */
  wide: "max-w-[1536px]",
  /** Narrow container: 1024px */
  narrow: "max-w-5xl",
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get grid classes for a specific layout variant
 * @param variant - Layout variant type
 * @param responsive - If true, returns full responsive classes. If false, returns only desktop classes.
 * @returns Tailwind CSS grid classes
 */
export function getGridClasses(
  variant: LayoutVariant = "full",
  responsive: boolean = true
): string {
  const config = GRID_CONFIGS[variant];
  return responsive ? config.full : config.desktop;
}

/**
 * Get responsive padding classes
 * @param direction - 'x' for horizontal, 'y' for vertical, or 'both' for both
 * @returns Tailwind CSS padding classes
 */
export function getPaddingClasses(
  direction: "x" | "y" | "both" = "both"
): string {
  if (direction === "x") return RESPONSIVE_PADDING.x.full;
  if (direction === "y") return RESPONSIVE_PADDING.y.full;
  return `${RESPONSIVE_PADDING.x.full} ${RESPONSIVE_PADDING.y.full}`;
}

/**
 * Get container classes with max-width and padding
 * @param maxWidth - Max width variant
 * @param padding - Whether to include responsive padding
 * @returns Tailwind CSS classes
 */
export function getContainerClasses(
  maxWidth: keyof typeof MAX_WIDTHS = "container",
  padding: boolean = true
): string {
  const classes: string[] = [];
  const maxWidthClass = MAX_WIDTHS[maxWidth];
  if (typeof maxWidthClass === "string") {
    classes.push(maxWidthClass);
  }
  if (padding) {
    classes.push(RESPONSIVE_PADDING.x.full);
  }
  return classes.join(" ");
}

// ============================================================================
// COMPLETE LAYOUT TEMPLATE
// ============================================================================

/**
 * Complete layout template configuration
 * Combines all layout utilities into a single export
 */
export const LAYOUT_TEMPLATE = {
  /** Breakpoint definitions */
  breakpoints: BREAKPOINTS,
  /** Device category breakpoints */
  devices: DEVICE_BREAKPOINTS,
  /** Grid configurations for different variants */
  grids: GRID_CONFIGS,
  /** Responsive padding utilities */
  padding: RESPONSIVE_PADDING,
  /** Responsive gap utilities */
  gap: RESPONSIVE_GAP,
  /** Max width configurations */
  maxWidths: MAX_WIDTHS,
  /** Utility functions */
  utils: {
    getGridClasses,
    getPaddingClasses,
    getContainerClasses,
  },
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Breakpoint = keyof typeof BREAKPOINTS;
export type DeviceCategory = keyof typeof DEVICE_BREAKPOINTS;
export type GridConfig = keyof typeof GRID_CONFIGS;
export type MaxWidth = keyof typeof MAX_WIDTHS;

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * EXAMPLE 1: Basic Layout Component
 *
 * ```tsx
 * import { getGridClasses } from './layout-template';
 *
 * function AppLayout({ children, variant = 'full' }) {
 *   return (
 *     <div className={`grid min-h-screen items-start ${getGridClasses(variant)}`}>
 *       <aside className="sticky top-6">Sidebar</aside>
 *       <main className="relative">{children}</main>
 *     </div>
 *   );
 * }
 * ```
 *
 * EXAMPLE 2: Responsive Container
 *
 * ```tsx
 * import { getContainerClasses, getPaddingClasses } from './layout-template';
 *
 * function ContentContainer({ children }) {
 *   return (
 *     <div className={`w-full ${getContainerClasses('content', true)}`}>
 *       {children}
 *     </div>
 *   );
 * }
 * ```
 *
 * EXAMPLE 3: Custom Grid Layout
 *
 * ```tsx
 * import { GRID_CONFIGS, RESPONSIVE_GAP } from './layout-template';
 *
 * function CustomLayout() {
 *   return (
 *     <div className={`grid ${GRID_CONFIGS.simple.full} ${RESPONSIVE_GAP.responsive}`}>
 *       <aside>Sidebar</aside>
 *       <main>Content</main>
 *     </div>
 *   );
 * }
 * ```
 *
 * EXAMPLE 4: Mobile-First Responsive Design
 *
 * ```tsx
 * function ResponsiveComponent() {
 *   return (
 *     <div className={`
 *       grid-cols-1           // Mobile: single column
 *       md:grid-cols-2        // Tablet: 2 columns
 *       lg:grid-cols-3        // Desktop: 3 columns
 *       xl:grid-cols-4        // Large desktop: 4 columns
 *       gap-4 md:gap-6 lg:gap-8
 *     `}>
 *     </div>
 *   );
 * }
 * ```
 */
