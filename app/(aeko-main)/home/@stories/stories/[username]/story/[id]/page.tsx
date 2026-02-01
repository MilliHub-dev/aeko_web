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
	let res;
	try {
		res = await fetch(`${API_BASE_URL}/api/status`, {
			headers: {
				Authorization: `Bearer ${token?.value ?? ""}`,
			},
			cache: "no-store"
		});
	} catch (error) {
		console.error("Failed to fetch stories (network error):", error);
		return null;
	}

	if (!res.ok) {
		console.error("Failed to fetch stories:", res.status);
		return null;
	}

	const data: any = await res.json();
	const statuses = data.statuses || data.data || [];

	if (!data.success && !Array.isArray(statuses)) {
		return null;
	}

	// Group by user
	const storiesByUser = new Map<string, UserStoryGroup>();

	const cleanUrl = (url: string | undefined | null) => {
		if (!url) return "";
		return url.replace(/[`\s]/g, "");
	};

	statuses.forEach((status: any) => {
		// Handle different user structure in response
		const userObj = status.user;
		const userId = (typeof userObj === 'object' && userObj !== null) 
			? (userObj._id || userObj.id) 
			: (status.userId || userObj);
			
		const uName = (typeof userObj === 'object' && userObj !== null) 
			? (userObj.username || userObj.name || "User") 
			: "User";
			
		const avatarUrl = cleanUrl((typeof userObj === 'object' && userObj !== null)
			? (userObj.profilePicture || userObj.avatar)
			: "/placeholder-avatar.png");

		if (!userId) return;

		// Only include statuses with media for now, or handle text stories if StoryViewer supports them
		// Ensure we clean the URL before checking
		let mediaUrl = "";
		if (Array.isArray(status.media)) {
			mediaUrl = cleanUrl(status.media[0]);
		} else if (typeof status.media === 'string') {
			mediaUrl = cleanUrl(status.media);
		}
		
		const rawContent = status.content;
		const caption = status.caption || status.description;
		
		// Determine media type
		let mediaType: "image" | "video" | "text" = "image";
		if (status.type === "text") {
			mediaType = "text";
		} else if (status.mediaType === "video") {
			mediaType = "video";
		} else if (status.type === "video") {
			mediaType = "video";
		}

		// Robustness: If media is empty but content exists and isn't a URL, treat as text
		// This handles cases where backend might not set type="text" explicitly
		if (mediaType === "image" && !mediaUrl && rawContent) {
			const cleanedContent = cleanUrl(rawContent);
			const isUrl = cleanedContent.startsWith('http') || cleanedContent.startsWith('data:');
			if (!isUrl) {
				mediaType = "text";
			}
		}

		// Use rawContent as mediaUrl fallback if needed (and clean it)
		let finalMediaUrl = mediaUrl;
		if (mediaType !== 'text' && !finalMediaUrl) {
			const cleanedContent = cleanUrl(rawContent);
			if (cleanedContent && (cleanedContent.startsWith('http') || cleanedContent.startsWith('data:'))) {
				finalMediaUrl = cleanedContent;
			}
		}

		if (!finalMediaUrl && mediaType !== 'text') return;

		// Determine display content (caption)
		// If we have an explicit caption, use it.
		// Otherwise, check if rawContent is NOT a URL.
		let displayContent = caption;
		if (!displayContent && rawContent) {
			const cleaned = cleanUrl(rawContent);
			// If it's not the media URL we just used, and doesn't look like a URL, treat as caption
			if (cleaned !== finalMediaUrl && !cleaned.startsWith('http') && !cleaned.startsWith('data:')) {
				displayContent = rawContent;
			}
		}

		if (!storiesByUser.has(uName)) {
			storiesByUser.set(uName, {
				userId: userId,
				username: uName,
				avatarUrl: avatarUrl || "/placeholder-avatar.png",
				stories: []
			});
		}
		
		const group = storiesByUser.get(uName)!;

		group.stories.push({
			id: status._id || status.id,
			userId: userId,
			mediaUrl: finalMediaUrl,
			content: displayContent,
			mediaType: mediaType,
			postedAt: new Date(status.createdAt).toISOString(),
			expiresAt: new Date(status.expiresAt).toISOString(),
			seen: false, 
			duration: mediaType === 'video' ? 15000 : 10000, // Default durations in ms
			backgroundColor: status.backgroundColor,
			font: status.font
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
