import { useState, useEffect, useRef } from "react";
import { useUserRelationsStore } from "../stores/user-relations-store";

export const useFollowUser = (userId: string, initialIsFollowing?: boolean) => {
  const isFollowing = useUserRelationsStore((state) => state.following.has(userId));
  const { followUser, unfollowUser } = useUserRelationsStore();
  const [isLoading, setIsLoading] = useState(false);
  const syncedRef = useRef(false);

  // Sync initial state from props to store
  useEffect(() => {
    if (syncedRef.current) return;
    
    if (initialIsFollowing) {
      // If prop says following, make sure store knows
      // Note: We don't remove from store if prop is false, because we might have followed locally
      // But we should probably check if we conflict? 
      // For simplicity, we just ensure "true" is reflected.
      if (!isFollowing) {
         followUser(userId);
      }
    }
    syncedRef.current = true;
  }, [initialIsFollowing, userId, followUser, isFollowing]);

  const toggleFollow = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isLoading) return;

    setIsLoading(true);

    const willFollow = !isFollowing;

    // Optimistic update
    if (willFollow) {
      followUser(userId);
    } else {
      unfollowUser(userId);
    }

    try {
      const endpoint = willFollow
        ? `/api/profile/follow/${userId}`
        : `/api/profile/unfollow/${userId}`;
      
      const method = willFollow ? "PUT" : "DELETE";

      const res = await fetch(endpoint, {
        method,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Follow/Unfollow failed:", res.status, errorData);
        throw new Error(errorData.message || "Failed to update follow status");
      }
      
    } catch (error) {
      console.error(error);
      // Revert optimistic update
      if (willFollow) {
        unfollowUser(userId);
      } else {
        followUser(userId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isFollowing,
    isLoading,
    toggleFollow,
  };
};
