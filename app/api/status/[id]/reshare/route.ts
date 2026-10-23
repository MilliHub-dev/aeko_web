import { proxyToBackend } from "@/lib/backend-proxy";

export const dynamic = "force-dynamic";

/** Reshare a story to your own story (backend POST /api/status/:id/reshare). */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyToBackend(`/api/status/${encodeURIComponent(id)}/reshare`, { method: "POST" });
}
