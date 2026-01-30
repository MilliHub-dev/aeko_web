import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserRelationsState {
  following: Set<string>; // Set of user IDs that I am following
  followers: Set<string>; // Set of user IDs that follow me
  
  // Actions
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  setFollowing: (userIds: string[]) => void;
  isFollowing: (userId: string) => boolean;
}

export const useUserRelationsStore = create<UserRelationsState>()(
  persist(
    (set, get) => ({
      following: new Set(),
      followers: new Set(),

      followUser: (userId) =>
        set((state) => {
            const newFollowing = new Set(state.following);
            newFollowing.add(userId);
            return { following: newFollowing };
        }),

      unfollowUser: (userId) =>
        set((state) => {
            const newFollowing = new Set(state.following);
            newFollowing.delete(userId);
            return { following: newFollowing };
        }),
        
      setFollowing: (userIds) => 
        set({ following: new Set(userIds) }),

      isFollowing: (userId) => get().following.has(userId),
    }),
    {
      name: "user-relations-storage",
      partialize: (state) => ({
        following: Array.from(state.following),
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
              following: new Set(parsed.state?.following || []),
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
