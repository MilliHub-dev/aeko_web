import type { Sound } from "./sound";

export type Story = {
	id: string; // Unique identifier
	userId: string; // Link to the user
	mediaUrl?: string; // Image or video URL (optional for text)
	content?: string; // Text content for text stories
	mediaType: "image" | "video" | "text"; // Story type
	postedAt: string; // ISO date string
	expiresAt: string; // ISO date string
	duration?: number; // Duration in seconds (videos)
	seen: boolean; // Has the current user seen it?
	backgroundColor?: string;
	font?: string;
	/** Music on an image or text story. */
	sound?: Sound | null;
	soundStartMs?: number | null;
};

export type UserStoryGroup = {
	userId: string;
	username: string;
	avatarUrl: string;
	stories: Story[];
};
