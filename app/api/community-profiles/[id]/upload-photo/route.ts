import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const { id } = await params;

  try {
    const formData = await request.formData();
    
    // We need to forward the FormData to the backend
    // Note: When using FormData with fetch, do NOT set Content-Type header manually
    // The browser/fetch will set it with the boundary
    
    const res = await fetch(`${API_BASE_URL}/api/community-profiles/${id}/upload-photo`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Upload Community Photo API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
