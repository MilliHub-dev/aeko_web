import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type { StatusListResponse, StatusResponse, CreateStatusRequest } from "@/types/status";

/**
 * GET /api/status
 * Proxies the request to the external backend (`https://dev.aeko.social/api/status`).
 * The external service returns data in the shape of `StatusListResponse`.
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    const externalRes = await fetch("https://dev.aeko.social/api/status", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token?.value ?? ""}`,
        "Content-Type": "application/json",
      },
    });

    const data = await externalRes.json();

    if (!externalRes.ok) {
      // Forward the external status code and error payload.
      return NextResponse.json(data, {
        status: externalRes.status as number,
      });
    }

    // Cast to the internal type for static checking.
    const response: StatusListResponse = data as StatusListResponse;
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error proxying GET /api/status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch statuses",
      } as StatusListResponse,
      { status: 500 },
    );
  }
}

/**
 * POST /api/status
 * Forwards the request body to the external backend to create a new status.
 * The external service returns data in the shape of `StatusResponse`.
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    const body: CreateStatusRequest = await request.json();

    const externalRes = await fetch("https://dev.aeko.social/api/status", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token?.value ?? ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await externalRes.json();

    if (!externalRes.ok) {
      return NextResponse.json(data, {
        status: externalRes.status as number,
      });
    }

    const response: StatusResponse = data as StatusResponse;
    // The external API already decides the appropriate status code,
    // but we follow the convention of returning 201 on success.
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error proxying POST /api/status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create status",
      } as StatusResponse,
      { status: 500 },
    );
  }
}
