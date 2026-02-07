import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

// Helper to normalize post data and handle JSON media fields
const normalizePost = (post: any) => {
  let mediaUrl = post.mediaUrl;
  let mediaUrls = post.mediaUrls || [];

  // Logic to extract media from JSON string or object
  if (!mediaUrl && post.media) {
    let parsed = post.media;

    // If it's a string that looks like JSON, parse it
    if (typeof post.media === 'string' && (post.media.trim().startsWith('[') || post.media.trim().startsWith('{'))) {
      try {
        parsed = JSON.parse(post.media);
      } catch (e) {
        // If parsing fails, use original string
        parsed = post.media;
      }
    }

    // Process parsed data (could be array, object, or string)
    if (Array.isArray(parsed) && parsed.length > 0) {
      mediaUrls = parsed.map((item: any) => typeof item === 'object' ? (item.url || item.mediaUrl || '') : item);
      const first = parsed[0];
      mediaUrl = typeof first === 'object' ? (first.url || first.mediaUrl) : first;
    } else if (typeof parsed === 'object' && parsed !== null) {
      mediaUrl = parsed.url || parsed.mediaUrl;
    } else if (typeof parsed === 'string') {
      mediaUrl = parsed;
    }
  }
  
  if (!mediaUrl) mediaUrl = post.url;

  return {
    ...post,
    _id: post._id || post.id,
    media: mediaUrls.length > 0 ? mediaUrls : mediaUrl,
    mediaUrl: mediaUrl,
    mediaUrls: mediaUrls,
    user: post.user ? {
      ...post.user,
      _id: post.user._id || post.user.id || post.userId
    } : post.user
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const { postId } = await params;

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/posts/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${token?.value}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    
    // Normalize single post data
    if (data.post || data.data) {
      const post = data.post || data.data;
      const normalizedPost = normalizePost(post);
      
      // Keep the original structure (e.g. { post: ... }) but update the post object
      if (data.post) data.post = normalizedPost;
      else if (data.data) data.data = normalizedPost;
    } else if (data._id || data.id) {
       // If data is the post itself
       const normalizedPost = normalizePost(data);
      return NextResponse.json(normalizedPost);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get Post API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const { postId } = await params;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const res = await fetch(
      `${API_BASE_URL}/api/posts/${postId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Edit Post API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const { postId } = await params;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/posts/${postId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
        },
      },
    );

    const responseText = await res.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Delete Post API error: Backend returned non-JSON response", responseText);
      return NextResponse.json(
        { success: false, message: `Backend error: ${res.status} ${res.statusText}` },
        { status: res.status || 500 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Delete Post API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
