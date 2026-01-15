import { create } from "zustand";
import { Comment } from "@/types/comment";

interface CommentsState {
	comments: Record<string, Comment[]>; // postId -> comments
	isLoading: Record<string, boolean>;

	getComments: (postId: string) => Comment[];
	addComment: (postId: string, comment: Comment) => void;
	setComments: (postId: string, comments: Comment[]) => void;
	setLoading: (postId: string, loading: boolean) => void;
	clearComments: (postId: string) => void;
}

export const useCommentsStore = create<CommentsState>((set, get) => ({
	comments: {},
	isLoading: {},

	getComments: (postId) => get().comments[postId] || [],

	addComment: (postId, comment) =>
		set((state) => ({
			comments: {
				...state.comments,
				[postId]: [...(state.comments[postId] || []), comment],
			},
		})),

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

