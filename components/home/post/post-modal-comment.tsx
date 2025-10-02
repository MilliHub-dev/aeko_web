"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getPostComments } from "@/lib/get-comments";
import { useState } from "react";

export function CommentSection({
	postId
}: {
	postId: string;
}) {
	const comments = getPostComments(postId);

	const [newComment, setNewComment] = useState("");

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
						onChange={(e) =>
							setNewComment(e.target.value)
						}
						rows={1}
						className="resize-none"
					/>
				</div>
				<Button
					size="sm"
					disabled={!newComment}
				>
					Post
				</Button>
			</div>

			{/* Comments List */}
			<div className="space-y-4">
				{comments.map((comment) => (
					<div
						key={comment.id}
						className="flex gap-2"
					>
						<Avatar className="w-8 h-8">
							<AvatarImage
								src={comment.user.avatar}
							/>
							<AvatarFallback>
								{comment.user.name
									.slice(0, 2)
									.toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<span className="font-semibold text-sm">
									{comment.user.name}
								</span>
								<span className="text-muted-foreground text-xs">
									{comment.timeAgo}
								</span>
							</div>
							<p className="text-sm">
								{comment.text}
							</p>
							<div className="flex items-center gap-4 mt-1">
								{/* <button className="text-xs text-muted-foreground hover:text-foreground">
									{comment.likes} likes
								</button> */}
								<button className="text-xs text-muted-foreground hover:text-foreground">
									Reply
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
