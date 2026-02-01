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
    const contentType = request.headers.get("content-type") || "";
    
    let body;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token.value}`,
    };

    if (contentType.includes("multipart/form-data")) {
        body = await request.blob();
        headers["Content-Type"] = contentType;
    } else {
        return NextResponse.json({ message: "Content-Type must be multipart/form-data" }, { status: 400 });
    }

    // Assuming the backend endpoint is /api/users/cover-picture
    const res = await fetch(`${API_BASE_URL}/api/users/cover-picture`, {
      method: "PUT",
      headers,
      body,
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
    console.error("Cover Picture Upload Proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
