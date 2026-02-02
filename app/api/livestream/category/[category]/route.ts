import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const { category } = await params;
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.toString();

  try {
    const res = await fetch(`${API_BASE_URL}/api/livestream/category/${category}?${query}`, {
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
    console.error("Category Livestreams API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
