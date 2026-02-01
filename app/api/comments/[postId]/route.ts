import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const { postId } = await params;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token?.value) {
    headers["Authorization"] = `Bearer ${token.value}`;
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/comments/${postId}`,
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
    console.error("Get Comments API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const { postId } = await params;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token?.value) {
    headers["Authorization"] = `Bearer ${token.value}`;
  }

  try {
    const body = await request.json();
    
    const res = await fetch(
      `${API_BASE_URL}/api/comments/${postId}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      },
    );

    let data;
    const responseText = await res.text();

    try {
      data = JSON.parse(responseText);
    } catch (e) {
      // If response is not JSON (e.g. empty or html error)
      if (!res.ok) {
        return NextResponse.json(
          { message: responseText || `Request failed with status ${res.status}` },
          { status: res.status }
        );
      }
      // If success but not JSON, this is unexpected for this API, but return text
      // or try to handle it. Assuming success response MUST be JSON for now.
      console.error("Non-JSON success response:", responseText);
      return NextResponse.json(
        { message: "Invalid response from server" },
        { status: 500 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Create Comment API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
