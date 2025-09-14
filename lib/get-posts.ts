import { PostProps } from "../types/post";
import { posts } from "@/lib/mock-data";

export async function getPosts(): Promise<PostProps[]> {
	await new Promise((resolve) =>
		setTimeout(resolve, 1000)
	);
	return posts;
}

export async function getPost(
	handle: string,
	postId: string
): Promise<PostProps> {
	await new Promise((resolve) =>
		setTimeout(resolve, 1000)
	);

	const post = posts.find(
		(post) =>
			post.handle === handle && post.id === postId
	);

	if (!post) {
		throw new Error("No Post Found!");
	}

	return post;
}
