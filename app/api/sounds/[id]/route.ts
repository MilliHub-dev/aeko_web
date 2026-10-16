import { proxyToBackend } from "@/lib/backend-proxy";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyToBackend(`/api/sounds/${encodeURIComponent(id)}`);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyToBackend(`/api/sounds/${encodeURIComponent(id)}`, { method: "DELETE" });
}
