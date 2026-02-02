import { useState, useEffect } from "react";
import { LiveStream } from "@/components/live-streams/live-card";

interface LiveStreamFeedResponse {
  success: boolean;
  livestreams: Array<{
    _id: string;
    title: string;
    description: string;
    category: string;
    streamType: string;
    status: string;
    viewerCount?: number;
    thumbnailUrl?: string;
    createdAt: string;
    user?: {
      _id: string;
      name: string;
      username: string;
      avatar?: string;
    };
    tags?: string[];
    scheduledFor?: string;
  }>;
}

export function useLiveStreams() {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        // Use trending endpoint for public discovery
        const res = await fetch("/api/livestream/trending");
        
        if (!res.ok) {
          const errorText = await res.text().catch(() => "No error details");
          throw new Error(`Failed to fetch live streams: ${res.status} ${res.statusText}`);
        }
        
        const data: LiveStreamFeedResponse = await res.json();
        
        if (data.success && Array.isArray(data.livestreams)) {
          const mappedStreams: LiveStream[] = data.livestreams.map((stream) => ({
            id: stream._id,
            title: stream.title,
            streamer: {
              name: stream.user?.name || "Unknown Streamer",
              username: stream.user?.username || "@unknown",
              avatar: stream.user?.avatar || "/placeholder.svg",
            },
            category: stream.category,
            viewers: stream.viewerCount || 0,
            thumbnail: stream.thumbnailUrl || "/placeholder.svg",
            isLive: stream.status === "live",
            description: stream.description,
            tags: stream.tags || [],
            scheduledFor: stream.scheduledFor,
          }));
          setStreams(mappedStreams);
        } else {
          // If the structure is different or empty, set empty
          console.warn("Unexpected livestream feed structure:", data);
          setStreams([]);
        }
      } catch (err) {
        console.error("Error fetching live streams:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, []);

  return { streams, loading, error };
}
