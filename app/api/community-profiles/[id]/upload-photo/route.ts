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

    const tryEndpoint = async (endpoint: string) => {
      return fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token?.value}`,
        },
        body: formData,
      });
    };

    let res = await tryEndpoint(`/api/community-profiles/${id}/upload-photo`);
    if (res.status === 404) {
      res = await tryEndpoint(`/api/communities/${id}/upload-photo`);
    }

    const responseText = await res.text();
    let data: any = null;
    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch {
      data = { success: res.ok, message: responseText };
    }

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
