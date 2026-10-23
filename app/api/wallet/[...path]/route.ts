import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/backend-proxy";

export const dynamic = "force-dynamic";

/**
 * Relay for every wallet endpoint (summary, transactions, transfer, withdraw,
 * airdrop, networks, list, create, PATCH /:address). The `x-aeko-network`
 * header picks testnet or mainnet and is passed through untouched.
 */
async function relay(request: NextRequest, params: Promise<{ path: string[] }>): Promise<NextResponse> {
  const { path } = await params;
  const target = `/api/wallet/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;
  const headers: Record<string, string> = {};
  const network = request.headers.get("x-aeko-network");
  if (network) headers["x-aeko-network"] = network;

  if (request.method === "GET" || request.method === "DELETE") {
    return proxyToBackend(target, { method: request.method, headers });
  }
  const body = await request.text();
  return proxyToBackend(target, {
    method: request.method,
    body,
    headers: { ...headers, "Content-Type": request.headers.get("content-type") ?? "application/json" },
  });
}

export async function GET(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return relay(request, ctx.params);
}
export async function POST(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return relay(request, ctx.params);
}
export async function PATCH(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return relay(request, ctx.params);
}
export async function DELETE(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return relay(request, ctx.params);
}
