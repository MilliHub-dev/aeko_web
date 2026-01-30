"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCallback, useMemo, useEffect, useState, useRef } from "react";
import { useStoriesStore } from "@/features/stories/stores";
import type { UserStoryGroup } from "@/types/story";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Type, Loader2 } from "lucide-react";

/**
 * Stories sidebar
 *
 * - Fetches statuses from the proxied `/api/status` endpoint.
 * - Allows the user to create a new image/video status using a hidden file input.
 * - Allows the user to create a new text status using a dialog.
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

  // Text story state
  const [isTextStoryOpen, setIsTextStoryOpen] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [isPostingText, setIsPostingText] = useState(false);

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
              userId: status.user?._id ?? "you",
              mediaUrl: Array.isArray(status.media) ? status.media[0] : (status.media ?? ""),
              content: status.content,
              mediaType: status.type === "text" ? "text" : (status.mediaType ?? (status.type === "video" ? "video" : "image")),
              postedAt: status.createdAt ?? new Date().toISOString(),
              expiresAt: status.expiresAt ?? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              seen: false,
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

  // Handle file selection and POST to /api/status
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);

      try {
        const mediaType = file.type.startsWith("video") ? "video" : "image";

        const formData = new FormData();
        formData.append("type", mediaType);
        formData.append("media", file);
        formData.append("mediaType", mediaType);

        const res = await fetch("/api/status", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        const result = await res.json();

        if (res.ok && result && result.success) {
          // Prepend local UI with the newly created story if returned, otherwise refresh list.
          if (result.data) {
            const status = result.data;
            const newGroup: UserStoryGroup = {
              userId: status.user?._id ?? "you",
              username: status.user?.username ?? "you",
              avatarUrl: status.user?.profilePicture ?? "/placeholder-avatar.png",
              stories: [
                {
                  id: status._id,
                  userId: status.user?._id ?? "you",
                  mediaUrl: status.media ?? "",
                  mediaType: status.type === "video" ? "video" : "image",
                  postedAt: status.createdAt ?? new Date().toISOString(),
                  expiresAt: status.expiresAt ?? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                  seen: false,
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

  const handleTextStorySubmit = async () => {
    if (!textContent.trim()) return;

    setIsPostingText(true);
    try {
      const res = await fetch("/api/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          type: "text",
          content: textContent,
        }),
      });

      const result = await res.json();

      if (res.ok && result && result.success) {
        setIsTextStoryOpen(false);
        setTextContent("");
        
        if (result.data) {
          const status = result.data;
          const newGroup: UserStoryGroup = {
            userId: status.user?._id ?? "you",
            username: status.user?.username ?? "you",
            avatarUrl: status.user?.profilePicture ?? "/placeholder-avatar.png",
            stories: [
              {
                id: status._id,
                userId: status.user?._id ?? "you",
                mediaUrl: "",
                content: status.content,
                mediaType: "text",
                postedAt: status.createdAt ?? new Date().toISOString(),
                expiresAt: status.expiresAt ?? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                seen: false,
              },
            ],
          };
          setStories((prev) => [newGroup, ...prev]);
        } else {
          await fetchStories();
        }
      } else {
        console.error("Failed to create text status", result);
        void window.alert(result?.message ?? "Failed to post text story");
      }
    } catch (err) {
      console.error("Error posting text story:", err);
      void window.alert("Failed to post text story");
    } finally {
      setIsPostingText(false);
    }
  };

  // Navigate to story viewer
  const openStory = (username: string, id: string) => {
    router.push(`/home/stories/${username}/story/${id}`);
  };

  const AddStoryButton = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group relative flex flex-col items-center gap-2"
        >
          <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/30 p-[2px] transition-all group-hover:border-primary">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-muted/50">
              <span className="text-2xl text-muted-foreground group-hover:text-primary">+</span>
            </div>
          </div>
          <span className="text-xs font-medium text-muted-foreground">Add Story</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
          <ImagePlus className="w-4 h-4 mr-2" />
          Photo / Video
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setIsTextStoryOpen(true)} className="cursor-pointer">
          <Type className="w-4 h-4 mr-2" />
          Text Story
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <div className="flex w-full overflow-x-auto pb-4 pt-2 scrollbar-none md:pb-6">
        <div className="flex gap-4 px-4">
          {/* Add Story Button */}
          <AddStoryButton />
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Story Items */}
          {stories.map((group) => {
            const hasUnseen = group.stories.some((s) => !isStorySeen(s.id));
            return (
              <button
                key={group.username}
                onClick={() => openStory(group.username, group.stories[0].id)}
                className="group flex flex-col items-center gap-2"
              >
                <div
                  className={`relative h-16 w-16 rounded-full p-[2px] transition-all ${
                    hasUnseen
                      ? "bg-gradient-to-tr from-yellow-400 via-orange-500 to-purple-600"
                      : "bg-border"
                  }`}
                >
                  <div className="h-full w-full overflow-hidden rounded-full border-2 border-background">
                    <Image
                      src={group.avatarUrl}
                      alt={group.username}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                </div>
                <span className="w-16 truncate text-center text-xs font-medium">
                  {group.username}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Dialog open={isTextStoryOpen} onOpenChange={setIsTextStoryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Text Story</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="What's on your mind?"
              className="min-h-[150px] text-lg resize-none"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              maxLength={500}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTextStoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTextStorySubmit} disabled={!textContent.trim() || isPostingText}>
              {isPostingText ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Post Story
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
