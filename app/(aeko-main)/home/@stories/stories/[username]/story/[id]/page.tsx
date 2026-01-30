import { StoryViewer } from "@/components/home/story/story-viewer";
import { cookies } from "next/headers";
import { StatusListResponse } from "@/types/status";
import { UserStoryGroup } from "@/types/story";
import { API_BASE_URL } from "@/lib/config";

export default async function StoriesPage({
	params
}: {
	params: Promise<{ username: string; id: string }>;
}) {
	const { username, id } = await params;
	const cookieStore = await cookies();
	const token = cookieStore.get("token");

	// Fetch all statuses
	const res = await fetch(`${API_BASE_URL}/api/status`, {
		headers: {
			Authorization: `Bearer ${token?.value ?? ""}`,
		},
		cache: "no-store"
	});

	if (!res.ok) {
		console.error("Failed to fetch stories:", res.status);
		return null;
	}

	const data: StatusListResponse = await res.json();
	if (!data.success || !Array.isArray(data.data)) {
		return null;
	}

	// Group by user
	const storiesByUser = new Map<string, UserStoryGroup>();

	data.data.forEach((status) => {
		// Only include statuses with media for now, or handle text stories if StoryViewer supports them
		if (!status.media && status.type !== 'text') return;

		const uName = status.user.username;
		if (!storiesByUser.has(uName)) {
			storiesByUser.set(uName, {
				userId: status.user._id,
				username: uName,
				avatarUrl: status.user.profilePicture || "/placeholder-avatar.png",
				stories: []
			});
		}
		
		const group = storiesByUser.get(uName)!;
		// Determine media type
		let mediaType: "image" | "video" = "image";
		if (status.mediaType) {
			mediaType = status.mediaType;
		} else if (status.type === "video") {
			mediaType = "video";
		}

		group.stories.push({
			id: status._id,
			userId: status.user._id,
			mediaUrl: status.media || "", // Handle text stories? StoryViewer might expect a URL.
			mediaType: mediaType,
			postedAt: new Date(status.createdAt).toISOString(),
			expiresAt: new Date(status.expiresAt).toISOString(),
			seen: false, 
			duration: status.type === 'video' ? 15 : 5 // Default durations
		});
	});

	const allStories = Array.from(storiesByUser.values());

	const currentUserIndex = allStories.findIndex(
		(u) => u.username === username
	);

	if (currentUserIndex === -1) return null;

	const currentUserStories = allStories[currentUserIndex];

	// Verify the requested story ID exists in this user's stories
	if (!currentUserStories.stories.some(s => s.id === id)) {
		return null;
	}

	const prevUser =
		allStories[currentUserIndex - 1] ?? null;
	const nextUser =
		allStories[currentUserIndex + 1] ?? null;

	return (
		<StoryViewer
			userStories={currentUserStories}
			storyId={id}
			prevUser={prevUser}
			nextUser={nextUser}
		/>
	);
}
