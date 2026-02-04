import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ adId: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const { adId } = await params;

  try {
    const res = await fetch(`${API_BASE_URL}/api/ads/${adId}`, {
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
    console.error("Get Ad API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ adId: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const { adId } = await params;

  try {
    const body = await request.json();
    const res = await fetch(`${API_BASE_URL}/api/ads/${adId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Update Ad API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ adId: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const { adId } = await params;

  try {
    const res = await fetch(`${API_BASE_URL}/api/ads/${adId}`, {
      method: "DELETE",
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
    console.error("Delete Ad API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
