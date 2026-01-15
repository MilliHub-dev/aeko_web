import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoriesState {
	seenStories: Set<string>; // Set of story IDs that have been seen

	markStoryAsSeen: (storyId: string) => void;
	isStorySeen: (storyId: string) => boolean;
	markAllUserStoriesAsSeen: (storyIds: string[]) => void;
	clearSeenStories: () => void;
}

export const useStoriesStore = create<StoriesState>()(
	persist(
		(set, get) => ({
			seenStories: new Set(),

			markStoryAsSeen: (storyId) =>
				set((state) => {
					const newSeenStories = new Set(state.seenStories);
					newSeenStories.add(storyId);
					return { seenStories: newSeenStories };
				}),

			isStorySeen: (storyId) => {
				return get().seenStories.has(storyId);
			},

			markAllUserStoriesAsSeen: (storyIds) =>
				set((state) => {
					const newSeenStories = new Set(state.seenStories);
					storyIds.forEach((id) => newSeenStories.add(id));
					return { seenStories: newSeenStories };
				}),

			clearSeenStories: () => set({ seenStories: new Set() }),
		}),
		{
			name: "stories-storage",
			partialize: (state) => ({
				seenStories: Array.from(state.seenStories),
			}),
			storage: {
				getItem: (name) => {
					const str = localStorage.getItem(name);
					if (!str) return null;
					const parsed = JSON.parse(str);
					return {
						...parsed,
						state: {
							...parsed.state,
							seenStories: new Set(parsed.state?.seenStories || []),
						},
					};
				},
				setItem: (name, value) => {
					localStorage.setItem(name, JSON.stringify(value));
				},
				removeItem: (name) => localStorage.removeItem(name),
			},
		}
	)
);

