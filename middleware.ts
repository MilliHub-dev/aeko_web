import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/home",
  "/explore",
  "/communities",
  "/live-streams",
  "/profile",
  "/settings",
  "/messages",
  "/notifications",
  "/wallet",
  "/nft-marketplace",
  "/interests",
];

const authRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If on a protected route and not authenticated, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    // Optionally save the return URL
    // loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If on an auth route and authenticated, redirect to home
  // Note: We might want to allow verify-email even if logged in, but usually not needed if verified.
  // For now, redirecting to home is standard.
  if (isAuthRoute && token) {
    // Exception: If they are verifying email, maybe we let them? 
    // But usually verify-email handles the verification token in URL, not the session token.
    // If they are already logged in, verifying email might just update their status.
    // Let's keep it simple: if logged in, go home. 
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (if any specific public assets need exclusion)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
