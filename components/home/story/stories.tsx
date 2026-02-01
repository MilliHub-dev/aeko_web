"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCallback, useMemo, useEffect, useState, useRef } from "react";
import { useStoriesStore } from "@/features/stories/stores";
import type { UserStoryGroup } from "@/types/story";
import { useUser } from "@/components/shared/user-context";
import { toast } from "sonner";
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
import { ImagePlus, Type, Loader2, Check } from "lucide-react";

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
  const { user } = useUser();

  const [stories, setStories] = useState<UserStoryGroup[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Text story state
  const [isTextStoryOpen, setIsTextStoryOpen] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [isPostingText, setIsPostingText] = useState(false);

  const backgroundColors = [
    "bg-gradient-to-br from-purple-600 to-blue-500",
    "bg-gradient-to-br from-pink-500 to-orange-400",
    "bg-gradient-to-br from-teal-400 to-emerald-500",
    "bg-gradient-to-br from-gray-900 to-gray-600",
    "bg-gradient-to-br from-red-500 to-pink-500",
  ];

  const fontFamilies = [
    { name: "Sans", value: "font-sans" },
    { name: "Serif", value: "font-serif" },
    { name: "Mono", value: "font-mono" },
  ];

  const [selectedBg, setSelectedBg] = useState(backgroundColors[0]);
  const [selectedFont, setSelectedFont] = useState(fontFamilies[0].value);

  const [mediaPreview, setMediaPreview] = useState<{ url: string; type: "image" | "video"; file: File } | null>(null);
  const [mediaDescription, setMediaDescription] = useState("");

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
      
      const statuses = data.statuses || data.data || [];

      if (data && data.success && Array.isArray(statuses)) {
        // Group statuses by user
        const groupedMap = new Map<string, UserStoryGroup>();

        statuses.forEach((status: any) => {
           const cleanUrl = (url: string | undefined | null) => {
             if (!url) return "";
             return url.replace(/[`\s]/g, "");
           };

           // Handle different user structure in response
           const userObj = status.user;
           const userId = (typeof userObj === 'object' && userObj !== null) 
             ? (userObj._id || userObj.id) 
             : (status.userId || userObj);
             
           const username = (typeof userObj === 'object' && userObj !== null) 
             ? (userObj.username || userObj.name || "User") 
             : "User";
             
           const avatarUrl = cleanUrl((typeof userObj === 'object' && userObj !== null)
             ? (userObj.profilePicture || userObj.avatar)
             : "/placeholder-avatar.png");

           if (!userId) {
             return; // Skip invalid entries
           }

           if (!groupedMap.has(userId)) {
             groupedMap.set(userId, {
                userId: userId,
                username: username,
                avatarUrl: avatarUrl,
                stories: []
             });
           }

           // Determine media type safely
           let mediaType: "video" | "image" | "text" = "image";
           if (status.type === "text") {
             mediaType = "text";
           } else if (status.type === "video") {
             mediaType = "video";
           } else if (status.mediaType === "video") {
             mediaType = "video";
           }

           // Extract media URL safely
           let mediaUrl = "";
           if (Array.isArray(status.media)) {
             mediaUrl = cleanUrl(status.media[0]);
           } else if (typeof status.media === 'string') {
             mediaUrl = cleanUrl(status.media);
           }
           
           // Ensure mediaUrl is not null/undefined if it's not a text story
           if (mediaType !== 'text' && !mediaUrl) {
             // Try to use content as mediaUrl if type is image/video
             // Backend might return content wrapped in backticks
             const cleanedContent = cleanUrl(status.content);
             if (cleanedContent && (cleanedContent.startsWith('http') || cleanedContent.startsWith('data:'))) {
                mediaUrl = cleanedContent;
             }
           }

           groupedMap.get(userId)!.stories.push({
              id: status._id || status.id, // Handle both _id and id
              userId: userId,
              mediaUrl: mediaUrl,
              content: status.content,
              mediaType: mediaType,
              postedAt: status.createdAt ?? new Date().toISOString(),
              expiresAt: status.expiresAt ?? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              seen: false,
              backgroundColor: status.backgroundColor,
              font: status.font,
           });
        });

        // Convert map to array
        const transformed = Array.from(groupedMap.values());
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

  // Sort stories: Current user first, then others
  const sortedStories = useMemo(() => {
    if (!user) return stories;
    const currentUserId = user._id || user.id;

    return [...stories].sort((a, b) => {
      if (a.userId === currentUserId) return -1;
      if (b.userId === currentUserId) return 1;
      return 0;
    });
  }, [stories, user]);

  // Handle file selection - now opens preview dialog
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const type = file.type.startsWith("video") ? "video" : "image";
      const url = URL.createObjectURL(file);
      setMediaPreview({ url, type, file });
      setMediaDescription("");
      
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    []
  );

  const handleMediaStorySubmit = async () => {
    if (!mediaPreview) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("type", mediaPreview.type);
      formData.append("media", mediaPreview.file);
      formData.append("mediaType", mediaPreview.type);
      if (mediaDescription.trim()) {
        formData.append("caption", mediaDescription.trim());
      }

      const res = await fetch("/api/status", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await res.json();

      if (res.ok && result && result.success) {
        toast.success("Story posted successfully!");
        setMediaPreview(null); // Close dialog
        
        // Prepend local UI with the newly created story if returned, otherwise refresh list.
        if (result.data) {
          const status = result.data;
          
          setStories((prev) => {
            const currentUserId = user?._id || user?.id || "you";
            // Prefer API returned user ID if available, otherwise fallback to current user ID
            const userId = status.user?._id ?? status.user ?? currentUserId;
            
            const existingGroupIndex = prev.findIndex(g => g.userId === userId);
            
            const newStory = {
              id: status._id,
              userId: userId,
              mediaUrl: status.media ?? "",
              content: status.content,
              mediaType: (status.type === "video" ? "video" : "image") as "video" | "image",
              postedAt: status.createdAt ?? new Date().toISOString(),
              expiresAt: status.expiresAt ?? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              seen: false,
            };

            if (existingGroupIndex !== -1) {
              // Update existing group
              const newGroups = [...prev];
              const group = { ...newGroups[existingGroupIndex] };
              group.stories = [newStory, ...group.stories]; // Add new story at start
              newGroups[existingGroupIndex] = group;
              
              // Move this group to the beginning
              newGroups.splice(existingGroupIndex, 1);
              return [group, ...newGroups];
            }

            // Create new group
            const newGroup: UserStoryGroup = {
              userId: userId,
              username: status.user?.username ?? "you",
              avatarUrl: status.user?.profilePicture ?? "/placeholder-avatar.png",
              stories: [newStory],
            };
            return [newGroup, ...prev];
          });
        } else {
          // Fallback: re-fetch stories from server.
          await fetchStories();
        }
      } else {
        console.error("Failed to create status. Result:", result, "Status:", res.status);
        toast.error(result?.message || result?.error || "Failed to upload story");
      }
    } catch (err) {
      console.error("Error uploading story:", err);
      toast.error(err instanceof Error ? err.message : "Failed to upload story");
    } finally {
      setIsUploading(false);
    }
  };

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
          backgroundColor: selectedBg,
          font: selectedFont,
        }),
      });

      const result = await res.json();

      if (res.ok && result && result.success) {
        setIsTextStoryOpen(false);
        setTextContent("");
        toast.success("Text story posted successfully!");
        
        if (result.data) {
          const status = result.data;
          
          setStories((prev) => {
            const currentUserId = user?._id || user?.id || "you";
            const userId = status.user?._id ?? status.user ?? currentUserId;
            
            const existingGroupIndex = prev.findIndex(g => g.userId === userId);
            
            const newStory = {
              id: status._id,
              userId: userId,
              mediaUrl: "",
              content: status.content,
              mediaType: "text" as const,
              postedAt: status.createdAt ?? new Date().toISOString(),
              expiresAt: status.expiresAt ?? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              seen: false,
            };

            if (existingGroupIndex !== -1) {
              const newGroups = [...prev];
              const group = { ...newGroups[existingGroupIndex] };
              group.stories = [newStory, ...group.stories];
              newGroups[existingGroupIndex] = group;
              
              newGroups.splice(existingGroupIndex, 1);
              return [group, ...newGroups];
            }

            const newGroup: UserStoryGroup = {
              userId: userId,
              username: status.user?.username ?? "you",
              avatarUrl: status.user?.profilePicture ?? "/placeholder-avatar.png",
              stories: [newStory],
            };
            return [newGroup, ...prev];
          });
        } else {
          await fetchStories();
        }
      } else {
        console.error("Failed to create text status", result);
        toast.error(result?.message ?? "Failed to post text story");
      }
    } catch (err) {
      console.error("Error posting text story:", err);
      toast.error("Failed to post text story");
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
          {sortedStories.map((group) => {
            const hasUnseen = group.stories.some((s) => !isStorySeen(s.id));
            const isCurrentUser = user && (group.userId === (user._id || user.id));
            const firstStory = group.stories[0];
            const showMediaPreview = firstStory && (firstStory.mediaType === 'image' || firstStory.mediaType === 'video') && firstStory.mediaUrl;
            const isTextStory = firstStory && firstStory.mediaType === 'text';

            return (
              <button
                key={group.username}
                onClick={() => openStory(group.username, group.stories[0].id)}
                className="group flex flex-col items-center gap-2"
              >
                <div
                  className={`relative h-16 w-16 rounded-full p-[2px] transition-all ${
                    isCurrentUser
                      ? "bg-red-500"
                      : hasUnseen
                      ? "bg-gradient-to-tr from-yellow-400 via-orange-500 to-purple-600"
                      : "bg-border"
                  }`}
                >
                  <div className="h-full w-full overflow-hidden rounded-full border-2 border-background bg-zinc-900 relative">
                    {showMediaPreview ? (
                       firstStory.mediaType === 'video' ? (
                         <video
                           src={firstStory.mediaUrl || ""}
                           className="h-full w-full object-cover"
                           muted
                           loop
                           playsInline
                         />
                       ) : (
                         <Image
                           src={firstStory.mediaUrl || ""}
                           alt={group.username}
                           width={64}
                           height={64}
                           className="h-full w-full object-cover transition-transform group-hover:scale-110"
                         />
                       )
                    ) : isTextStory ? (
                       <div className={`h-full w-full ${firstStory.backgroundColor || "bg-gradient-to-br from-purple-500 to-pink-500"} flex items-center justify-center`}>
                          <span className={`text-[6px] text-white truncate px-1 max-w-full ${firstStory.font || "font-sans"}`}>
                             {firstStory.content}
                          </span>
                       </div>
                    ) : (
                      <Image
                        src={group.avatarUrl}
                        alt={group.username}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                    )}
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
            <div className={`p-4 rounded-lg ${selectedBg} min-h-[200px] flex items-center justify-center`}>
              <Textarea
                placeholder="What's on your mind?"
                className={`min-h-[150px] text-lg resize-none bg-transparent border-none text-white placeholder:text-white/70 focus-visible:ring-0 text-center ${selectedFont}`}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                maxLength={500}
              />
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {backgroundColors.map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setSelectedBg(bg)}
                    className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center shrink-0 border-2 ${selectedBg === bg ? "border-white" : "border-transparent"}`}
                  >
                    {selectedBg === bg && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                {fontFamilies.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => setSelectedFont(font.value)}
                    className={`px-3 py-1 rounded-full text-sm border ${selectedFont === font.value ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border"} ${font.value}`}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>
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

      <Dialog open={!!mediaPreview} onOpenChange={(open) => !open && setMediaPreview(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Story</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {mediaPreview && (
              <div className="relative aspect-[9/16] w-full max-h-[50vh] overflow-hidden rounded-md bg-black">
                {mediaPreview.type === "video" ? (
                  <video
                    src={mediaPreview.url}
                    className="h-full w-full object-contain"
                    controls
                    autoPlay
                    loop
                    muted
                  />
                ) : (
                  <Image
                    src={mediaPreview.url}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                )}
              </div>
            )}
            <Textarea
              placeholder="Add a caption..."
              className="resize-none"
              value={mediaDescription}
              onChange={(e) => setMediaDescription(e.target.value)}
              maxLength={200}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMediaPreview(null)}>
              Cancel
            </Button>
            <Button onClick={handleMediaStorySubmit} disabled={isUploading}>
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Post Story
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
