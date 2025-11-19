"use client";

import { useEffect } from "react";
import { usePostsStore } from "@/features/posts/stores";
import { FeedPost, PostProps } from "@/types/post";

interface PostsInitializerProps {
	posts: Partial<FeedPost>[];
	children: React.ReactNode;
}

export function PostsInitializer({ posts, children }: PostsInitializerProps) {
	const setPosts = usePostsStore((state) => state.setPosts);

	useEffect(() => {
		setPosts(posts! as FeedPost[]);
	}, [posts, setPosts]);

	return <>{children}</>;
}

