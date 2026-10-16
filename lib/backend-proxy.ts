import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

/**
 * Forwards a request to the Aeko backend with the session token and returns
 * its JSON response with the same status. Route handlers under app/api that
 * only relay to the backend use this instead of repeating the fetch/parse
 * boilerplate.
 */
export async function proxyToBackend(
  path: string,
  init: { method?: string; body?: BodyInit | null; headers?: Record<string, string> } = {},
): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: init.method ?? "GET",
      headers: { Authorization: `Bearer ${token}`, ...(init.headers ?? {}) },
      body: init.body ?? undefined,
      cache: "no-store",
    });
    const text = await res.text();
    let data: unknown;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { success: false, message: text || `Request failed with status ${res.status}` };
    }
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error(`Backend proxy error for ${path}:`, error);
    return NextResponse.json(
      { success: false, message: "The server could not be reached. Try again shortly." },
      { status: 502 },
    );
  }
}
