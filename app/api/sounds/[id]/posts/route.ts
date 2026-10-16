import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/backend-proxy";

export const dynamic = "force-dynamic";

/** Public posts using a sound, newest first. */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyToBackend(`/api/sounds/${encodeURIComponent(id)}/posts${request.nextUrl.search}`);
}
