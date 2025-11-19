/**
 * Demo Layout Component
 *
 * A complete example implementation using the layout-template.ts
 * This demonstrates how to build a responsive layout similar to the base-layout.tsx
 *
 * @example
 * ```tsx
 * import { DemoLayout } from './demo-layout';
 *
 * export default function Page() {
 *   return (
 *     <DemoLayout variant="full">
 *       <YourContent />
 *     </DemoLayout>
 *   );
 * }
 * ```
 */

"use client";

import {
  getGridClasses,
  RESPONSIVE_PADDING,
  type LayoutVariant,
} from "./layout-template";

// ============================================================================
// DEMO COMPONENTS (Placeholder components for demonstration)
// ============================================================================

/**
 * Demo Left Sidebar Component
 * Shows on desktop (xl+) and tablet (md-xl)
 */
function DemoLeftSidebar() {
  return (
    <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-[300px] shrink-0 xl:flex">
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[32px] bg-card border border-border/60">
        <div className="space-y-4 px-6 pb-5 pt-6">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center border border-border/60">
              <span className="text-lg font-semibold">AS</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                Product Designer
              </p>
              <p className="text-lg font-semibold">Andrew Smith</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-6 overflow-y-auto">
          <nav className="space-y-2">
            {["Home", "Explore", "Messages", "Notifications", "Profile"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                  <span className="text-lg">{item}</span>
                </a>
              )
            )}
          </nav>
        </div>
      </div>
    </aside>
  );
}

/**
 * Demo Mobile Left Sidebar Component
 * Shows on tablet only (md-xl, hidden on mobile and desktop)
 */
function DemoMobileLeftSidebar() {
  return (
    <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-20 shrink-0 md:flex xl:hidden">
      <div className="relative flex h-full w-full flex-col items-center overflow-hidden rounded-[32px] bg-card border border-border/60 pb-4">
        <nav className="mt-6 flex flex-1 flex-col items-center gap-4">
          {["Home", "Explore", "Messages", "Notifications", "Profile"].map(
            (item, idx) => (
              <a
                key={item}
                href="#"
                className="group relative flex h-14 w-14 items-center justify-center rounded-2xl hover:bg-muted/60 transition"
                aria-label={item}>
                <span className="text-lg">{item[0]}</span>
              </a>
            )
          )}
        </nav>
      </div>
    </aside>
  );
}

/**
 * Demo Right Sidebar Component
 * Only shown in "full" layout variant on desktop (xl+)
 */
function DemoRightSidebar() {
  return (
    <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-[320px] shrink-0 xl:flex">
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[32px] bg-card border border-border/60">
        <div className="px-6 pt-6 pb-4">
          <h3 className="text-lg font-semibold">Suggestions</h3>
        </div>
        <div className="flex-1 px-6 overflow-y-auto space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted border border-border/60" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">User {i}</p>
                <p className="text-xs text-muted-foreground truncate">
                  Suggested for you
                </p>
              </div>
              <button className="text-xs text-primary font-semibold">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

/**
 * Demo Mobile Header Component
 * Shows on mobile devices only
 */
function DemoMobileHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-b border-border/60 px-4 py-3 md:hidden z-10">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Demo App</h1>
        <div className="flex items-center gap-2">
          <button className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <span>🔔</span>
          </button>
          <button className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <span>⚙️</span>
          </button>
        </div>
      </div>
    </header>
  );
}

/**
 * Demo Mobile Navbar Component
 * Shows on mobile devices at the bottom
 */
