import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/config";

interface Params {
  params: Promise<{ postId: string }>;
}

export async function POST(request: NextRequest, { params }: Params) {
  const { postId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/posts/${postId}/not-interested`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    // Handle non-JSON responses (like 204 No Content or empty 200)
    const responseText = await res.text();
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.warn("Backend returned non-JSON response:", responseText);
      data = { success: res.ok, message: res.statusText };
    }

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to mark as not interested" },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Post marked as not interested",
      ...data
    });
  } catch (error) {
    console.error("Not Interested API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
