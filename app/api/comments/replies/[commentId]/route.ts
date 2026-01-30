import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const { commentId } = await params;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token?.value) {
    headers["Authorization"] = `Bearer ${token.value}`;
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/comments/replies/${commentId}`,
      {
        headers,
      },
    );

    if (!res.ok) {
      const errorText = await res.text();
      try {
        const errorJson = JSON.parse(errorText);
        return NextResponse.json(errorJson, { status: res.status });
      } catch {
        return NextResponse.json({ message: errorText.substring(0, 200) }, { status: res.status });
      }
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Get Replies API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
