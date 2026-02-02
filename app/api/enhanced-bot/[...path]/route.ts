import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

async function proxyRequest(
  request: NextRequest,
  params: Promise<{ path: string[] }>
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const { path } = await params;
  
  // Construct the target URL
  const pathString = path.join("/");
  const queryString = request.nextUrl.search;
  const targetUrl = `${API_BASE_URL}/api/enhanced-bot/${pathString}${queryString}`;

  console.log(`[Proxy] ${request.method} ${targetUrl}`);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token?.value) {
    headers["Authorization"] = `Bearer ${token.value}`;
  }

  try {
    const fetchOptions: RequestInit = {
      method: request.method,
      headers,
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
        const body = await request.json().catch(() => ({}));
        fetchOptions.body = JSON.stringify(body);
    }

    const res = await fetch(targetUrl, fetchOptions);
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Enhanced Bot Proxy Error (${pathString}):`, error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, params);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, params);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, params);
}
