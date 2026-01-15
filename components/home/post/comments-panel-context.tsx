"use client";

import React, {
	createContext,
	useContext,
	useState,
	useCallback
} from "react";

type CommentsPanelState = {
	isOpen: boolean;
	postId: string | null;
	open: (postId: string) => void;
	close: () => void;
};

const CommentsPanelContext =
	createContext<CommentsPanelState | null>(null);

export function CommentsPanelProvider({
	children
}: {
	children: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [postId, setPostId] = useState<string | null>(
		null
	);

	const open = useCallback((id: string) => {
		setPostId(id);
		setIsOpen(true);
	}, []);

	const close = useCallback(() => {
		setIsOpen(false);
		setPostId(null);
	}, []);

	return (
		<CommentsPanelContext.Provider
			value={{ isOpen, postId, open, close }}
		>
			{children}
		</CommentsPanelContext.Provider>
	);
}

export function useCommentsPanel(): CommentsPanelState {
	const ctx = useContext(CommentsPanelContext);
	if (!ctx) {
		throw new Error(
			"useCommentsPanel must be used within CommentsPanelProvider"
		);
	}
	return ctx;
}
