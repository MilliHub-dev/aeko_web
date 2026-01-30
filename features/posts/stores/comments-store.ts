import { create } from "zustand";
import { Comment } from "@/types/comment";

interface CommentsState {
	comments: Record<string, Comment[]>; // postId -> comments
	isLoading: Record<string, boolean>;

	getComments: (postId: string) => Comment[];
	fetchComments: (postId: string) => Promise<void>;
	addComment: (postId: string, comment: Comment) => void;
	addReply: (postId: string, parentId: string, reply: Comment) => void;
	toggleLike: (postId: string, commentId: string) => Promise<void>;
	setComments: (postId: string, comments: Comment[]) => void;
	setLoading: (postId: string, loading: boolean) => void;
	clearComments: (postId: string) => void;
}

export const useCommentsStore = create<CommentsState>((set, get) => ({
	comments: {},
	isLoading: {},

	getComments: (postId) => get().comments[postId] || [],

	fetchComments: async (postId) => {
		set((state) => ({
			isLoading: { ...state.isLoading, [postId]: true },
		}));
		try {
			const res = await fetch(`/api/comments/${postId}`);
			
			if (!res.ok) {
				// Fallback: Try fetching the post details if specific comments endpoint fails
				// This handles cases where backend might not have a dedicated comments endpoint
				// but returns comments within the post object.
				try {
					const postRes = await fetch(`/api/posts/${postId}`);
					if (postRes.ok) {
						const postData = await postRes.json();
						const post = postData.post || postData.data || postData;
						
						if (post && Array.isArray(post.comments)) {
							set((state) => ({
								comments: { ...state.comments, [postId]: post.comments },
							}));
							return;
						}
					}
				} catch (fallbackError) {
					console.warn("Fallback fetch failed:", fallbackError);
				}
				
				// If we got here and still haven't returned, we probably couldn't find comments.
				// However, if the status was 404, it might just mean no comments found or endpoint missing.
				// We shouldn't throw an error to the UI if we can just assume empty comments.
				if (res.status === 404) {
					console.warn(`Comments endpoint 404 for post ${postId}, assuming empty comments.`);
					set((state) => ({
						comments: { ...state.comments, [postId]: [] },
					}));
					return;
				}
				
				throw new Error(`Failed to fetch comments: ${res.status}`);
			}

			// If response is empty or 204 No Content
			if (res.status === 204) {
				set((state) => ({
					comments: { ...state.comments, [postId]: [] },
				}));
				return;
			}

			const data = await res.json();
			// Assuming API returns { comments: Comment[] }, { data: Comment[] } or just Comment[]
			const comments = Array.isArray(data) 
				? data 
				: (data.comments || data.data || []);
			set((state) => ({
				comments: { ...state.comments, [postId]: comments },
			}));
		} catch (error) {
			console.error(error);
		} finally {
			set((state) => ({
				isLoading: { ...state.isLoading, [postId]: false },
			}));
		}
	},

	addComment: (postId, comment) => {
		set((state) => ({
			comments: {
				...state.comments,
				[postId]: [...(state.comments[postId] || []), comment],
			},
		}));
	},

	addReply: (postId, parentId, reply) => {
		set((state) => {
			const postComments = state.comments[postId] || [];
			
			const updateComments = (comments: Comment[]): Comment[] => {
				return comments.map((c) => {
					if (c.id === parentId) {
						return {
							...c,
							replies: [...(c.replies || []), reply],
							repliesCount: (c.repliesCount || 0) + 1,
						};
					}
					if (c.replies && c.replies.length > 0) {
						return {
							...c,
							replies: updateComments(c.replies),
						};
					}
					return c;
				});
			};

			return {
				comments: {
					...state.comments,
					[postId]: updateComments(postComments),
				},
			};
		});
	},

	toggleLike: async (postId, commentId) => {
		// Optimistic update
		set((state) => {
			const postComments = state.comments[postId] || [];
			
			const updateLike = (comments: Comment[]): Comment[] => {
				return comments.map((c) => {
					if (c.id === commentId) {
						const isLiked = !c.liked;
						return {
							...c,
							liked: isLiked,
							likesCount: (c.likesCount || 0) + (isLiked ? 1 : -1),
						};
					}
					if (c.replies && c.replies.length > 0) {
						return {
							...c,
							replies: updateLike(c.replies),
						};
					}
					return c;
				});
			};

			return {
				comments: { ...state.comments, [postId]: updateLike(postComments) },
			};
		});

		try {
			const res = await fetch(`/api/comments/like/${commentId}`, {
				method: "POST",
			});
			if (!res.ok) throw new Error("Failed to like comment");
		} catch (error) {
			console.error(error);
			// Revert on error by refetching
			get().fetchComments(postId);
		}
	},

	setComments: (postId, comments) =>
		set((state) => ({
			comments: {
				...state.comments,
				[postId]: comments,
			},
		})),

	setLoading: (postId, loading) =>
		set((state) => ({
			isLoading: {
				...state.isLoading,
				[postId]: loading,
			},
		})),

	clearComments: (postId) =>
		set((state) => {
			const newComments = { ...state.comments };
			delete newComments[postId];
			return { comments: newComments };
		}),
}));

