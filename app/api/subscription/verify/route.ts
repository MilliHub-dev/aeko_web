import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get("reference");
  const paymentMethod = searchParams.get("paymentMethod");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const query = new URLSearchParams();
    if (reference) query.append("reference", reference);
    if (paymentMethod) query.append("paymentMethod", paymentMethod);

    const res = await fetch(`${API_BASE_URL}/subscription/verify?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
