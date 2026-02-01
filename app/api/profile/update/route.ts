import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function PUT(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const res = await fetch(`${API_BASE_URL}/api/profile/update`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    let data;
    const responseText = await res.text();
    try {
        data = JSON.parse(responseText);
    } catch (e) {
        if (!res.ok) {
             return NextResponse.json(
                { message: responseText || `Request failed with status ${res.status}` },
                { status: res.status }
             );
        }
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
    console.error("Profile Update Proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
