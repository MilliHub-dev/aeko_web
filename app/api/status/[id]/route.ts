import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type { StatusResponse } from "@/types/status";
import { API_BASE_URL } from "@/lib/config";

/**
 * DELETE /api/status/{id}
 * Proxies the request to the external backend (`${API_BASE_URL}/api/status/{id}`)
 * and forwards the response, preserving the external status code and payload.
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    const { id } = await params;

    const externalRes = await fetch(`${API_BASE_URL}/api/status/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token?.value ?? ""}`,
        "Content-Type": "application/json",
      },
    });

    const responseText = await externalRes.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Delete Status API error: Backend returned non-JSON response", responseText);
      return NextResponse.json(
        { success: false, message: `Backend error: ${externalRes.status} ${externalRes.statusText}` },
        { status: externalRes.status || 500 }
      );
    }

    // Forward external status code and payload directly.
    return NextResponse.json(data as StatusResponse, { status: externalRes.status as number });
  } catch (error) {
    console.error("Error proxying DELETE /api/status/{id}:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete status",
      } as StatusResponse,
      { status: 500 },
    );
  }
}
