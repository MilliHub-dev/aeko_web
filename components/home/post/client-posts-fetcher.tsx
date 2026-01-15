"use client";

import { useEffect } from "react";
import { usePostsStore } from "@/features/posts/stores";
import { FeedPost } from "@/types/post";

export function ClientPostsFetcher() {
  const { shouldRefetch, setIsFetching, setPosts, isFetching } =
    usePostsStore();

  useEffect(() => {
    // Check if we need to refetch
    if (!shouldRefetch() || isFetching) {
      return;
    }

    // Set fetching state
    setIsFetching(true);

    // Fetch posts from API
    async function fetchPosts() {
      try {
        const response = await fetch("/api/posts/feed");

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            window.location.href = "/login";
            return;
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const posts = data.posts ?? data.data ?? data;

        if (Array.isArray(posts)) {
          setPosts(posts as FeedPost[]);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setIsFetching(false);
      }
    }

    fetchPosts();
  }, [shouldRefetch, setIsFetching, setPosts, isFetching]);

  return null;
}
