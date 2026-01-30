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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ImageIcon, 
  X, 
  Loader2, 
  Plus, 
  Smile,
  Globe,
  Calendar,
  MapPin,
  List,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Image as LucideImage
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { PostType } from "@/types/post";
import { createPostAction } from "@/app/(aeko-main)/actions";
import { useUser } from "@/components/shared/user-context";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useMobile();
  const { user } = useUser();

  const handleFormat = (type: 'bold' | 'italic') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    const marker = type === 'bold' ? '**' : '*';
    
    // If no selection, just insert markers at cursor
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);
    
    const newText = `${before}${marker}${selection}${marker}${after}`;
    
    setContent(newText);
    
    // Restore selection (inside markers)
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + marker.length, end + marker.length);
    }, 0);
  };

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

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview("");
    setPostType("text");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
        removeMedia();
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button
            className="flex justify-center items-center md:size-15 lg:size-20 xl:size-16 p-3 xl:w-full xl:flex-1 xl:gap-x-3 xl:p-2 rounded-full 
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
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden bg-background border-border rounded-2xl">
        <DialogHeader className="p-3 flex flex-row items-center justify-between border-none">
          <DialogTitle className="hidden">Create Post</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8 hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            className="text-primary font-bold hover:bg-primary/10 rounded-full px-4 h-8 text-sm"
          >
            Drafts
          </Button>
        </DialogHeader>

        <div className="flex flex-col px-4 pb-4 gap-2">
          <div className="flex gap-3">
            <div className="pt-1 flex-shrink-0">
              <Avatar className="w-10 h-10 border border-border/50">
                <AvatarImage src={user?.profilePicture} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 flex flex-col gap-3 min-w-0">
              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                <Textarea
                  ref={textareaRef}
                  placeholder="Aeko your thought"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[100px] w-full resize-none border-none focus-visible:ring-0 p-0 text-xl placeholder:text-muted-foreground/60 shadow-none leading-relaxed bg-transparent"
                />

                {/* Media Preview */}
                {mediaPreview && (
                  <div className="relative mt-2 rounded-2xl overflow-hidden bg-muted/30 border border-border/50 group">
                    <Button
                      onClick={removeMedia}
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white z-10 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                    
                    {postType === "image" ? (
                      <div className="relative w-full aspect-auto max-h-[500px]">
                        <Image
                          src={mediaPreview}
                          alt="Preview"
                          width={600}
                          height={600}
                          className="w-full h-auto object-contain max-h-[500px]"
                        />
                      </div>
                    ) : (
                      <video
                        src={mediaPreview}
                        className="w-full max-h-[500px] object-contain"
                        controls
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="pb-2 border-b border-border/40">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-primary hover:text-primary hover:bg-primary/10 rounded-full gap-2 font-semibold text-sm -ml-2"
                >
                  <Globe className="w-4 h-4" />
                  Everyone can reply
                </Button>
              </div>

              {/* Tools & Post Button */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-0.5 -ml-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {/* Media Upload */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-primary hover:text-primary hover:bg-primary/10 rounded-full h-9 w-9"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.accept = "image/*,video/*";
                        fileInputRef.current.click();
                      }
                    }}
                    disabled={isLoading}
                    title="Media"
                  >
                    <LucideImage className="w-5 h-5" />
                  </Button>

                  {/* GIF */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-primary hover:text-primary hover:bg-primary/10 rounded-full h-9 w-9"
                    disabled={isLoading}
                    title="GIF"
                  >
                    <div className="border-[1.5px] border-current rounded-[4px] px-[2px] text-[9px] font-bold leading-none">GIF</div>
                  </Button>

                  {/* Poll */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-primary hover:text-primary hover:bg-primary/10 rounded-full h-9 w-9"
                    disabled={isLoading}
                    title="Poll"
                  >
                    <List className="w-5 h-5" />
                  </Button>

                  {/* Emoji */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-primary hover:text-primary hover:bg-primary/10 rounded-full h-9 w-9"
                    disabled={isLoading}
                    title="Emoji"
                  >
                    <Smile className="w-5 h-5" />
                  </Button>

                  {/* Schedule */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-primary hover:text-primary hover:bg-primary/10 rounded-full h-9 w-9"
                    disabled={isLoading}
                    title="Schedule"
                  >
                    <Calendar className="w-5 h-5" />
                  </Button>

                  {/* Location */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-primary hover:text-primary hover:bg-primary/10 rounded-full h-9 w-9"
                    disabled={isLoading}
                    title="Location"
                  >
                    <MapPin className="w-5 h-5" />
                  </Button>

                  {/* Formatting Group */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-primary hover:text-primary hover:bg-primary/10 rounded-full h-9 w-9"
                    disabled={isLoading}
                    title="Bold"
                    onClick={() => handleFormat('bold')}
                  >
                    <BoldIcon className="w-5 h-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-primary hover:text-primary hover:bg-primary/10 rounded-full h-9 w-9"
                    disabled={isLoading}
                    title="Italic"
                    onClick={() => handleFormat('italic')}
                  >
                    <ItalicIcon className="w-5 h-5" />
                  </Button>
                </div>

                <Button
                  onClick={handlePost}
                  disabled={(!content.trim() && !mediaFile) || isLoading}
                  className={cn(
                    "min-w-[70px] rounded-full font-bold transition-all px-5 py-2 h-9 text-sm",
                    (!content.trim() && !mediaFile) 
                      ? "bg-primary/50 text-white opacity-50 cursor-not-allowed" 
                      : "bg-primary text-white hover:bg-primary/90"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Post"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
