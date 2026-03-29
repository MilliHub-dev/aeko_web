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
    const res = await fetch(`${API_BASE_URL}/api/livestream/${id}`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    const data = await parseUpstreamResponse(res);

    if (!res.ok) {
      console.error("Get Livestream upstream error:", res.status, data);
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get Livestream API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const { id } = await params;

  try {
    const body = await request.json();
    const res = await fetch(`${API_BASE_URL}/api/livestream/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token?.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await parseUpstreamResponse(res);

    if (!res.ok) {
      console.error("Update Livestream upstream error:", res.status, data);
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Update Livestream API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
