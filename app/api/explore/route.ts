import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  // Get pagination parameters from query string
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";

  try {
    const url = new URL(`${API_BASE_URL}/api/explore`);
    url.searchParams.set("page", page);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // Map fields if data contains posts array
    if (data.posts && Array.isArray(data.posts)) {
      data.posts = data.posts.map((post: any) => {
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
    } else if (Array.isArray(data)) {
        // If data is the array itself
        const mappedData = data.map((post: any) => {
          let mediaUrl = post.mediaUrl;
          let mediaUrls = post.mediaUrls || [];

          // Logic to extract media from JSON string if needed (legacy format support)
          if (!mediaUrl && post.media) {
            if (typeof post.media === 'string' && (post.media.trim().startsWith('[') || post.media.trim().startsWith('{'))) {
               try {
                 const parsed = JSON.parse(post.media);
                 if (Array.isArray(parsed) && parsed.length > 0) {
                   mediaUrls = parsed;
                   mediaUrl = parsed[0];
                 } else if (typeof parsed === 'object' && parsed !== null) {
                   mediaUrl = parsed.url || parsed.mediaUrl;
                 }
               } catch (e) {
                 mediaUrl = post.media;
               }
            } else {
               mediaUrl = post.media;
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
          return NextResponse.json(mappedData);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Explore API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
