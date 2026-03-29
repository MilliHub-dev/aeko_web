import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const emailInput = typeof body?.email === "string" ? body.email.trim() : "";
    const email = emailInput.toLowerCase();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Name and email are required" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const upstreamResponse = await fetch(`${API_BASE_URL}/api/waitlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
      cache: "no-store",
    });

    const text = await upstreamResponse.text();
    let data: unknown = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    if (!upstreamResponse.ok) {
      const fallbackMessage =
        upstreamResponse.status === 409
          ? "This email is already on the waitlist"
          : upstreamResponse.status === 503
            ? "Waitlist service is currently unavailable"
            : "Failed to join waitlist";

      return NextResponse.json(
        typeof data === "object" && data !== null
          ? data
          : { success: false, message: fallbackMessage },
        { status: upstreamResponse.status }
      );
    }

    return NextResponse.json(
      typeof data === "object" && data !== null
        ? data
        : {
            success: true,
            message: "Joined waitlist successfully",
          },
      { status: upstreamResponse.status || 201 }
    );
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Waitlist service is currently unavailable",
      },
      { status: 503 }
    );
  }
}
