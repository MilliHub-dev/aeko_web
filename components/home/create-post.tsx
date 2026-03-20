"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import {
  Bold as BoldIcon,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Contrast,
  Globe,
  Image as LucideImage,
  Italic as ItalicIcon,
  List,
  Loader2,
  Lock,
  MapPin,
  Palette,
  Plus,
  RotateCw,
  Scissors,
  SlidersHorizontal,
  Smile,
  Sparkles,
  SunMedium,
  User as UserIcon,
  Users,
  Wand2,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { PostType } from "@/types/post";
import { useUser } from "@/components/shared/user-context";
import { UserSelector } from "./post/user-selector";
import { toast } from "sonner";

interface ImageEdits {
  brightness: number;
  contrast: number;
  saturation: number;
  rotation: number;
}

interface VideoEdits {
  duration: number;
  trimStart: number;
  trimEnd: number;
}

interface MediaItem {
  id: string;
  file: File;
  url: string;
  type: "image" | "video";
  editedFile?: File;
  editedUrl?: string;
  imageEdits: ImageEdits;
  videoEdits: VideoEdits;
}

interface EditorState {
  open: boolean;
  mediaId: string | null;
  imageEdits: ImageEdits;
  videoEdits: VideoEdits;
  processing: boolean;
}

interface CreatePostProps {
  onPost?: (data: {
    type: PostType;
    content: string;
    mediaFiles?: File[];
    hashtags: string[];
  }) => void;
  trigger?: React.ReactNode;
}

const DEFAULT_IMAGE_EDITS: ImageEdits = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  rotation: 0,
};

const DEFAULT_VIDEO_EDITS: VideoEdits = {
  duration: 0,
  trimStart: 0,
  trimEnd: 0,
};

function isDefaultImageEdits(edits: ImageEdits) {
  return (
    edits.brightness === DEFAULT_IMAGE_EDITS.brightness &&
    edits.contrast === DEFAULT_IMAGE_EDITS.contrast &&
    edits.saturation === DEFAULT_IMAGE_EDITS.saturation &&
    edits.rotation % 360 === 0
  );
}

function isDefaultVideoEdits(edits: VideoEdits) {
  return edits.duration === 0 || (edits.trimStart === 0 && edits.trimEnd === edits.duration);
}

function getMediaFile(item: MediaItem) {
  return item.editedFile ?? item.file;
}

function getMediaUrl(item: MediaItem) {
  return item.editedUrl ?? item.url;
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image for editing"));
    image.src = url;
  });
}

