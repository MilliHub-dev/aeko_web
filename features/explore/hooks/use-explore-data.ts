
import { useState, useEffect } from "react";
import type { ExploreData, ExploreResponse } from "@/types/explore";

export function useExploreData() {
  const [data, setData] = useState<ExploreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExploreData = async () => {
      try {
        const res = await fetch("/api/explore");
        if (!res.ok) throw new Error("Failed to fetch explore data");
        const json: ExploreResponse = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExploreData();
  }, []);

  return { data, isLoading, error };
}
