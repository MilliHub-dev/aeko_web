import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/api/users/${id}/followers${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    if (!res.ok) {
        // Fallback or error handling
        const errorText = await res.text();
        console.error(`[Followers Proxy] Backend API error (status: ${res.status}):`, errorText);
        return NextResponse.json({ error: "Failed to fetch followers" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Followers API proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
