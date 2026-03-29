import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

async function parseUpstreamResponse(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (!text) {
    return null;
  }

  if (contentType.includes("application/json")) {
    return JSON.parse(text);
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      message: "Upstream returned a non-JSON response",
      raw: text.slice(0, 200),
    };
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const { id } = await params;

  try {
    const res = await fetch(`${API_BASE_URL}/api/livestream/${id}/messages`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    const data = await parseUpstreamResponse(res);

    if (!res.ok) {
      console.error("Livestream Messages upstream GET failed:", res.status, data);
      return NextResponse.json(
        { success: false, messages: [], message: "Failed to fetch messages" },
        { status: res.status }
      );
    }

    return NextResponse.json(
      typeof data === "object" && data !== null
        ? data
        : { success: true, messages: [] }
    );
  } catch (error) {
    console.error("Livestream Messages API error:", error);
    return NextResponse.json(
      { success: false, messages: [], message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const { id } = await params;

  try {
    const body = await request.json();
    const res = await fetch(`${API_BASE_URL}/api/livestream/${id}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token?.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await parseUpstreamResponse(res);

    if (!res.ok) {
      console.error("Livestream Messages upstream POST failed:", res.status, data);
      return NextResponse.json(
        typeof data === "object" && data !== null
          ? data
          : { success: false, message: "Failed to send message" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Livestream Send Message API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
