import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ communityId: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const { communityId } = await params;

  // Get pagination query params
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  try {
    const res = await fetch(`${API_BASE_URL}/api/community/payment/${communityId}/transactions?page=${page}&limit=${limit}`, {
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
    console.error("Get Community Transactions API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
