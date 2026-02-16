import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log(
      `[Proxy] Unfollowing user ${id} at ${API_BASE_URL}/api/profile/unfollow/${id}`
    );
    const res = await fetch(`${API_BASE_URL}/api/profile/unfollow/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    let data: any = null;
    const text = await res.text();

    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      console.error("[Proxy] Failed to parse JSON response:", e);
      data = { message: "Failed to parse response", raw: text };
    }

    if (!res.ok) {
      console.error(`[Proxy] Unfollow failed: ${res.status}`, data);
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
