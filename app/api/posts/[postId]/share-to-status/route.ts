import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

/**
 * POST /api/posts/{postId}/share-to-status
 * Proxies the request to the external backend, preserving authentication
 * and forwarding any request body (if supplied).
 */
export async function POST(request: NextRequest, { params }: { params: { postId: string } }) {
  try {
    // Retrieve the user's auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    const { postId } = params;

    // Preserve the original request body (if any)
    const rawBody = await request.text();
    const hasBody = rawBody.length > 0;

    const externalRes = await fetch(`${API_BASE_URL}/api/posts/${postId}/share-to-status`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token?.value ?? ""}`,
        "Content-Type": request.headers.get("content-type") ?? "application/json",
      },
      body: hasBody ? rawBody : undefined,
    });

    const data = await externalRes.json();

    // Forward the external status code and payload directly to the client
    return NextResponse.json(data, {
      status: externalRes.status as number,
    });
  } catch (error) {
    console.error("Error proxying share-to-status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to share post to status",
      },
      { status: 500 },
    );
  }
}
