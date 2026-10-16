import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/backend-proxy";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/** GET /api/sounds?q=&category=&sort=&page=&limit= — browse the music library. */
export async function GET(request: NextRequest) {
  return proxyToBackend(`/api/sounds${request.nextUrl.search}`);
}

/** POST /api/sounds — multipart upload of an audio file as a reusable sound. */
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  return proxyToBackend("/api/sounds", { method: "POST", body: formData });
}
