import { Comment } from "@/types/comment";
import { posts } from "./mock-data";

export const getPostComments = (
	postId: string
): Comment[] => {
	const postComments = posts.find(
		(post) => post.id === postId
	)?.comments as Comment[];

	return postComments;
};
