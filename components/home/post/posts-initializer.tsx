"use client";

import { useEffect } from "react";
import { usePostsStore } from "@/features/posts/stores";
import { FeedPost } from "@/types/post";

interface PostsInitializerProps {
  posts: Partial<FeedPost>[];
  children: React.ReactNode;
}

export function PostsInitializer({ posts, children }: PostsInitializerProps) {
  const { setPosts, shouldRefetch, posts: cachedPosts } = usePostsStore();

  useEffect(() => {
    // Only set posts if we should refetch or if posts were actually fetched
    // This prevents overwriting cache with empty data on navigation
    if (posts && posts.length > 0) {
      setPosts(posts! as FeedPost[]);
    }
    // If no posts provided but cache should be used, do nothing
    // The cached posts will be displayed from the store
  }, [posts, setPosts]);

  return <>{children}</>;
}
