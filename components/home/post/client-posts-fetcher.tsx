"use client";

import { useEffect } from "react";
import { usePostsStore } from "@/features/posts/stores";
import { FeedPost } from "@/types/post";

export function ClientPostsFetcher() {
  const shouldRefetch = usePostsStore((state) => state.shouldRefetch);
  const setIsFetching = usePostsStore((state) => state.setIsFetching);
  const setPosts = usePostsStore((state) => state.setPosts);
  const isFetching = usePostsStore((state) => state.isFetching);
  const markAttempt = usePostsStore((state) => state.markAttempt);

  useEffect(() => {
    // Check if we need to refetch
    if (!shouldRefetch() || isFetching) {
      return;
    }

    // Set fetching state and mark attempt
    setIsFetching(true);
    markAttempt();

    // Fetch posts from API
    async function fetchPosts() {
      try {
        const response = await fetch("/api/posts/feed");

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            window.location.href = "/login";
            return;
          }
          if (response.status === 429) {
            console.warn("Rate limited fetching posts, backing off");
            // Do nothing, shouldRefetch will prevent immediate retry due to markAttempt
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
      } finally {
        setIsFetching(false);
      }
    }

    fetchPosts();
  }, [shouldRefetch, setIsFetching, setPosts, isFetching, markAttempt]);

  return null;
}
