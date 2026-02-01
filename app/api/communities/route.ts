import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  // Get search query from URL
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || searchParams.get("search") || "";

  try {
    const url = new URL(`${API_BASE_URL}/api/communities`);
    if (query) {
      url.searchParams.set("search", query);
    }

    const res = await fetch(url.toString(), {
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
    console.error("Communities API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  try {
    const body = await request.json();
    const res = await fetch(`${API_BASE_URL}/api/communities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Create Community API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
