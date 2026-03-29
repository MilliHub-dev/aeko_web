import { useState, useEffect } from "react";
import { LiveStream } from "@/components/live-streams/live-card";

const STREAM_CACHE_TTL_MS = 15000;
const streamCache = new Map<string, { timestamp: number; streams: LiveStream[] }>();

interface UpstreamLivestream {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  category: string;
  streamType?: string;
  status: string;
  viewerCount?: number;
  currentViewers?: number;
  thumbnailUrl?: string;
  thumbnail?: string;
  hostProfilePicture?: string;
  createdAt?: string;
  scheduledFor?: string;
  tags?: string[];
  user?: {
    _id?: string;
    id?: string;
    name?: string;
    username?: string;
    avatar?: string;
    profilePicture?: string;
  };
  hostName?: string;
}

interface LiveStreamFeedResponse {
  success?: boolean;
  livestreams?: UpstreamLivestream[];
  streams?: UpstreamLivestream[];
  data?: UpstreamLivestream[] | { livestreams?: UpstreamLivestream[]; streams?: UpstreamLivestream[] };
}

function mapStream(stream: UpstreamLivestream): LiveStream {
  return {
    id: String(stream._id || stream.id || ""),
    title: stream.title,
    streamer: {
      name: stream.user?.name || stream.hostName || "Unknown Streamer",
      username: stream.user?.username || stream.hostName || "@unknown",
      avatar:
        stream.user?.avatar ||
        stream.user?.profilePicture ||
        stream.hostProfilePicture ||
        "/placeholder.svg",
    },
    category: stream.category,
    viewers: stream.currentViewers || stream.viewerCount || 0,
    thumbnail:
      stream.thumbnailUrl ||
      stream.thumbnail ||
      stream.hostProfilePicture ||
      stream.user?.avatar ||
      stream.user?.profilePicture ||
      "/placeholder.svg",
    isLive: stream.status === "live",
    description: stream.description,
    tags: stream.tags || [],
    scheduledFor: stream.scheduledFor || stream.createdAt,
  };
}

function getStreamArray(data: LiveStreamFeedResponse): UpstreamLivestream[] {
  if (Array.isArray(data.livestreams)) return data.livestreams;
  if (Array.isArray(data.streams)) return data.streams;
  if (Array.isArray(data.data)) return data.data;
  if (data.data && typeof data.data === "object") {
    if (Array.isArray(data.data.livestreams)) return data.data.livestreams;
    if (Array.isArray(data.data.streams)) return data.data.streams;
  }
  return [];
}

export function useLiveStreams(activeCategory = "All", searchQuery = "") {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchStreams = async () => {
      setLoading(true);
      setError(null);

      try {
        let endpoint = "/api/livestream/trending?limit=10";

        if (searchQuery.trim()) {
          const params = new URLSearchParams({
            q: searchQuery.trim(),
            page: "1",
            limit: "20",
          });

          if (activeCategory !== "All") {
            params.set("category", activeCategory.toLowerCase());
          }

          endpoint = `/api/livestream/search?${params.toString()}`;
        } else if (activeCategory !== "All") {
          endpoint = `/api/livestream/category/${encodeURIComponent(
            activeCategory.toLowerCase()
          )}?page=1&limit=20`;
        }

        const cached = streamCache.get(endpoint);
        if (cached && Date.now() - cached.timestamp < STREAM_CACHE_TTL_MS) {
          setStreams(cached.streams);
          setLoading(false);
          return;
        }

        const res = await fetch(endpoint, { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`Failed to fetch live streams: ${res.status} ${res.statusText}`);
        }

        const data: LiveStreamFeedResponse = await res.json();
        const rawStreams = getStreamArray(data);
        const nextStreams = rawStreams.map(mapStream);
        streamCache.set(endpoint, { timestamp: Date.now(), streams: nextStreams });
        setStreams(nextStreams);
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }
        console.error("Error fetching live streams:", err);

        const message = err instanceof Error ? err.message : "Unknown error";
        if (message.includes("429")) {
          setError("Live streams are refreshing too quickly. Showing the last available results.");
          return;
        }

        setError(message);
        setStreams([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    const timer = window.setTimeout(fetchStreams, searchQuery.trim() ? 350 : 0);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [activeCategory, searchQuery]);

  return { streams, loading, error };
}
