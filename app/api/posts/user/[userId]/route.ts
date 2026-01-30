import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/api/posts/user/${userId}`, {
      headers,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[User Posts Proxy] Backend API error for URL ${res.url} (status: ${res.status}):`, errorText.substring(0, 500));
      return NextResponse.json(
        { error: `Backend API error: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    
    // Normalize data structure
    const rawPosts = Array.isArray(data) ? data : (data.posts || data.data || []);
    
    // Map backend ID fields to client expected format (_id)
    const posts = rawPosts.map((post: any) => {
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
      
      // Fallback to post.url if still nothing
      if (!mediaUrl) mediaUrl = post.url;

      return {
        ...post,
        _id: post._id || post.id,
        media: mediaUrl,
        mediaUrl: mediaUrl,
        mediaUrls: mediaUrls,
        user: post.user ? {
          ...post.user,
          _id: post.user._id || post.user.id || post.userId
        } : post.user
      };
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
