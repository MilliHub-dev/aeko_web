import { useState, useEffect, useRef } from "react";
import { useUserRelationsStore } from "../stores/user-relations-store";

export const useFollowUser = (userId: string, initialIsFollowing?: boolean) => {
  const normalizedUserId = String(userId);
  const isFollowing = useUserRelationsStore((state) => state.following.has(normalizedUserId));
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
         followUser(normalizedUserId);
      }
    }
    syncedRef.current = true;
  }, [initialIsFollowing, normalizedUserId, followUser, isFollowing]);

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
      followUser(normalizedUserId);
    } else {
      unfollowUser(normalizedUserId);
    }

    try {
      const endpoint = willFollow
        ? `/api/profile/follow/${userId}`
        : `/api/profile/unfollow/${userId}`;

      const res = await fetch(endpoint, {
        method: "PUT",
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        let errorData: any = {};
        try {
          errorData = errorText ? JSON.parse(errorText) : {};
        } catch {
          errorData = { message: "Failed to parse error response", raw: errorText };
        }

        console.error("Follow/Unfollow failed:", res.status, errorData);
        throw new Error(errorData.message || "Failed to update follow status");
      }
    } catch (error) {
      console.error(error);
      // Revert optimistic update
      if (willFollow) {
        unfollowUser(normalizedUserId);
      } else {
        followUser(normalizedUserId);
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
