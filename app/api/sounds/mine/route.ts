import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/backend-proxy";

export const dynamic = "force-dynamic";

/** Sounds the signed-in user uploaded or extracted from their videos. */
export async function GET(request: NextRequest) {
  return proxyToBackend(`/api/sounds/mine${request.nextUrl.search}`);
}
