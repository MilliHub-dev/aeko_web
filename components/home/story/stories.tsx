"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCallback, useMemo, useEffect, useState, useRef } from "react";
import { useStoriesStore } from "@/features/stories/stores";
import type { UserStoryGroup } from "@/types/story";

/**
 * Stories sidebar
 *
 * - Fetches statuses from the proxied `/api/status` endpoint.
 * - Allows the user to create a new image/video status using a hidden file input.
 * - Accessibility:
 *   - Uses native `button` elements for interactive story items to avoid role hacks.
 *   - Avoids using `aria-hidden` on potentially focusable elements.
 *   - Adds descriptive aria-labels where appropriate.
 *
 * Notes:
 * - The server expects `media` to be a string (base64 data URL) for this upload flow.
 * - This component runs in the browser only (`"use client"`).
 */

export function Stories() {
  const router = useRouter();
  const { isStorySeen } = useStoriesStore();

  const [stories, setStories] = useState<UserStoryGroup[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch active statuses (stories) from the backend API.
  const fetchStories = useCallback(async () => {
    try {
      const res = await fetch("/api/status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (data && data.success && Array.isArray(data.data)) {
        const transformed: UserStoryGroup[] = data.data.map((status: any) => ({
          username: status.user?.username ?? "unknown",
          avatarUrl: status.user?.profilePicture ?? "/placeholder-avatar.png",
          stories: [
            {
              id: status._id,
              mediaUrl: status.media ?? "",
              type: status.type,
            },
          ],
        }));

        setStories(transformed);
      } else {
        console.warn("Unexpected status API response", data);
      }
    } catch (err) {
      console.error("Failed to load stories", err);
    }
  }, []);

  useEffect(() => {
    fetchStories();
    // We intentionally do not poll here; keep it simple. If needed, add polling or websockets.
  }, [fetchStories]);

  // Derived state: whether there are any unseen stories
  const hasUnseenStories = useMemo(() => {
    return stories.some((group) => group.stories.some((s) => !isStorySeen(s.id)));
  }, [stories, isStorySeen]);

  // Open the add story file picker
  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  // Helper to read a File as data URL
  const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.onload = () => {
        if (typeof reader.result === "string") resolve(reader.result);
        else reject(new Error("Unexpected file reader result"));
      };
      reader.readAsDataURL(file);
    });

  // Handle file selection and POST to /api/status
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);

      try {
        const dataUrl = await readFileAsDataUrl(file);
        const mediaType = file.type.startsWith("video") ? "video" : "image";

        const body = {
          type: mediaType as "image" | "video",
          media: dataUrl,
          mediaType,
        };

        const res = await fetch("/api/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(body),
        });

        const result = await res.json();

        if (res.ok && result && result.success) {
          // Prepend local UI with the newly created story if returned, otherwise refresh list.
          if (result.data) {
            const status = result.data;
            const newGroup: UserStoryGroup = {
              username: status.user?.username ?? "you",
              avatarUrl: status.user?.profilePicture ?? "/placeholder-avatar.png",
              stories: [
                {
                  id: status._id,
                  mediaUrl: status.media ?? "",
                  type: status.type,
                },
              ],
            };
            // Put the user's new story first so they see it immediately.
            setStories((prev) => [newGroup, ...prev]);
          } else {
            // Fallback: re-fetch stories from server.
            await fetchStories();
          }
        } else {
          console.error("Failed to create status", result);
          // Minimal UX feedback for now
          void window.alert(result?.message ?? "Failed to upload story");
        }
      } catch (err) {
        console.error("Error uploading story:", err);
        void window.alert("Failed to upload story");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [fetchStories],
  );

  // Navigate to story viewer
  const openStory = (username: string, id: string) => {
    router.push(`/home/stories/${username}/story/${id}`);
  };

  if (stories.length === 0) {
    return (
      <aside
        className="sticky top-6 hidden h-[calc(100vh-3rem)] w-24 shrink-0 md:flex"
        aria-label="Stories sidebar"
      >
        <div className="relative flex h-full w-full flex-col items-center overflow-hidden border-none">
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <p className="text-xs text-muted-foreground">No stories available</p>
            <button
              type="button"
              onClick={handleAddClick}
              className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
              aria-label="Add a new story"
            >
              Add story
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className="sticky top-6 hidden h-[calc(100vh-3rem)] w-24 shrink-0 md:flex"
      aria-label="Stories sidebar"
    >
      <div className="relative flex h-full w-full flex-col items-center overflow-hidden">
        <div className="mt-6 flex flex-col items-center gap-3 px-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleAddClick}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            aria-label="Create new story"
            disabled={isUploading}
          >
            {isUploading ? (
              <span aria-hidden="true" className="animate-pulse">
                ...
              </span>
            ) : (
              "+"
            )}
          </button>

          <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
            {isUploading ? "Uploading" : "New"}
          </p>

          {/* Simple visual indicator if there are unseen stories */}
          <div className="mt-2" aria-hidden="true">
            {hasUnseenStories ? <span className="text-[10px] text-green-400">•</span> : null}
          </div>
        </div>

        <div className="mt-4 flex-1 w-full overflow-y-auto pb-6 pr-1">
          <div className="flex flex-col items-center gap-5 pt-2">
            {stories.map((group) => {
              const firstStory = group.stories?.[0];
              if (!firstStory) return null;
              const unseen = group.stories.some((s) => !isStorySeen(s.id));

              return (
                <button
                  key={group.username}
                  type="button"
                  onClick={() => openStory(group.username, firstStory.id)}
                  className="flex flex-col items-center gap-2 text-center text-muted-foreground transition hover:text-foreground cursor-pointer group"
                  aria-label={`View stories by ${group.username}`}
                >
                  <div
                    className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-border/60 shadow-inner outline-primary/30 outline-4 outline-offset-4 transition-all group-hover:border-primary/50"
                    aria-hidden="false"
                  >
                    <Image
                      src={group.avatarUrl}
                      alt={`${group.username}'s avatar`}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                    {unseen && (
                      <span
                        className="absolute inset-0 rounded-full border-2 border-primary pointer-events-none"
                        aria-label="Unseen stories"
                      />
                    )}
                  </div>
                  <p className="w-16 truncate text-[11px]">{group.username}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
