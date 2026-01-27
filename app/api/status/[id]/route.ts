import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type { StatusResponse } from "@/types/status";

/**
 * DELETE /api/status/{id}
 * Proxies the request to the external backend (`https://dev.aeko.social/api/status/{id}`)
 * and forwards the response, preserving the external status code and payload.
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    const { id } = params;

    const externalRes = await fetch(`https://dev.aeko.social/api/status/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token?.value ?? ""}`,
        "Content-Type": "application/json",
      },
    });

    const data = await externalRes.json();

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
