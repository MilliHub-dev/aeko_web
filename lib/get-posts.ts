import { FeedPost } from "../types/post";
import { redirect } from "next/navigation";
import { API_BASE_URL } from "./config";

export async function getPosts(): Promise<Array<Partial<FeedPost>>> {
  const isServer = typeof window === "undefined";

  if (isServer) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    const response = await fetch(`${API_BASE_URL}/api/posts/feed`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        redirect("/login");
      }
      // For other errors, we might want to return empty array or throw
      console.error(`Failed to fetch posts: ${response.status}`);
      return [];
    }

    const data = await response.json();
    // Be tolerant to different response shapes: { posts }, { data }, or raw array
    const rawPosts = data.posts ?? data.data ?? data;

    if (!Array.isArray(rawPosts)) {
      console.error("getPosts expected an array but got:", rawPosts);
      return [];
    }

    // Map posts to ensure media fields are correctly parsed (consistent with /api/posts/feed proxy)
    const posts = rawPosts.map((post: any) => {
      let mediaUrl = post.mediaUrl;
      let mediaUrls = post.mediaUrls || [];

      if (!mediaUrl && post.media) {
        let parsed = post.media;

        if (typeof post.media === 'string' && (post.media.trim().startsWith('[') || post.media.trim().startsWith('{'))) {
           try {
             parsed = JSON.parse(post.media);
           } catch (e) {
             parsed = post.media;
           }
        }

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
        media: mediaUrls.length > 0 ? mediaUrls : mediaUrl, // Prefer array if available
        mediaUrl: mediaUrl,
        mediaUrls: mediaUrls,
        user: post.user ? {
          ...post.user,
          _id: post.user._id || post.user.id || post.userId
        } : post.user
      };
    });

    return posts;
  }

  // Client-side fallback (or if for some reason we want to go through our own API route)
  const response = await fetch("/api/posts/feed");
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      redirect("/login");
    }
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  const posts = data.posts ?? data.data ?? data;

  if (!Array.isArray(posts)) {
    console.error("getPosts expected an array but got:", posts);
    return [];
  }

  return posts;
}

export async function getPost(
  handle: string,
  postId: string
): Promise<FeedPost | null> {
  const isServer = typeof window === "undefined";

  if (isServer) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token?.value}`,
          },
          cache: "no-store", // Ensure fresh data
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // If unauthorized, we might want to redirect or return null
          // redirect("/login"); // Optional: decide if we want to redirect here
          return null;
        }
        if (response.status === 404) {
          return null;
        }
        console.error(`Failed to fetch post: ${response.status}`);
        return null;
      }

      const data = await response.json();
      // The API might return { post: ... } or just the post object
      const rawPost = data.post ?? data.data ?? data;

      if (!rawPost) return null;

      // Apply same media parsing logic
      let mediaUrl = rawPost.mediaUrl;
      let mediaUrls = rawPost.mediaUrls || [];

      if (!mediaUrl && rawPost.media) {
        let parsed = rawPost.media;

        if (typeof rawPost.media === 'string' && (rawPost.media.trim().startsWith('[') || rawPost.media.trim().startsWith('{'))) {
           try {
             parsed = JSON.parse(rawPost.media);
           } catch (e) {
             parsed = rawPost.media;
           }
        }

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

      if (!mediaUrl) mediaUrl = rawPost.url;

      return {
        ...rawPost,
        _id: rawPost._id || rawPost.id,
        media: mediaUrls.length > 0 ? mediaUrls : mediaUrl,
        mediaUrl: mediaUrl,
        mediaUrls: mediaUrls,
        user: rawPost.user ? {
          ...rawPost.user,
          _id: rawPost.user._id || rawPost.user.id || rawPost.userId
        } : rawPost.user
      };
    } catch (error) {
      console.error("Error fetching post:", error);
      return null;
    }
  }

  // Client-side fallback
  try {
    const response = await fetch(`/api/posts/${postId}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.post ?? data.data ?? data;
  } catch (error) {
    console.error("Error fetching post client-side:", error);
    return null;
  }
}
