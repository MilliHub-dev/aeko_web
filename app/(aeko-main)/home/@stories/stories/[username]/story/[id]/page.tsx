import { StoryViewer } from "@/components/home/story/story-viewer";
import {
	getAllStories,
	getStory
} from "@/lib/stories-queries";

export default async function StoriesPage({
	params
}: PageProps<"/stories/[username]/story/[id]">) {
	const { username, id } = await params;

	const allStories = getAllStories();

	const currentUserIndex = allStories.findIndex(
		(u) => u.username === username
	);
	if (currentUserIndex === -1) return null;

	const currentUserStories = getStory(username, id);
	if (!currentUserStories) return null;

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
