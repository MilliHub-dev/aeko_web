import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch("https://dev.aeko.social/api/posts/feed", {
      headers,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Backend API error (${res.status}):`, errorText);
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(errorData, { status: res.status });
      } catch {
        return NextResponse.json(
          { error: `Backend API error: ${res.statusText}` },
          { status: res.status }
        );
      }
    }

    const data = await res.json();
    
    // Ensure we're returning the correct shape
    // If the backend returns { posts: [...] }, use that.
    // If it returns an array [...], wrap it.
    // Adjust based on inspection of 'data' variable if needed.
    const posts = Array.isArray(data) ? data : (data.posts || data.data || []);
    
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching feed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
