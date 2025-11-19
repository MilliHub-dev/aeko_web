import { FeedPost } from "../types/post";
import { posts as mockPosts } from "@/lib/mock-data";

export async function getPosts(): Promise<Array<Partial<FeedPost>>> {
	const isServer = typeof window === "undefined";

	// On the server, build an absolute URL. Set NEXT_PUBLIC_BASE_URL in .env.local to your app origin (e.g. http://localhost:3000)
	const base =
		process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
	const url = isServer ? new URL("/api/posts/feed", base).toString() : "/api/posts/feed";

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();

	// Be tolerant to different response shapes: { posts }, { data }, or raw array
	return data.posts ?? data.data ?? data;
}

export async function getPost(handle: string, postId: string): Promise<FeedPost> {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	const post = mockPosts.find((post) => post.handle === handle && post._id === postId);

	if (!post) {
		throw new Error("No Post Found!");
	}

	return post;
}
