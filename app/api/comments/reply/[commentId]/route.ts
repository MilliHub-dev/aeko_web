import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function POST(
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
    const body = await request.json();
    
    const res = await fetch(
      `${API_BASE_URL}/api/comments/reply/${commentId}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Reply Comment API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
