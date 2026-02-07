import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token.value}`,
      "Content-Type": "application/json",
    };

    // Forward x-2fa-token if present in the incoming request
    const twoFaToken = request.headers.get("x-2fa-token");
    if (twoFaToken) {
      headers["x-2fa-token"] = twoFaToken;
    }

    const res = await fetch(`${API_BASE_URL}/subscription/initialize`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Initialize Payment Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
