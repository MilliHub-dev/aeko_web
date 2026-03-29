import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  try {
    const body = await request.json();
    
    // Function to try a specific endpoint
    const tryEndpoint = async (endpoint: string) => {
      const targetUrl = `${API_BASE_URL}${endpoint}`;
      console.log(`Attempting to create livestream at: ${targetUrl}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      try {
        const res = await fetch(targetUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token?.value}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return res;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    };

    let res;
    let usedEndpoint = "/api/livestream/create";

    try {
      res = await tryEndpoint("/api/livestream/create");
      
      // If 404, try plural convention
      if (res.status === 404) {
        console.log("Endpoint /api/livestream/create returned 404, trying /api/livestreams");
        res = await tryEndpoint("/api/livestreams");
        usedEndpoint = "/api/livestreams";
      }
    } catch (error) {
       console.error("Fetch failed:", error);
       // If it's a timeout or connection error, return 504
       return NextResponse.json(
         { success: false, message: "Backend connection failed or timed out" },
         { status: 504 }
       );
    }

    console.log(`Backend response status (${usedEndpoint}):`, res.status);
    const responseText = await res.text();
    console.log("Backend response body:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse backend response as JSON:", e);
      return NextResponse.json(
        { success: false, message: "Invalid response from server" },
        { status: 502 }
      );
    }

    if (!res.ok) {
      console.error("Create Livestream API error:", res.status, data);
      return NextResponse.json(data, { status: res.status });
    }

    const streamId =
      data?.data?.stream?._id ||
      data?.data?.stream?.id ||
      data?.data?._id ||
      data?.data?.streamId ||
      data?.livestream?._id ||
      data?._id;

    if (!data || !streamId) {
      console.error("Invalid response structure (missing stream identifier):", data);
      return NextResponse.json(
        { success: false, message: "Server returned empty or invalid data" },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Create Livestream API error (catch):", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
