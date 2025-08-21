"use client";

import { LucidePaperclip, Mic, Smile } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { useMobile } from "@/hooks/use-mobile";

const QuickPost = () => {
	const [text, setText] = useState("");
	const isMobile = useMobile();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!text.trim()) return;

		console.log("Post submitted:", text);
		setText(""); // Reset
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="hidden md:block w-full md:max-w-lg lg:max-w-xl border border-border dark:border-border/30 mx-auto p-4 rounded-4xl transition-all"
		>
			<div className="flex items-center gap-3">
				{/* Attachment */}
				<Button
					variant="ghost"
					size="icon"
					type="button"
					className="rounded-full hover:bg-muted w-10 h-10"
				>
					<LucidePaperclip
						className="w-5 h-5 text-primary"
						strokeWidth={1.5}
						size={isMobile ? 35 : 30}
					/>
				</Button>

				{/* Input Field */}
				<div className="flex-1">
					<Textarea
						rows={isMobile ? 2 : 3}
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder="What's on your mind right now?"
						className="w-full bg-transparent border-none focus:outline-none text-base placeholder:text-muted-foreground placeholder:text-lg shadow-none place-content-center"
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
							strokeWidth={1.5}
							size={isMobile ? 35 : 30}
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
							strokeWidth={1.5}
							size={isMobile ? 35 : 30}
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
