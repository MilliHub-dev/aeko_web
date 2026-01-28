import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { InterestsResponse } from "@/types/interest";

const BASE_URL = "https://dev.aeko.social/api";

export async function GET() {
  try {
    const response = await fetch(`${BASE_URL}/interests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch interests from backend:", response.status, errorText);
      return NextResponse.json(
        { success: false, error: "Failed to fetch interests" },
        { status: response.status }
      );
    }

    const data: InterestsResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching interests:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.log("DEBUG: No token found in cookies");
      return NextResponse.json(
        { success: false, error: "Unauthorized - No Token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { interestIds } = body;

    if (!interestIds || !Array.isArray(interestIds)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request: interestIds must be an array",
        },
        { status: 400 }
      );
    }

    console.log("DEBUG: Sending request to backend with token:", token.substring(0, 10) + "...");

    const response = await fetch(`${BASE_URL}/user/interests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ interestIds }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || "Failed to save interests" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error saving interests:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
