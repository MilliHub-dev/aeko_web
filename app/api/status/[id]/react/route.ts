import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type { StatusReactionResponse, ReactToStatusRequest } from "@/types/status";
import { API_BASE_URL } from "@/lib/config";

/**
 * POST /api/status/{id}/react
 * Proxies the reaction request to the external backend.
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    const statusId = params.id;
    const body: ReactToStatusRequest = await request.json();

    // Basic validation – the external service will also validate.
    if (!body.emoji) {
      return NextResponse.json(
        {
          success: false,
          message: "Emoji is required",
        } as StatusReactionResponse,
        { status: 400 },
      );
    }

    const externalRes = await fetch(`${API_BASE_URL}/api/status/${statusId}/react`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token?.value ?? ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await externalRes.json();

    // Forward the external status code and payload.
    return NextResponse.json(data as StatusReactionResponse, {
      status: externalRes.status as number,
    });
  } catch (error) {
    console.error("Error proxying POST /api/status/{id}/react:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add reaction",
      } as StatusReactionResponse,
      { status: 500 },
    );
  }
}
