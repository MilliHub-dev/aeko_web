import { useState, useEffect } from "react";
import { SuggestedUser, ExploreResponse } from "@/types/explore";

export function useSuggestedUsers() {
  const [users, setUsers] = useState<SuggestedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [exploreRes, usersRes] = await Promise.all([
          fetch("/api/explore"),
          fetch("/api/users")
        ]);

        let suggestedUsers: SuggestedUser[] = [];
        let extraUsers: any[] = [];

        // Handle Explore API response
        if (exploreRes.ok) {
          const exploreData: ExploreResponse = await exploreRes.json();
          if (exploreData.success && exploreData.data?.suggestedUsers) {
            suggestedUsers = exploreData.data.suggestedUsers;
          }
        }

        // Handle Users API response
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          if (usersData.success && Array.isArray(usersData.users)) {
            extraUsers = usersData.users;
          } else if (usersData.success && Array.isArray(usersData.data)) {
            extraUsers = usersData.data;
          } else if (Array.isArray(usersData)) {
            extraUsers = usersData;
          }
        }

        // Filter and map extra users
        const filteredExtraUsers = extraUsers
          .filter(user => {
            const userId = user._id || user.id;
            // Exclude if already in suggested list
            if (suggestedUsers.some(u => u._id === userId)) return false;

            // Criteria: Blue Tick OR > 5 Posts
            const hasBlueTick = user.blueTick === true;
            // Check possible locations for postsCount
            const postsCount = user.postsCount ?? user.stats?.postsCount ?? user.posts?.length ?? 0;
            const hasActivePosts = postsCount > 5;

            return hasBlueTick || hasActivePosts;
          })
          .map(user => ({
            _id: user._id || user.id,
            name: user.name,
            username: user.username,
            profilePicture: user.profilePicture || user.avatar || "/placeholder.svg",
            avatar: user.avatar,
            bio: user.bio || "",
            followers: user.followers || [],
            blueTick: user.blueTick || false,
            goldenTick: user.goldenTick || false,
            followersCount: user.followersCount ?? user.stats?.followersCount ?? user.followers?.length ?? 0,
            postsCount: user.postsCount ?? user.stats?.postsCount ?? user.posts?.length ?? 0,
            isFollowing: user.isFollowing || false
          })) as SuggestedUser[];

        // Merge lists
        // You might want to mix them or just append. 
        // Appending ensures original suggestions are seen first, then the extra ones.
        const allUsers = [...suggestedUsers, ...filteredExtraUsers];
        
        // Remove potential duplicates by ID
        const uniqueUsers = Array.from(new Map(allUsers.map(u => [u._id, u])).values());

        setUsers(uniqueUsers);
      } catch (err) {
        console.error("Error fetching suggested users:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, isLoading, error };
}