async function processImageWithEdits(file: File, edits: ImageEdits) {
  const sourceUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(sourceUrl);
    const rotation = ((edits.rotation % 360) + 360) % 360;
    const swapSides = rotation === 90 || rotation === 270;

    const canvas = document.createElement("canvas");
    canvas.width = swapSides ? image.height : image.width;
    canvas.height = swapSides ? image.width : image.height;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Image editor is unavailable right now");
    }

    context.filter = `brightness(${edits.brightness}%) contrast(${edits.contrast}%) saturate(${edits.saturation}%)`;
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((rotation * Math.PI) / 180);
    context.drawImage(image, -image.width / 2, -image.height / 2);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (value) => {
          if (value) resolve(value);
          else reject(new Error("Failed to save image edits"));
        },
        file.type.startsWith("image/") ? file.type : "image/jpeg",
        0.92,
      );
    });

    return new File([blob], file.name, {
      type: blob.type,
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

function getSupportedVideoMimeType() {
  if (typeof MediaRecorder === "undefined") return "";

  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];

  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function getVideoDuration(file: File) {
  return new Promise<number>((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);

    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      URL.revokeObjectURL(url);
      resolve(duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load video metadata"));
    };
    video.src = url;
  });
}

async function trimVideoFile(file: File, startTime: number, endTime: number) {
  if (typeof window === "undefined" || typeof MediaRecorder === "undefined") {
    throw new Error("Video trimming is not supported on this device");
  }

  const mimeType = getSupportedVideoMimeType();
  if (!mimeType) {
    throw new Error("Your browser does not support trimmed video export");
  }

  const video = document.createElement("video") as HTMLVideoElement & {
    captureStream?: () => MediaStream;
    mozCaptureStream?: () => MediaStream;
  };
  const sourceUrl = URL.createObjectURL(file);

  video.src = sourceUrl;
  video.preload = "auto";
  video.playsInline = true;
  video.muted = false;

  return new Promise<File>((resolve, reject) => {
    let cleanedUp = false;
    let started = false;
    let stream: MediaStream | null = null;
    let recorder: MediaRecorder | null = null;
    const chunks: BlobPart[] = [];

    const cleanup = () => {
      if (cleanedUp) return;
      cleanedUp = true;
      URL.revokeObjectURL(sourceUrl);
      video.pause();
      video.removeAttribute("src");
      video.load();
      stream?.getTracks().forEach((track) => track.stop());
    };

    const fail = (error: Error) => {
      cleanup();
      reject(error);
    };

    video.onerror = () => {
      fail(new Error("Failed to process video trim"));
    };

    video.onloadedmetadata = async () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      const clipStart = Math.max(0, Math.min(startTime, Math.max(0, duration - 0.25)));
      const clipEnd = Math.min(duration, Math.max(endTime, clipStart + 0.25));

      const captureStream = video.captureStream || video.mozCaptureStream;
      if (!captureStream) {
        fail(new Error("Video trimming is not supported in this browser"));
        return;
      }

      stream = captureStream.call(video);
      recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onerror = () => {
        fail(new Error("Failed while recording trimmed video"));
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder?.mimeType || mimeType });
        cleanup();

        if (blob.size === 0) {
          reject(new Error("Trimmed video export was empty"));
          return;
        }

        resolve(
          new File([blob], `${file.name.replace(/\.[^.]+$/, "")}-trimmed.webm`, {
            type: blob.type,
            lastModified: Date.now(),
          }),
        );
      };

      video.ontimeupdate = () => {
        if (started && video.currentTime >= clipEnd) {
          video.pause();
          if (recorder && recorder.state !== "inactive") {
            recorder.stop();
          }
        }
      };

      video.onseeked = async () => {
        if (started) return;
        started = true;

        try {
          recorder.start();
          await video.play();
        } catch (error) {
          fail(error instanceof Error ? error : new Error("Unable to export trimmed video"));
        }
      };

      video.currentTime = clipStart;
    };
  });
}

