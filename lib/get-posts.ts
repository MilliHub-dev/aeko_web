import { FeedPost } from "../types/post";
import { posts as mockPosts } from "@/lib/mock-data";
import { redirect } from "next/navigation";

export async function getPosts(): Promise<Array<Partial<FeedPost>>> {
  const isServer = typeof window === "undefined";

  if (isServer) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    const response = await fetch("https://dev.aeko.social/api/posts/feed", {
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
    const posts = data.posts ?? data.data ?? data;

    if (!Array.isArray(posts)) {
      console.error("getPosts expected an array but got:", posts);
      return [];
    }
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
        `https://dev.aeko.social/api/posts/${postId}`,
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
      const post = data.post ?? data.data ?? data;

      return post;
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
