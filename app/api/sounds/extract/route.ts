import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/backend-proxy";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/** POST { postId, title? } — make the audio of your own video post a sound. */
export async function POST(request: NextRequest) {
  const body = await request.text();
  return proxyToBackend("/api/sounds/extract", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
  });
}
