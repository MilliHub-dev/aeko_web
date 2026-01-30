import { useState, useEffect } from "react";
import { SuggestedUser, ExploreResponse } from "@/types/explore";

export function useSuggestedUsers() {
  const [users, setUsers] = useState<SuggestedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/explore");
        if (!res.ok) throw new Error("Failed to fetch suggested users");
        const data: ExploreResponse = await res.json();
        if (data.success) {
          // Take top 5 users or so
          setUsers(data.data.suggestedUsers || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, isLoading, error };
}
