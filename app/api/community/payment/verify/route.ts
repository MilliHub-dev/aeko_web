import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json(
      { success: false, message: "Payment reference is required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/community/payment/verify?reference=${reference}`, {
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
    console.error("Verify Community Payment API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
