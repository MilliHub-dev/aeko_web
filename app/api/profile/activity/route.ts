import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "20";

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token?.value) {
      headers["Authorization"] = `Bearer ${token.value}`;
    }

    const res = await fetch(`${API_BASE_URL}/api/profile/activity?page=${page}&limit=${limit}`, {
      headers,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[Profile Activity Proxy] Backend API error (status: ${res.status}):`, errorText.substring(0, 500));
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(errorData, { status: res.status });
      } catch {
        return NextResponse.json(
          { error: `Backend API error: ${res.statusText}` },
          { status: res.status }
        );
      }
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
