"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
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
  Image as LucideImage,
  Users,
  Lock,
  User as UserIcon,
  Circle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { PostType } from "@/types/post";
import { useUser } from "@/components/shared/user-context";
import { UserSelector } from "./post/user-selector";
import { toast } from "sonner";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion, AnimatePresence } from "motion/react";

interface MediaItem {
  id: string;
  file: File;
  url: string;
  type: 'image' | 'video';
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

export function CreatePost({ onPost, trigger }: CreatePostProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [postType, setPostType] = useState<PostType>("text");
  const [privacy, setPrivacy] = useState<"public" | "followers" | "select_users" | "only_me">("public");
  const [hasLocation, setHasLocation] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isUserSelectOpen, setIsUserSelectOpen] = useState(false);
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

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const textarea = textareaRef.current;
    if (!textarea) {
        setContent(prev => prev + emojiData.emoji);
        return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    const before = text.substring(0, start);
    const after = text.substring(end);
    
    const newText = `${before}${emojiData.emoji}${after}`;
    
    setContent(newText);
    
    // Restore selection/focus after state update
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + emojiData.emoji.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const newFiles = Array.from(e.target.files);
    console.log("Files selected:", newFiles.map(f => ({ name: f.name, type: f.type, size: f.size })));
    
    const newItems: MediaItem[] = newFiles.map(file => {
      const isVideoType = file.type.startsWith("video/");
      // Some mobile browsers might not provide a type, or it might be generic
      const isVideoExt = /\.(mp4|mov|webm|ogg|mkv|avi|quicktime)$/i.test(file.name) || file.type === "video/quicktime";
      const url = URL.createObjectURL(file);
      return {
        id: url,
        file,
        url,
        type: (isVideoType || isVideoExt) ? 'video' : 'image'
      };
    });

    setMediaItems(prev => {
      const updated = [...prev, ...newItems];
      const hasVideo = updated.some(p => p.type === 'video');
      setPostType(hasVideo ? "video" : "image");
      return updated;
    });
  };

  const removeMedia = (index: number) => {
    setMediaItems(prev => {
      const newItems = [...prev];
      if (newItems[index]) {
        URL.revokeObjectURL(newItems[index].url);
        newItems.splice(index, 1);
      }
      
      if (newItems.length === 0) {
        setPostType("text");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        const hasVideo = newItems.some(p => p.type === 'video');
        setPostType(hasVideo ? "video" : "image");
      }
      
      return newItems;
    });
  };

  const moveMedia = (index: number, direction: 'left' | 'right') => {
    setMediaItems(prev => {
      const newItems = [...prev];
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      
      if (targetIndex >= 0 && targetIndex < newItems.length) {
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
      }
      return newItems;
    });
  };

  const handlePost = async () => {
    if (!content.trim() && mediaItems.length === 0) return;

    setIsLoading(true);
    console.log("Attempting to post with media:", mediaItems.map(m => m.type));

    try {
      const formData = new FormData();
      formData.append("text", content);
      formData.append("type", postType);
      formData.append("privacy", privacy);
      
      if (privacy === "select_users" && selectedUsers.length > 0) {
        formData.append("selectedUsers", JSON.stringify(selectedUsers));
      }

      mediaItems.forEach(item => {
        formData.append("media", item.file);
      });

      const response = await fetch("/api/posts/create", {
        method: "POST",
        body: formData,
      });

      let result;
      try {
        result = await response.json();
      } catch (e) {
        result = { message: "Invalid server response" };
      }

      if (response.ok) {
        console.log("Post created successfully");
        toast.success("Post created successfully");
        // Call the onPost callback if provided (e.g. for optimistic updates or parent notification)
        onPost?.({
          type: postType,
          content,
          mediaFiles: mediaItems.map(item => item.file),
          hashtags: content.match(/#[\w]+/g)?.map((tag) => tag.slice(1)) || [],
        });

        // Reset form
        setContent("");
        mediaItems.forEach(p => URL.revokeObjectURL(p.url));
        setMediaItems([]);
        setPostType("text");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setIsOpen(false);
      } else {
        console.error("Failed to create post:", result.message);
        toast.error(result.message || "Failed to create post");
        // You might want to show an error message to the user here
      }
    } catch (error: any) {
      console.error("Failed to create post:", error);
      toast.error(error?.message || "An unexpected error occurred");
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
                {mediaItems.length > 0 && (
                  <div className={cn(
                    "grid gap-2 mt-2",
                    mediaItems.length === 1 ? "grid-cols-1" : "grid-cols-2"
                  )}>
                    <AnimatePresence mode="popLayout">
                      {mediaItems.map((item, index) => (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          key={item.id} 
                          className="relative rounded-2xl overflow-hidden bg-muted/30 border border-border/50 group"
                        >
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center gap-3 pointer-events-none">
                            {index > 0 && (
                              <Button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); moveMedia(index, 'left'); }}
                                variant="ghost"
                                size="icon"
                                className="pointer-events-auto h-8 w-8 rounded-full bg-black/60 text-white hover:bg-black/80 hover:text-white backdrop-blur-sm"
                                title="Move Previous"
                              >
                                <ChevronLeft className="w-5 h-5" />
                              </Button>
                            )}
                            
                            <Button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeMedia(index); }}
                              variant="ghost"
                              size="icon"
                              className="pointer-events-auto h-8 w-8 rounded-full bg-red-500/80 text-white hover:bg-red-600 hover:text-white backdrop-blur-sm"
                              title="Remove"
                            >
                              <X className="w-5 h-5" />
                            </Button>

                            {index < mediaItems.length - 1 && (
                              <Button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); moveMedia(index, 'right'); }}
                                variant="ghost"
                                size="icon"
                                className="pointer-events-auto h-8 w-8 rounded-full bg-black/60 text-white hover:bg-black/80 hover:text-white backdrop-blur-sm"
                                title="Move Next"
                              >
                                <ChevronRight className="w-5 h-5" />
                              </Button>
                            )}
                          </div>
                          
