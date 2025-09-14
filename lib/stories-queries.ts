import { Story, UserStoryGroup } from "@/types/story";
import { usersStories } from "./mock-data";

export function getAllStories(): UserStoryGroup[] {
	return usersStories;
}

export function getStory(
	username: string,
	id: string
): UserStoryGroup | undefined {
	const story = usersStories.find(
		(user) =>
			user.username === username &&
			user.stories.some((s) => s.id === id)
	);
	if (story) {
		return story as UserStoryGroup;
	}
	return undefined;
}

export function getUserStories(username: string): Story[] {
	const user = usersStories.find(
		(u) => u.username === username
	);
	if (user) {
		return user.stories as Story[];
	}
	return [];
}
