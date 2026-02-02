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
  // path is an array like ['conversations'] or ['messages', '123']
  const pathString = path.join("/");
  const queryString = request.nextUrl.search;
  const targetUrl = `${API_BASE_URL}/api/enhanced-chat/${pathString}${queryString}`;

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
      // For uploads (multipart/form-data), we shouldn't set Content-Type to application/json
      // But usually proxies need to be careful with body.
      // If the content-type is multipart, we should let fetch handle the boundary.
      
      const contentType = request.headers.get("content-type");
      if (contentType && contentType.includes("multipart/form-data")) {
        // If it's a file upload, we need to pass the form data
        // Fetch API automatically sets Content-Type with boundary for FormData
        const formData = await request.formData();
        fetchOptions.body = formData;
        // Remove Content-Type header to let browser/fetch set it with boundary
        delete (headers as any)["Content-Type"];
      } else {
        // Assume JSON for everything else as per user requirements
        const body = await request.json().catch(() => ({}));
        fetchOptions.body = JSON.stringify(body);
      }
    }

    const res = await fetch(targetUrl, fetchOptions);

    // Handle non-JSON responses (like files)
    const resContentType = res.headers.get("content-type");
    if (resContentType && !resContentType.includes("application/json")) {
       const blob = await res.blob();
       return new NextResponse(blob, {
         status: res.status,
         headers: {
           "Content-Type": resContentType,
         }
       });
    }

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Enhanced Chat Proxy Error (${pathString}):`, error);
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
