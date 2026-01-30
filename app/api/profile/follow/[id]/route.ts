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
    // Updated endpoint to match backend requirement: /api/profile/follow/:id
    console.log(`[Proxy] Following user ${id} at ${API_BASE_URL}/api/profile/follow/${id}`);
    const res = await fetch(`${API_BASE_URL}/api/profile/follow/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    let data;
    try {
      data = await res.json();
    } catch (e) {
      console.error("[Proxy] Failed to parse JSON response:", e);
      data = { message: "Failed to parse response" };
    }

    if (!res.ok) {
      console.error(`[Proxy] Follow failed: ${res.status}`, data);
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
