import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/config";
import { revalidatePath } from "next/cache";

export const maxDuration = 300; // Increase timeout for uploads to 5 minutes
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    const isMultipart = contentType.includes("multipart/form-data");
    if (!isMultipart) {
      return NextResponse.json({ message: "Invalid content type" }, { status: 400 });
    }

    // Rebuild multipart payload instead of forwarding the raw request stream.
    // This avoids boundary/body mismatches that can show up on mobile uploads.
    const formData = await request.formData();

    const res = await fetch(`${API_BASE_URL}/api/posts/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: formData,
    });

    // Handle non-JSON responses
    let data;
    const responseText = await res.text();
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Backend returned non-JSON:", responseText);
      if (!res.ok) {
        return NextResponse.json(
          { message: responseText || `Request failed with status ${res.status}` },
          { status: res.status }
        );
      }
      return NextResponse.json(
        { message: "Invalid response from backend" },
        { status: 502 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // Revalidate the feed
    revalidatePath("/home");
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Create Post Proxy Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
