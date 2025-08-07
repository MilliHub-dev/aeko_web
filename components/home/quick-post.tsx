"use client";

import { LucidePaperclip, Mic, Smile } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

const QuickPost = () => {
	const [text, setText] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!text.trim()) return;

		console.log("Post submitted:", text);
		setText(""); // Reset
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="w-full max-w-xl border border-border dark:border-border/30 mx-auto p-4 rounded-2xl transition-all"
		>
			<div className="flex items-start gap-3">
				{/* Attachment */}
				<Button
					variant="ghost"
					size="icon"
					type="button"
					className="rounded-full hover:bg-muted w-10 h-10"
				>
					<LucidePaperclip
						className="w-5 h-5 text-primary"
						strokeWidth={1}
					/>
				</Button>

				{/* Input Field */}
				<div className="flex-1">
					<textarea
						rows={1}
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder="What's on your mind right now?"
						className="w-full resize-none bg-transparent border-none focus:outline-none text-base placeholder:text-muted-foreground"
					/>
				</div>

				{/* Action Icons */}
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						type="button"
						className="rounded-full hover:bg-muted w-10 h-10"
					>
						<Smile
							className="w-5 h-5 text-primary"
							strokeWidth={1}
						/>
					</Button>

					<Button
						variant="ghost"
						size="icon"
						type="button"
						className="rounded-full hover:bg-muted w-10 h-10"
					>
						<Mic
							className="w-5 h-5 text-primary"
							strokeWidth={1}
						/>
					</Button>

					<Button
						type="submit"
						disabled={!text.trim()}
						className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2 font-medium disabled:opacity-50"
					>
						Post
					</Button>
				</div>
			</div>
		</form>
	);
};

export { QuickPost };