export function CreatePost({ onPost, trigger }: CreatePostProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [postType, setPostType] = useState<PostType>("text");
  const [privacy, setPrivacy] = useState<"public" | "followers" | "select_users" | "only_me">("public");
  const [location, setLocation] = useState("");
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [showScheduleInput, setShowScheduleInput] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isUserSelectOpen, setIsUserSelectOpen] = useState(false);
  const [editorState, setEditorState] = useState<EditorState>({
    open: false,
    mediaId: null,
    imageEdits: DEFAULT_IMAGE_EDITS,
    videoEdits: DEFAULT_VIDEO_EDITS,
    processing: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useMobile();
  const { user } = useUser();

  const selectedMedia =
    mediaItems.find((item) => item.id === editorState.mediaId) ?? null;

  const updateMediaItems = (updater: (items: MediaItem[]) => MediaItem[]) => {
    setMediaItems((previous) => {
      const updated = updater(previous);
      const hasVideo = updated.some((item) => item.type === "video");
      setPostType(updated.length === 0 ? "text" : hasVideo ? "video" : "image");
      return updated;
    });
  };

  const resetComposer = () => {
    setContent("");
    setMediaItems((previous) => {
      previous.forEach((item) => {
        URL.revokeObjectURL(item.url);
        if (item.editedUrl) {
          URL.revokeObjectURL(item.editedUrl);
        }
      });
      return [];
    });
    setPostType("text");
    setSelectedUsers([]);
    setLocation("");
    setShowLocationInput(false);
    setScheduledAt("");
    setShowScheduleInput(false);
    setPrivacy("public");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFormat = (type: "bold" | "italic") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const marker = type === "bold" ? "**" : "*";

    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);
    const nextText = `${before}${marker}${selection}${marker}${after}`;

    setContent(nextText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + marker.length, end + marker.length);
    }, 0);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((previous) => previous + emojiData.emoji);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const nextText = `${before}${emojiData.emoji}${after}`;

    setContent(nextText);

    setTimeout(() => {
      textarea.focus();
      const position = start + emojiData.emoji.length;
      textarea.setSelectionRange(position, position);
    }, 0);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;

    const files = Array.from(event.target.files);
    const newItems: MediaItem[] = files.map((file) => {
      const isVideoType = file.type.startsWith("video/");
      const isVideoExt =
        /\.(mp4|mov|webm|ogg|mkv|avi|quicktime)$/i.test(file.name) ||
        file.type === "video/quicktime";

      return {
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
        type: isVideoType || isVideoExt ? "video" : "image",
        imageEdits: { ...DEFAULT_IMAGE_EDITS },
        videoEdits: { ...DEFAULT_VIDEO_EDITS },
      };
    });

    updateMediaItems((previous) => [...previous, ...newItems]);

    newItems.forEach((item) => {
      if (item.type === "video") {
        getVideoDuration(item.file)
          .then((duration) => {
            updateMediaItems((previous) =>
              previous.map((media) =>
                media.id === item.id
                  ? {
                      ...media,
                      videoEdits: {
                        duration,
                        trimStart: 0,
                        trimEnd: duration,
                      },
                    }
                  : media,
              ),
            );
          })
          .catch((error) => {
            console.error("Failed to read video metadata:", error);
          });
      }
    });
  };

  const removeMedia = (index: number) => {
    updateMediaItems((previous) => {
      const nextItems = [...previous];
      const removed = nextItems[index];
      if (removed) {
        URL.revokeObjectURL(removed.url);
        if (removed.editedUrl) {
          URL.revokeObjectURL(removed.editedUrl);
        }
        nextItems.splice(index, 1);
      }
      return nextItems;
    });

    if (mediaItems.length <= 1 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const moveMedia = (index: number, direction: "left" | "right") => {
    updateMediaItems((previous) => {
      const nextItems = [...previous];
      const targetIndex = direction === "left" ? index - 1 : index + 1;

      if (targetIndex >= 0 && targetIndex < nextItems.length) {
        [nextItems[index], nextItems[targetIndex]] = [nextItems[targetIndex], nextItems[index]];
      }

      return nextItems;
    });
  };

  const openEditor = (mediaItem: MediaItem) => {
    setEditorState({
      open: true,
      mediaId: mediaItem.id,
      imageEdits: { ...mediaItem.imageEdits },
      videoEdits: { ...mediaItem.videoEdits },
      processing: false,
    });
  };

  const closeEditor = () => {
    setEditorState((previous) => ({
      ...previous,
      open: false,
      mediaId: null,
      processing: false,
    }));
  };

  const applyMediaEdits = async () => {
    if (!selectedMedia) return;

    setEditorState((previous) => ({ ...previous, processing: true }));

    try {
      if (selectedMedia.type === "image") {
        const hasEdits = !isDefaultImageEdits(editorState.imageEdits);
        const nextFile = hasEdits
          ? await processImageWithEdits(selectedMedia.file, editorState.imageEdits)
          : undefined;

        updateMediaItems((previous) =>
          previous.map((item) => {
            if (item.id !== selectedMedia.id) return item;

            if (item.editedUrl) {
              URL.revokeObjectURL(item.editedUrl);
            }

            return {
              ...item,
              imageEdits: { ...editorState.imageEdits },
              editedFile: nextFile,
              editedUrl: nextFile ? URL.createObjectURL(nextFile) : undefined,
            };
          }),
        );
      } else {
        const trimStart = Number(editorState.videoEdits.trimStart.toFixed(2));
        const trimEnd = Number(editorState.videoEdits.trimEnd.toFixed(2));
        const hasTrim =
          editorState.videoEdits.duration > 0 &&
          (trimStart > 0 || trimEnd < editorState.videoEdits.duration);

        const nextFile = hasTrim
          ? await trimVideoFile(selectedMedia.file, trimStart, trimEnd)
          : undefined;

        updateMediaItems((previous) =>
          previous.map((item) => {
            if (item.id !== selectedMedia.id) return item;

            if (item.editedUrl) {
              URL.revokeObjectURL(item.editedUrl);
            }

            return {
              ...item,
              videoEdits: { ...editorState.videoEdits },
              editedFile: nextFile,
              editedUrl: nextFile ? URL.createObjectURL(nextFile) : undefined,
            };
          }),
        );
      }

      toast.success("Media updated");
      closeEditor();
    } catch (error) {
      console.error("Failed to apply media edits:", error);
      toast.error(error instanceof Error ? error.message : "Could not apply edits");
      setEditorState((previous) => ({ ...previous, processing: false }));
    }
  };

  const handlePost = async () => {
    if (!content.trim() && mediaItems.length === 0) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("text", content);
      formData.append("type", postType);
      formData.append("privacy", privacy);
      if (location.trim()) {
        formData.append("location", location.trim());
      }
      if (scheduledAt) {
        formData.append("scheduledAt", new Date(scheduledAt).toISOString());
      }

      if (privacy === "select_users" && selectedUsers.length > 0) {
        formData.append("selectedUsers", JSON.stringify(selectedUsers));
      }

      mediaItems.forEach((item) => {
        formData.append("media", getMediaFile(item));
      });

      const response = await fetch("/api/posts/create", {
        method: "POST",
        body: formData,
      });

      const responseText = await response.text();
      let result;
      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch {
        result = {
          message: responseText || `Request failed with status ${response.status}`,
        };
      }

      if (!response.ok) {
        toast.error(result.message || "Failed to create post");
        return;
      }

      toast.success("Post created successfully");
      onPost?.({
        type: postType,
        content,
        mediaFiles: mediaItems.map(getMediaFile),
        hashtags: content.match(/#[\w]+/g)?.map((tag) => tag.slice(1)) || [],
      });

      resetComposer();
      setIsOpen(false);
    } catch (error: any) {
      console.error("Failed to create post:", error);
      toast.error(error?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectedUser = (userId: string) => {
    setSelectedUsers((previous) =>
      previous.includes(userId)
        ? previous.filter((value) => value !== userId)
        : [...previous, userId],
    );
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            closeEditor();
          }
        }}
      >
        <DialogTrigger asChild>
          {trigger || (
            <button
              className="flex items-center justify-center rounded-full border-2 border-primary p-3 text-black transition-all duration-200 ease-in-out hover:bg-primary hover:text-secondary md:size-15 lg:size-20 xl:size-16 xl:w-full xl:flex-1 xl:gap-x-3 xl:p-2"
            >
              <div className="flex items-center justify-center">
                <Plus className="w-full" strokeWidth={1.5} size={35} />
              </div>
              <span className="hidden font-medium xl:block">Create Post</span>
            </button>
          )}
        </DialogTrigger>

        <DialogContent
          className={cn(
            "gap-0 overflow-hidden border-border bg-background p-0",
            isMobile
              ? "left-0 top-0 h-[100dvh] max-w-none translate-x-0 translate-y-0 rounded-none"
              : "sm:max-w-[760px] rounded-[32px]",
          )}
          showCloseButton={false}
        >
          <div className="max-h-[100dvh] overflow-hidden">
            <DialogHeader className="border-b border-border/50 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(0,127,109,0.12),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,250,249,0.95))] px-4 py-4 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Composer
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-semibold text-foreground">
                      Create a post
                    </DialogTitle>
                    <DialogDescription>
                      Write something worth sharing, then polish your media before it goes live.
                    </DialogDescription>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </DialogHeader>

            <div
              className={cn(
                "flex flex-col gap-5 px-4 py-4 sm:px-6",
                isMobile ? "h-[calc(100dvh-84px)] overflow-y-auto" : "max-h-[80dvh] overflow-y-auto",
              )}
              style={
                isMobile
                  ? { paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }
                  : undefined
              }
            >
              <section className="rounded-[28px] border border-border/60 bg-card/40 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <Avatar className="h-11 w-11 border border-border/60">
                    <AvatarImage src={user?.profilePicture} alt={user?.name || "User"} />
                    <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="rounded-full bg-background text-foreground shadow-sm">
                        @{user?.username || "you"}
                      </Badge>
                      <Badge variant="secondary" className="rounded-full">
                        {mediaItems.length > 0 ? `${mediaItems.length} media item${mediaItems.length > 1 ? "s" : ""}` : "Text post"}
                      </Badge>
                      {location.trim() && (
                        <Badge variant="outline" className="rounded-full border-primary/30 text-primary">
                          <MapPin className="mr-1 h-3.5 w-3.5" />
                          {location.trim()}
                        </Badge>
                      )}
                      {scheduledAt && (
                        <Badge variant="outline" className="rounded-full border-primary/30 text-primary">
                          <Calendar className="mr-1 h-3.5 w-3.5" />
                          {new Date(scheduledAt).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </Badge>
                      )}
                    </div>

                    <Textarea
                      ref={textareaRef}
                      placeholder="Aeko your thought"
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                      className="min-h-[120px] resize-none border-0 bg-transparent p-0 text-xl leading-relaxed shadow-none focus-visible:ring-0"
                    />

                    {mediaItems.length > 0 && (
                      <div
                        className={cn(
                          "grid gap-3",
                          mediaItems.length === 1 ? "grid-cols-1" : "grid-cols-2",
                        )}
                      >
                        <AnimatePresence mode="popLayout">
                          {mediaItems.map((item, index) => {
                            const previewUrl = getMediaUrl(item);
                            const hasEdits =
                              item.type === "image"
                                ? !isDefaultImageEdits(item.imageEdits)
                                : !isDefaultVideoEdits(item.videoEdits);

                            return (
                              <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.94 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.94 }}
                                className="group relative overflow-hidden rounded-[24px] border border-border/60 bg-muted/30"
                              >
                                <div className="absolute left-3 top-3 z-20 flex flex-wrap gap-2">
                                  <Badge className="rounded-full bg-black/65 text-white">
                                    {item.type === "video" ? "Video" : "Photo"}
                                  </Badge>
                                  {hasEdits && (
                                    <Badge className="rounded-full bg-primary text-primary-foreground">
                                      Edited
                                    </Badge>
                                  )}
                                </div>

                                <div className="absolute right-3 top-3 z-20 flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                  {index > 0 && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-full bg-black/65 text-white hover:bg-black/85 hover:text-white"
                                      onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        moveMedia(index, "left");
                                      }}
                                    >
                                      <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                  )}
                                  {index < mediaItems.length - 1 && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-full bg-black/65 text-white hover:bg-black/85 hover:text-white"
                                      onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        moveMedia(index, "right");
                                      }}
                                    >
                                      <ChevronRight className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-red-500/85 text-white hover:bg-red-600 hover:text-white"
                                    onClick={(event) => {
                                      event.preventDefault();
                                      event.stopPropagation();
                                      removeMedia(index);
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>

                                <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between bg-linear-to-t from-black/80 via-black/30 to-transparent p-3 pt-16">
                                  <div className="text-xs text-white/80">
                                    {item.type === "video" && item.videoEdits.duration > 0
                                      ? `${Math.max(0, item.videoEdits.trimEnd - item.videoEdits.trimStart).toFixed(1)}s clip`
                                      : hasEdits
                                        ? "Minor edits applied"
                                        : "Original"}
                                  </div>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    className="rounded-full"
                                    onClick={(event) => {
                                      event.preventDefault();
                                      event.stopPropagation();
                                      openEditor(item);
                                    }}
                                  >
                                    <Wand2 className="mr-2 h-4 w-4" />
                                    Edit
                                  </Button>
                                </div>

                                {item.type === "image" ? (
                                  <div className="relative aspect-[4/5] w-full bg-black">
                                    <Image
                                      src={previewUrl}
                                      alt="Preview"
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                ) : (
                                  <video
                                    src={previewUrl}
                                    className="aspect-[4/5] w-full bg-black object-contain"
                                    controls
                                    playsInline
                                    preload="metadata"
                                  />
                                )}
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    )}

                    {(showLocationInput || showScheduleInput) && (
                      <div className="grid gap-3 rounded-[22px] border border-border/60 bg-background/70 p-3 sm:grid-cols-2">
                        {showLocationInput && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                              <MapPin className="h-4 w-4 text-primary" />
                              Add location
                            </div>
                            <Input
                              value={location}
                              onChange={(event) => setLocation(event.target.value)}
                              placeholder="Where are you posting from?"
                              className="rounded-full border-border/70 bg-background"
                              maxLength={80}
                              disabled={isLoading}
                            />
                          </div>
                        )}

                        {showScheduleInput && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                              <Calendar className="h-4 w-4 text-primary" />
                              Schedule post
                            </div>
                            <Input
                              type="datetime-local"
                              value={scheduledAt}
                              onChange={(event) => setScheduledAt(event.target.value)}
                              min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                                .toISOString()
                                .slice(0, 16)}
                              className="rounded-full border-border/70 bg-background"
                              disabled={isLoading}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-border/60 bg-card/30 p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 rounded-full px-3 text-primary hover:bg-primary/10 hover:text-primary"
                      >
                        {privacy === "public" && (
                          <>
                            <Globe className="mr-2 h-4 w-4" />
                            Everyone can reply
                          </>
                        )}
                        {privacy === "followers" && (
                          <>
                            <Users className="mr-2 h-4 w-4" />
                            Followers
                          </>
                        )}
                        {privacy === "select_users" && (
                          <>
                            <Users className="mr-2 h-4 w-4" />
                            Specific people {selectedUsers.length > 0 ? `(${selectedUsers.length})` : ""}
                          </>
                        )}
                        {privacy === "only_me" && (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Only me
                          </>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuItem
                        onClick={() => setPrivacy("public")}
                        className="flex cursor-pointer items-center justify-between"
                      >
                        <div className="flex items-center">
                          <Globe className="mr-2 h-4 w-4" />
                          Public
                        </div>
                        {privacy === "public" ? (
                          <CheckCircle2 className="h-4 w-4 fill-primary/10 text-primary" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setPrivacy("followers")}
                        className="flex cursor-pointer items-center justify-between"
                      >
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4" />
                          Followers
                        </div>
                        {privacy === "followers" ? (
                          <CheckCircle2 className="h-4 w-4 fill-primary/10 text-primary" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setPrivacy("select_users");
                          setIsUserSelectOpen(true);
                        }}
                        className="flex cursor-pointer items-center justify-between"
                      >
                        <div className="flex items-center">
                          <UserIcon className="mr-2 h-4 w-4" />
                          Specific People
                        </div>
                        {privacy === "select_users" ? (
                          <CheckCircle2 className="h-4 w-4 fill-primary/10 text-primary" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setPrivacy("only_me")}
                        className="flex cursor-pointer items-center justify-between"
                      >
                        <div className="flex items-center">
                          <Lock className="mr-2 h-4 w-4" />
                          Only Me
                        </div>
                        {privacy === "only_me" ? (
                          <CheckCircle2 className="h-4 w-4 fill-primary/10 text-primary" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="rounded-full border-border/70">
                      {content.length} chars
                    </Badge>
                    {mediaItems.length > 0 && (
                      <Badge variant="outline" className="rounded-full border-border/70">
                        Media ready
                      </Badge>
                    )}
                  </div>
                </div>

                <div className={cn("flex items-center justify-between gap-3 pt-4", isMobile && "sticky bottom-0 bg-background/95")}>
                  <div className="flex flex-wrap items-center gap-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*,.jpg,.jpeg,.png,.gif,.mp4,.mov,.webm,.quicktime"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-primary hover:bg-primary/10 hover:text-primary"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                      title="Media"
                    >
                      <LucideImage className="h-5 w-5" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-primary hover:bg-primary/10 hover:text-primary"
                      disabled={isLoading}
                      title="Poll"
                    >
                      <List className="h-5 w-5" />
                    </Button>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full text-primary hover:bg-primary/10 hover:text-primary"
                          disabled={isLoading}
                          title="Emoji"
                        >
                          <Smile className="h-5 w-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side="top" align="start" className="w-auto border-none p-0">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </PopoverContent>
                    </Popover>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-9 w-9 rounded-full text-primary hover:bg-primary/10 hover:text-primary",
                        showScheduleInput && "bg-primary/10",
                      )}
                      disabled={isLoading}
                      title="Schedule"
                      onClick={() => {
                        setShowScheduleInput((previous) => !previous);
                        if (showLocationInput) {
                          setShowLocationInput(false);
                        }
                      }}
                    >
                      <Calendar className="h-5 w-5" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-9 w-9 rounded-full text-primary hover:bg-primary/10 hover:text-primary",
                        showLocationInput && "bg-primary/10",
                      )}
                      disabled={isLoading}
                      title="Location"
                      onClick={() => {
                        setShowLocationInput((previous) => !previous);
                        if (showScheduleInput) {
                          setShowScheduleInput(false);
                        }
                      }}
                    >
                      <MapPin className={cn("h-5 w-5", location.trim() && "fill-current")} />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-primary hover:bg-primary/10 hover:text-primary"
                      disabled={isLoading}
                      title="Bold"
                      onClick={() => handleFormat("bold")}
                    >
                      <BoldIcon className="h-5 w-5" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-primary hover:bg-primary/10 hover:text-primary"
                      disabled={isLoading}
                      title="Italic"
                      onClick={() => handleFormat("italic")}
                    >
                      <ItalicIcon className="h-5 w-5" />
                    </Button>
                  </div>

                  <Button
                    onClick={handlePost}
                    disabled={(!content.trim() && mediaItems.length === 0) || isLoading}
                    className="min-w-[92px] rounded-full px-5"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
                  </Button>
                </div>
              </section>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editorState.open} onOpenChange={(open) => !open && closeEditor()}>
        <DialogContent className="max-w-3xl rounded-[32px] p-0" showCloseButton={false}>
          <div className="overflow-hidden rounded-[32px]">
            <DialogHeader className="border-b border-border/50 bg-card/50 px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <DialogTitle className="text-xl">Minor media edits</DialogTitle>
                  <DialogDescription>
                    {selectedMedia?.type === "video"
                      ? "Trim the clip before posting."
                      : "Adjust light, contrast, saturation, and rotation before you publish."}
                  </DialogDescription>
                </div>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={closeEditor}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </DialogHeader>

            {selectedMedia && (
              <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_320px]">
                <div className="flex min-h-[320px] items-center justify-center bg-black p-4 md:min-h-[520px]">
                  {selectedMedia.type === "image" ? (
                    <div className="relative h-full max-h-[500px] w-full">
                      <Image
                        src={getMediaUrl(selectedMedia)}
                        alt="Edit preview"
                        fill
                        className="object-contain"
                        style={{
                          filter: `brightness(${editorState.imageEdits.brightness}%) contrast(${editorState.imageEdits.contrast}%) saturate(${editorState.imageEdits.saturation}%)`,
                          transform: `rotate(${editorState.imageEdits.rotation}deg)`,
                        }}
                      />
                    </div>
                  ) : (
                    <video
                      src={getMediaUrl(selectedMedia)}
                      className="max-h-[500px] w-full object-contain"
                      controls
                      playsInline
                      preload="metadata"
                    />
                  )}
                </div>

                <div className="space-y-5 px-5 py-5">
                  {selectedMedia.type === "image" ? (
                    <>
                      <div className="rounded-[24px] border border-border/60 bg-card/50 p-4">
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                          <SunMedium className="h-4 w-4 text-primary" />
                          Brightness
                        </div>
                        <Slider
                          value={[editorState.imageEdits.brightness]}
                          min={50}
                          max={150}
                          step={1}
                          onValueChange={([value]) =>
                            setEditorState((previous) => ({
                              ...previous,
                              imageEdits: { ...previous.imageEdits, brightness: value },
                            }))
                          }
                        />
                        <p className="mt-3 text-xs text-muted-foreground">
                          {editorState.imageEdits.brightness}%
                        </p>
                      </div>

                      <div className="rounded-[24px] border border-border/60 bg-card/50 p-4">
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                          <Contrast className="h-4 w-4 text-primary" />
                          Contrast
                        </div>
                        <Slider
                          value={[editorState.imageEdits.contrast]}
                          min={50}
                          max={150}
                          step={1}
                          onValueChange={([value]) =>
                            setEditorState((previous) => ({
                              ...previous,
                              imageEdits: { ...previous.imageEdits, contrast: value },
                            }))
                          }
                        />
                        <p className="mt-3 text-xs text-muted-foreground">
                          {editorState.imageEdits.contrast}%
                        </p>
                      </div>

                      <div className="rounded-[24px] border border-border/60 bg-card/50 p-4">
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                          <Palette className="h-4 w-4 text-primary" />
                          Saturation
                        </div>
                        <Slider
                          value={[editorState.imageEdits.saturation]}
                          min={50}
                          max={180}
                          step={1}
                          onValueChange={([value]) =>
                            setEditorState((previous) => ({
                              ...previous,
                              imageEdits: { ...previous.imageEdits, saturation: value },
                            }))
                          }
                        />
                        <p className="mt-3 text-xs text-muted-foreground">
                          {editorState.imageEdits.saturation}%
                        </p>
                      </div>

                      <div className="rounded-[24px] border border-border/60 bg-card/50 p-4">
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                          <RotateCw className="h-4 w-4 text-primary" />
                          Rotation
                        </div>
                        <Button
                          variant="outline"
                          className="rounded-full"
                          onClick={() =>
                            setEditorState((previous) => ({
                              ...previous,
                              imageEdits: {
                                ...previous.imageEdits,
                                rotation: (previous.imageEdits.rotation + 90) % 360,
                              },
                            }))
                          }
                        >
                          Rotate 90°
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-[24px] border border-border/60 bg-card/50 p-4">
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                          <Scissors className="h-4 w-4 text-primary" />
                          Trim clip
                        </div>
                        <Slider
                          value={[editorState.videoEdits.trimStart, editorState.videoEdits.trimEnd]}
                          min={0}
                          max={Math.max(editorState.videoEdits.duration, 1)}
                          step={0.1}
                          minStepsBetweenThumbs={1}
                          onValueChange={([start, end]) =>
                            setEditorState((previous) => ({
                              ...previous,
                              videoEdits: {
                                ...previous.videoEdits,
                                trimStart: start,
                                trimEnd: end,
                              },
                            }))
                          }
                        />
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span>Start {editorState.videoEdits.trimStart.toFixed(1)}s</span>
                          <span>End {editorState.videoEdits.trimEnd.toFixed(1)}s</span>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-border/60 bg-card/50 p-4 text-sm text-muted-foreground">
                        This is a lightweight trim for short edits before posting. If your browser does not support export, the app will let you know.
                      </div>
                    </>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-full"
                      onClick={() =>
                        setEditorState((previous) => ({
                          ...previous,
                          imageEdits: { ...DEFAULT_IMAGE_EDITS },
                          videoEdits: {
                            duration: previous.videoEdits.duration,
                            trimStart: 0,
                            trimEnd: previous.videoEdits.duration,
                          },
                        }))
                      }
                      disabled={editorState.processing}
                    >
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                    <Button
                      className="flex-1 rounded-full"
                      onClick={applyMediaEdits}
                      disabled={editorState.processing}
                    >
                      {editorState.processing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-4 w-4" />
                          Apply
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isUserSelectOpen} onOpenChange={setIsUserSelectOpen}>
        <DialogContent className="z-[150] flex h-[500px] flex-col sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Select People</DialogTitle>
          </DialogHeader>
          <UserSelector
            selectedUserIds={selectedUsers}
            onToggleUser={(userId) => toggleSelectedUser(userId)}
          />
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setIsUserSelectOpen(false)}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
