"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getPostComments } from "@/lib/get-comments";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useCommentsStore, usePostsStore } from "@/features/posts/stores";
import { Comment } from "@/types/comment";
import { motion, AnimatePresence } from "motion/react";

export function CommentSection({
	postId
}: {
	postId: string;
}) {
	const { getComments, setComments, addComment } = useCommentsStore();
	const { incrementComment } = usePostsStore();
	const [newComment, setNewComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// Get comments from store
	const storeComments = getComments(postId);

	// Memoize fetched comments to prevent infinite loops
	const fetchedComments = useMemo(() => {
		return getPostComments(postId);
	}, [postId]);

	// Use store comments if available, otherwise use fetched
	const comments = storeComments.length > 0 ? storeComments : fetchedComments;

	// Initialize comments in store if not already loaded (only once)
	useEffect(() => {
		if (storeComments.length === 0 && fetchedComments.length > 0) {
			setComments(postId, fetchedComments);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [postId]); // Only depend on postId to prevent infinite loops

	const handleSubmit = useCallback(async () => {
		if (!newComment.trim() || isSubmitting) return;

		setIsSubmitting(true);
		setError(null);
		
		const commentText = newComment.trim();
		
		// Create new comment
		const comment: Comment = {
			id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			user: {
				name: "You", // TODO: This should come from auth context
				avatar: "/profile.jpeg",
			},
			text: commentText,
			timeAgo: "just now",
		};

		try {
			// Optimistic update
			addComment(postId, comment);
			incrementComment(postId);
			setNewComment("");

			// TODO: Make API call to persist comment
			// const response = await fetch(`/api/posts/${postId}/comments`, {
			//   method: 'POST',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify({ text: commentText }),
			// });
			// 
			// if (!response.ok) {
			//   throw new Error('Failed to post comment');
			// }
			// 
			// const savedComment = await response.json();
			// // Update comment with server ID if needed
		} catch (err) {
			// Rollback on error
			setError(err instanceof Error ? err.message : "Failed to post comment. Please try again.");
			// Remove the optimistic comment
			// This would require a removeComment function in the store
		} finally {
			setIsSubmitting(false);
		}
	}, [newComment, isSubmitting, postId, addComment, incrementComment]);

	// Handle Enter key to submit (Shift+Enter for new line)
	const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	}, [handleSubmit]);

	return (
		<div className="space-y-4">
			{/* Comment Input */}
			<div className="flex items-start gap-2">
				<Avatar className="w-8 h-8">
					<AvatarImage src="/profile.jpeg" />
					<AvatarFallback>UN</AvatarFallback>
				</Avatar>
				<div className="flex-1">
					<Textarea
						placeholder="Add a comment..."
						value={newComment}
						onChange={(e) => {
							setNewComment(e.target.value);
							setError(null);
						}}
						onKeyDown={handleKeyDown}
						rows={1}
						className="resize-none"
						aria-label="Comment input"
						aria-describedby={error ? "comment-error" : undefined}
					/>
					{error && (
						<p id="comment-error" className="text-sm text-destructive mt-1" role="alert">
							{error}
						</p>
					)}
				</div>
				<Button
					size="sm"
					disabled={!newComment.trim() || isSubmitting}
					onClick={handleSubmit}
					aria-label="Post comment"
				>
					{isSubmitting ? "Posting..." : "Post"}
				</Button>
			</div>

			{/* Loading State */}
			{isLoading && (
				<div className="flex items-center justify-center py-8">
					<div className="text-sm text-muted-foreground">Loading comments...</div>
				</div>
			)}

			{/* Empty State */}
			{!isLoading && comments.length === 0 && (
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<p className="text-sm text-muted-foreground mb-2">No comments yet</p>
					<p className="text-xs text-muted-foreground">Be the first to comment!</p>
				</div>
			)}

			{/* Comments List */}
			{!isLoading && comments.length > 0 && (
				<div className="space-y-4">
					<AnimatePresence mode="popLayout">
						{comments.map((comment) => (
							<motion.div
								key={comment.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
								className="flex gap-2"
							>
								<Avatar className="w-8 h-8 flex-shrink-0">
									<AvatarImage
										src={comment.user.avatar}
										alt={`${comment.user.name}'s avatar`}
									/>
									<AvatarFallback>
										{comment.user.name
											.slice(0, 2)
											.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<span className="font-semibold text-sm">
											{comment.user.name}
										</span>
										<span className="text-muted-foreground text-xs">
											{comment.timeAgo}
										</span>
									</div>
									<p className="text-sm break-words">
										{comment.text}
									</p>
									<div className="flex items-center gap-4 mt-1">
										<button 
											className="text-xs text-muted-foreground hover:text-foreground transition-colors"
											aria-label={`Reply to ${comment.user.name}`}
										>
											Reply
										</button>
									</div>
								</div>
							</motion.div>
						))}
					</AnimatePresence>
				</div>
			)}
		</div>
	);
}
