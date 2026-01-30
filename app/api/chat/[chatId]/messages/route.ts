import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const { chatId } = await params;

  try {
    // Guessing the endpoint based on standard conventions
    // Could be /api/chat/{chatId}/messages or /api/chat/messages/{chatId}
    const res = await fetch(`${API_BASE_URL}/api/chat/${chatId}/messages`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat Messages API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
