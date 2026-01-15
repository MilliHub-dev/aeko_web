"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, VideoIcon, X, Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { PostType } from "@/types/post";
import { createPostAction } from "@/app/(aeko-main)/actions";

interface CreatePostProps {
  onPost?: (data: {
    type: PostType;
    content: string;
    media?: File;
    hashtags: string[];
  }) => void;
  trigger?: React.ReactNode;
}

export function CreatePost({ onPost, trigger }: CreatePostProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [postType, setPostType] = useState<PostType>("text");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useMobile();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's an image or video
    const isVideo = file.type.startsWith("video/");
    setPostType(isVideo ? "video" : "image");

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setMediaPreview(previewUrl);
    setMediaFile(file);
  };

  const handlePost = async () => {
    if (!content.trim() && !mediaFile) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("text", content);
      formData.append("type", postType);
      formData.append("privacy", "public"); // Default to public for now

      if (mediaFile) {
        formData.append("media", mediaFile);
      }

      const result = await createPostAction(formData);

      if (result.success) {
        console.log("Post created successfully");
        // Call the onPost callback if provided (e.g. for optimistic updates or parent notification)
        onPost?.({
          type: postType,
          content,
          media: mediaFile || undefined,
          hashtags: content.match(/#[\w]+/g)?.map((tag) => tag.slice(1)) || [],
        });

        // Reset form
        setContent("");
        setMediaFile(null);
        setMediaPreview("");
        setIsOpen(false);
      } else {
        console.error("Failed to create post:", result.message);
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <button
              className="flex justify-center items-center md:size-15 lg:size-20 xl:size-16 p-3 xl:w-full xl:flex-1xl:gap-x-3 xl:p-2 rounded-full 
        text-black border-2 border-primary hover:bg-primary hover:text-secondary
        xl:gap-x-3 
        transition-all duration-200 ease-in-out">
              <div className="flex justify-center items-center">
                <Plus className="w-full" strokeWidth={1.5} size={35} />
              </div>
              <span className="hidden xl:block font-medium">Create Post</span>
            </button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Media Preview */}
            {mediaPreview && (
              <div className="relative aspect-square rounded-md overflow-hidden bg-muted">
                {postType === "image" ? (
                  <Image
                    src={mediaPreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <video
                    src={mediaPreview}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}
                <button
                  onClick={() => {
                    setMediaFile(null);
                    setMediaPreview("");
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Content Input */}
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="resize-none"
            />

            {/* Media Upload Buttons */}
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}>
                <ImageIcon className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}>
                <VideoIcon className="w-4 h-4" />
              </Button>
            </div>

            {/* Post Button */}
            <div className="flex justify-end">
              <Button
                onClick={handlePost}
                disabled={(!content.trim() && !mediaFile) || isLoading}
                className={cn(
                  "min-w-[100px]",
                  isLoading && "cursor-not-allowed"
                )}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Post"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
