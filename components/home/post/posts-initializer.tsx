"use client";

import { useEffect } from "react";
import { usePostsStore } from "@/features/posts/stores";
import { PostProps } from "@/types/post";

interface PostsInitializerProps {
	posts: PostProps[];
	children: React.ReactNode;
}

export function PostsInitializer({
	posts,
	children
}: PostsInitializerProps) {
	const setPosts = usePostsStore((state) => state.setPosts);

	useEffect(() => {
		setPosts(posts);
	}, [posts, setPosts]);

	return <>{children}</>;
}