function DemoMobileNavbar() {
  return (
    <nav className="flex justify-center md:hidden fixed bottom-4 left-0 right-0 z-10">
      <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border/60 rounded-full px-4 py-2 shadow-lg">
        {["Home", "Explore", "Add", "Messages", "Profile"].map((item) => (
          <button
            key={item}
            className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition"
            aria-label={item}>
            <span className="text-xs">{item[0]}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ============================================================================
// MAIN DEMO LAYOUT COMPONENT
// ============================================================================

interface DemoLayoutProps {
  /** Layout variant: 'full' includes all sidebars, 'simple' only left sidebar */
  variant?: LayoutVariant;
  /** Whether to show mobile header */
  showMobileHeader?: boolean;
  /** Whether to show mobile navbar */
  showMobileNavbar?: boolean;
  /** Main content to render */
  children: React.ReactNode;
  /** Optional custom className for the grid container */
  className?: string;
}

/**
 * Demo Layout Component
 *
 * A complete responsive layout implementation using layout-template.ts
 *
 * Features:
 * - Responsive grid system (mobile, tablet, desktop)
 * - Multiple layout variants (full, simple, centered, wide)
 * - Mobile-first design
 * - Sticky sidebars
 * - Mobile navigation
 *
 * @param variant - Layout variant type (default: 'full')
 * @param showMobileHeader - Show mobile header (default: true)
 * @param showMobileNavbar - Show mobile navbar (default: true)
 * @param children - Main content
 * @param className - Additional CSS classes
 */
export function DemoLayout({
  variant = "full",
  showMobileHeader = true,
  showMobileNavbar = true,
  children,
  className = "",
}: DemoLayoutProps) {
  const isFullLayout = variant === "full";

  // Get grid classes from template
  const gridColsClass = getGridClasses(variant, true);

  return (
    <div className="relative w-full max-w-full bg-background">
      {/* Mobile Header - shows on mobile only */}
      {showMobileHeader && <DemoMobileHeader />}

      {/* Main Grid Container */}
      <div
        className={`
          ${RESPONSIVE_PADDING.container.desktop}
          grid 
          min-h-screen 
          items-start 
          ${gridColsClass}
          ${className}
        `}>
        {/* Mobile Left Sidebar - shows on tablet (md-xl) */}
        <DemoMobileLeftSidebar />

        {/* Desktop Left Sidebar - shows on desktop (xl+) */}
        <DemoLeftSidebar />

        {/* Main Content Area */}
        <main className="relative">
          {/* Content wrapper with responsive padding */}
          <div className={RESPONSIVE_PADDING.x.full}>{children}</div>
        </main>

        {/* Right Sidebar - only in full layout, shows on desktop (xl+) */}
        {isFullLayout && <DemoRightSidebar />}
      </div>

      {/* Mobile Navbar - shows on mobile only */}
      {showMobileNavbar && <DemoMobileNavbar />}
    </div>
  );
}

// ============================================================================
// SIMPLE LAYOUT VARIANT (Alternative implementation)
// ============================================================================

/**
 * Simple Demo Layout
 *
 * A simplified version with only left sidebar
 * Useful for pages like settings, profile, etc.
 */
export function SimpleDemoLayout({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <DemoLayout variant="simple" className={className}>
      {children}
    </DemoLayout>
  );
}

// ============================================================================
// CENTERED LAYOUT VARIANT
// ============================================================================

/**
 * Centered Demo Layout
 *
 * A centered content layout with optional sidebars
 * Useful for blog posts, articles, etc.
 */
export function CenteredDemoLayout({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const gridColsClass = getGridClasses("centered", true);

  return (
    <div className="relative w-full max-w-full bg-background">
      <div
        className={`
          ${RESPONSIVE_PADDING.container.desktop}
          grid 
          min-h-screen 
          items-start 
          ${gridColsClass}
          ${className}
        `}>
        {/* Optional left sidebar area */}
        <aside className="hidden xl:block" />

        {/* Centered main content */}
        <main className="relative">
          <div className={RESPONSIVE_PADDING.x.full}>{children}</div>
        </main>

        {/* Optional right sidebar area */}
        <aside className="hidden xl:block" />
      </div>
    </div>
  );
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * EXAMPLE 1: Full Layout (default)
 *
 * ```tsx
 * import { DemoLayout } from './demo-layout';
 *
 * export default function HomePage() {
 *   return (
 *     <DemoLayout variant="full">
 *       <div className="space-y-4">
 *         <h1 className="text-3xl font-bold">Home</h1>
 *         <p>Your content here...</p>
 *       </div>
 *     </DemoLayout>
 *   );
 * }
 * ```
 *
 * EXAMPLE 2: Simple Layout
 *
 * ```tsx
 * import { SimpleDemoLayout } from './demo-layout';
 *
 * export default function SettingsPage() {
 *   return (
 *     <SimpleDemoLayout>
 *       <div className="max-w-2xl mx-auto">
 *         <h1 className="text-3xl font-bold">Settings</h1>
 *         <p>Settings content...</p>
 *       </div>
 *     </SimpleDemoLayout>
 *   );
 * }
 * ```
 *
 * EXAMPLE 3: Centered Layout
 *
 * ```tsx
 * import { CenteredDemoLayout } from './demo-layout';
 *
 * export default function ArticlePage() {
 *   return (
 *     <CenteredDemoLayout>
 *       <article className="prose max-w-none">
 *         <h1>Article Title</h1>
 *         <p>Article content...</p>
 *       </article>
 *     </CenteredDemoLayout>
 *   );
 * }
 * ```
 *
 * EXAMPLE 4: Custom Layout with Template Utilities
 *
 * ```tsx
 * import { getGridClasses, getContainerClasses } from './layout-template';
 *
 * export default function CustomPage() {
 *   return (
 *     <div className={getContainerClasses('content', true)}>
 *       <div className={`grid ${getGridClasses('wide')} gap-6`}>
 *         <section>Section 1</section>
 *         <section>Section 2</section>
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
