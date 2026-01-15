import { create } from "zustand";

interface PostUIState {
	commentsPanel: {
		isOpen: boolean;
		postId: string | null;
	};

	openCommentsPanel: (postId: string) => void;
	closeCommentsPanel: () => void;
}

export const usePostUIStore = create<PostUIState>((set) => ({
	commentsPanel: {
		isOpen: false,
		postId: null,
	},

	openCommentsPanel: (postId) =>
		set({
			commentsPanel: { isOpen: true, postId },
		}),

	closeCommentsPanel: () =>
		set({
			commentsPanel: { isOpen: false, postId: null },
		}),
}));

