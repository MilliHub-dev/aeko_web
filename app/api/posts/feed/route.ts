import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let res = await fetch(`${API_BASE_URL}/api/posts/feed`, {
      headers,
    });

    // Fallback to explore feed if home feed fails (e.g. 500 or 404)
    if (!res.ok && (res.status === 500 || res.status === 404)) {
      console.warn(`Home feed failed (${res.status}), falling back to explore feed`);
      res = await fetch(`${API_BASE_URL}/api/explore`, {
        headers,
      });
    }

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[Feed Proxy] Backend API error for URL ${res.url} (status: ${res.status}):`, errorText.substring(0, 500));
      
      // Graceful fallback: return empty posts instead of error
      // This prevents the frontend from throwing 500 errors when backend is unstable
      return NextResponse.json({ posts: [] });
    }

    const data = await res.json();
    
    // Ensure we're returning the correct shape
    // If the backend returns { posts: [...] }, use that.
    // If it returns an array [...], wrap it.
    // Adjust based on inspection of 'data' variable if needed.
    const rawPosts = Array.isArray(data) ? data : (data.posts || data.data || []);

    // DEBUG: Log first post to inspect structure
    if (rawPosts.length > 0) {
      const first = rawPosts[0];
      console.log("[Feed Proxy] First raw post:", {
        id: first.id || first._id,
        media: first.media,
        mediaUrl: first.mediaUrl,
        mediaUrls: first.mediaUrls,
        url: first.url,
        keys: Object.keys(first)
      });
    }
    
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
                media: mediaUrls.length > 0 ? mediaUrls : mediaUrl,
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
    console.error("Error fetching feed:", error);
    // Graceful fallback on network/server error
    return NextResponse.json({ posts: [] });
  }
}