                          {item.type === "image" ? (
                            <div className="relative w-full aspect-auto max-h-[500px]">
                              <Image
                                src={item.url}
                                alt="Preview"
                                width={600}
                                height={600}
                                className="w-full h-auto object-contain max-h-[500px]"
                              />
                            </div>
                          ) : (
                            <video
                              src={item.url}
                              className="w-full max-h-[500px] object-contain"
                              controls
                            />
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <div className="pb-2 border-b border-border/40">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-primary hover:text-primary hover:bg-primary/10 rounded-full gap-2 font-semibold text-sm -ml-2"
                    >
                      {privacy === "public" && <><Globe className="w-4 h-4" /> Everyone can reply</>}
                      {privacy === "followers" && <><Users className="w-4 h-4" /> Followers</>}
                      {privacy === "select_users" && <><Users className="w-4 h-4" /> Specific People {selectedUsers.length > 0 && `(${selectedUsers.length})`}</>}
                      {privacy === "only_me" && <><Lock className="w-4 h-4" /> Only Me</>}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem onClick={() => setPrivacy("public")} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2" /> Public
                      </div>
                      {privacy === "public" ? <CheckCircle2 className="w-4 h-4 text-primary fill-primary/10" /> : <Circle className="w-4 h-4 text-muted-foreground" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPrivacy("followers")} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" /> Followers
                      </div>
                      {privacy === "followers" ? <CheckCircle2 className="w-4 h-4 text-primary fill-primary/10" /> : <Circle className="w-4 h-4 text-muted-foreground" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setPrivacy("select_users");
                        setIsUserSelectOpen(true);
                      }}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center">
                        <UserIcon className="w-4 h-4 mr-2" /> Specific People
                      </div>
                      {privacy === "select_users" ? <CheckCircle2 className="w-4 h-4 text-primary fill-primary/10" /> : <Circle className="w-4 h-4 text-muted-foreground" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPrivacy("only_me")} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center">
                        <Lock className="w-4 h-4 mr-2" /> Only Me
                      </div>
                      {privacy === "only_me" ? <CheckCircle2 className="w-4 h-4 text-primary fill-primary/10" /> : <Circle className="w-4 h-4 text-muted-foreground" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Tools & Post Button */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-0.5 -ml-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,.jpg,.jpeg,.png,.gif,.mp4,.mov,.webm,.quicktime"
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
                  <Popover>
                    <PopoverTrigger asChild>
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
                    </PopoverTrigger>
                    <PopoverContent side="top" className="w-auto p-0 border-none" align="start">
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </PopoverContent>
                  </Popover>

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
                    className={cn(
                      "text-primary hover:text-primary hover:bg-primary/10 rounded-full h-9 w-9",
                      hasLocation && "bg-primary/10 text-primary"
                    )}
                    disabled={isLoading}
                    title="Location"
                    onClick={() => setHasLocation(!hasLocation)}
                  >
                    <MapPin className={cn("w-5 h-5", hasLocation && "fill-current")} />
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
                  disabled={(!content.trim() && mediaItems.length === 0) || isLoading}
                  className={cn(
                    "min-w-[70px] rounded-full font-bold transition-all px-5 py-2 h-9 text-sm",
                    (!content.trim() && mediaItems.length === 0) 
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

    <Dialog open={isUserSelectOpen} onOpenChange={setIsUserSelectOpen}>
      <DialogContent className="sm:max-w-[500px] h-[500px] flex flex-col z-[150]">
        <DialogHeader>
          <DialogTitle>Select People</DialogTitle>
        </DialogHeader>
        <UserSelector 
          selectedUserIds={selectedUsers} 
          onToggleUser={(userId) => {
            setSelectedUsers(prev => 
              prev.includes(userId) 
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
            );
          }} 
        />
        <div className="flex justify-end pt-4">
            <Button onClick={() => setIsUserSelectOpen(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  </>
  );
}
