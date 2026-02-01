"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Heart, X, MoreHorizontal, Flag } from "lucide-react";
import { ReportDialog } from "@/components/report/report-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCommentsStore, usePostsStore } from "@/features/posts/stores";
import { useUser } from "@/components/shared/user-context";
import { Comment } from "@/types/comment";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface CommentItemProps {
	comment: Comment;
	postId: string;
	onReply: (id: string, username: string) => void;
	onLike: (postId: string, commentId: string) => void;
	depth?: number;
}

const CommentItem = ({ comment, postId, onReply, onLike, depth = 0 }: CommentItemProps) => {
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
    
	return (
		<div className={cn("flex flex-col", depth > 0 && "ml-8 mt-4")}>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -10 }}
				transition={{ duration: 0.2 }}
				className="flex gap-2"
			>
				<Avatar className="w-8 h-8 shrink-0">
					<AvatarImage
						src={comment.user.profilePicture || comment.user.avatar || undefined}
						alt={`${comment.user.name}'s avatar`}
					/>
					<AvatarFallback>
						{comment.user.name.slice(0, 2).toUpperCase()}
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
                        <div className="ml-auto">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-muted p-0">
                                        <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
                                        <span className="sr-only">More options</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setIsReportDialogOpen(true)}>
                                        <Flag className="w-4 h-4 mr-2" />
                                        Report Comment
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
					</div>
					<p className="text-sm wrap-break-word">
						{comment.text}
					</p>
					<div className="flex items-center gap-4 mt-1">
						<button
							className="text-xs text-muted-foreground hover:text-foreground transition-colors"
							aria-label={`Reply to ${comment.user.name}`}
							onClick={() => onReply(comment.id, comment.user.name)}
						>
							Reply
						</button>
						<button
							onClick={() => onLike(postId, comment.id)}
							className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group"
							aria-label={comment.liked ? "Unlike comment" : "Like comment"}
						>
							<Heart
								className={`w-3.5 h-3.5 transition-colors ${
									comment.liked
										? "fill-red-500 text-red-500"
										: "group-hover:text-red-500"
								}`}
							/>
							{comment.likesCount && comment.likesCount > 0 && (
								<span className="text-xs">{comment.likesCount}</span>
							)}
						</button>
					</div>
				</div>
			</motion.div>
            <ReportDialog
                isOpen={isReportDialogOpen}
                onOpenChange={setIsReportDialogOpen}
                entityId={comment.id}
                entityType="COMMENT"
                reportedId={comment.user.id || comment.user._id || (comment.user as any).id || (comment.user as any)._id || ""}
            />
			
			{/* Recursive rendering of replies */}
			{comment.replies && comment.replies.length > 0 && (
				<div className="relative">
					{/* Optional: Add a vertical line to indicate threading */}
					<div className="absolute left-4 top-0 bottom-0 w-px bg-border -ml-px hidden" /> 
					{comment.replies.map((reply) => (
						<CommentItem
							key={reply.id}
							comment={reply}
							postId={postId}
							onReply={onReply}
							onLike={onLike}
							depth={depth + 1}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export function CommentSection({
	postId
}: {
	postId: string;
}) {
	const { getComments, fetchComments, addComment, addReply, setComments, toggleLike, isLoading: storeLoading } = useCommentsStore();
	const { posts, incrementComment } = usePostsStore();
	const { user } = useUser();
	const [newComment, setNewComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [replyingTo, setReplyingTo] = useState<{ id: string; username: string } | null>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Get comments from store
	const storeComments = getComments(postId);
	const comments = storeComments;
	const isLoading = storeLoading[postId] || false;
	
	const post = posts.find((p) => p._id === postId);

	// Initialize comments in store if not already loaded (only once)
	useEffect(() => {
		// If store is empty, check if we have comments in the post object first
		if (storeComments.length === 0) {
			if (post?.comments && post.comments.length > 0) {
				setComments(postId, post.comments);
			} else {
				fetchComments(postId);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [postId]); // Only depend on postId to prevent infinite loops

	// Build comment tree
	const commentsTree = useMemo(() => {
		const map = new Map<string, Comment>();
		const roots: Comment[] = [];
		
		// Create a shallow copy of items and initialize replies array if missing
		// We use a map to easily find parents
		const allComments = comments.map(c => ({
			...c, 
			replies: c.replies ? [...c.replies] : [] 
		}));
		
		allComments.forEach(c => map.set(c.id, c));
		
		allComments.forEach(c => {
			if (c.parentId && map.has(c.parentId)) {
				const parent = map.get(c.parentId)!;
				// Avoid duplicates if they are already nested in store
				if (!parent.replies?.some(r => r.id === c.id)) {
					parent.replies?.push(c);
				}
			} else {
				roots.push(c);
			}
		});
		
		return roots;
	}, [comments]);

	const handleSubmit = useCallback(async () => {
		if (!newComment.trim() || isSubmitting) return;

		setIsSubmitting(true);
		setError(null);
		
		const commentText = newComment.trim();
		
		// Create new comment object for optimistic update
		const tempId = `temp-${Date.now()}`;
		const optimisticComment: Comment = {
			id: tempId,
			user: {
				name: user?.name || "You",
				avatar: user?.profilePicture || "",
			},
			text: commentText,
			timeAgo: "just now",
			parentId: replyingTo?.id // Set parentId if replying
		};

		try {
			// Optimistic update
			if (replyingTo) {
				addReply(postId, replyingTo.id, optimisticComment);
			} else {
				addComment(postId, optimisticComment);
			}
			incrementComment(postId);
			setNewComment("");
			setReplyingTo(null);

			// Determine endpoint
			const endpoint = replyingTo 
				? `/api/comments/reply/${replyingTo.id}`
				: `/api/comments/${postId}`;

			// Make API call to persist comment
			const response = await fetch(endpoint, {
			  method: 'POST',
			  headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify({ text: commentText }),
			});
			
			if (!response.ok) {
			  const errorData = await response.json().catch(() => ({}));
			  throw new Error(errorData.message || errorData.error || `Failed to post comment (${response.status})`);
			}
			
			const savedComment = await response.json();
			// Ideally we should update the comment ID from tempId to savedComment.id
			
		} catch (err) {
			console.error("Error posting comment:", err);
			// Rollback on error
			setError(err instanceof Error ? err.message : "Failed to post comment. Please try again.");
			// TODO: Remove the optimistic comment (requires removeComment action)
		} finally {
			setIsSubmitting(false);
		}
	}, [newComment, isSubmitting, postId, addComment, addReply, incrementComment, user, replyingTo]);

	const handleReply = useCallback((id: string, username: string) => {
		setReplyingTo({ id, username });
		textareaRef.current?.focus();
	}, []);

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
					<AvatarImage src={user?.profilePicture || user?.avatar || undefined} />
					<AvatarFallback>{user?.name?.slice(0, 2).toUpperCase() || "UN"}</AvatarFallback>
				</Avatar>
				<div className="flex-1">
					{replyingTo && (
						<div className="flex items-center justify-between bg-muted/30 px-3 py-1.5 rounded-t-md border border-b-0 border-border text-xs text-muted-foreground">
							<span>Replying to <span className="font-semibold text-foreground">@{replyingTo.username}</span></span>
							<button 
								onClick={() => setReplyingTo(null)}
								className="hover:text-foreground"
								aria-label="Cancel reply"
							>
								<X className="w-3 h-3" />
							</button>
						</div>
					)}
					<Textarea
						ref={textareaRef}
						placeholder={replyingTo ? `Reply to @${replyingTo.username}...` : "Add a comment..."}
						value={newComment}
						onChange={(e) => {
							setNewComment(e.target.value);
							setError(null);
						}}
						onKeyDown={handleKeyDown}
						rows={1}
						className={cn(
							"resize-none",
							replyingTo && "rounded-t-none border-t-0 focus-visible:ring-0 focus-visible:ring-offset-0"
						)}
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
			{!isLoading && commentsTree.length > 0 && (
				<div className="space-y-4">
					<AnimatePresence mode="popLayout">
						{commentsTree.map((comment) => (
							<CommentItem 
								key={comment.id} 
								comment={comment} 
								postId={postId}
								onReply={handleReply}
								onLike={toggleLike}
							/>
						))}
					</AnimatePresence>
				</div>
			)}
		</div>
	);
}
