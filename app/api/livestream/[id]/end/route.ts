import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const { id } = await params;

  try {
    const res = await fetch(`${API_BASE_URL}/api/livestream/${id}/end`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token?.value}`,
        "Content-Type": "application/json",
      },
    });

    const responseText = await res.text();
    let data: unknown;

    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      data = {
        success: false,
        message: "Upstream returned a non-JSON response",
        raw: responseText,
      };
    }

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("End Livestream API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
