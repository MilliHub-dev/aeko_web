"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Facebook, 
  Linkedin, 
  Link as LinkIcon, 
  Plus,
  Search,
  Check,
  Instagram
} from "lucide-react";

// Custom Icons for those not in Lucide (or brand specific)
const XIcon = ({ className }: { className?: string }) => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
);

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.5382-9.6752-3.5459-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z"/></svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
);
import { usePostsStore } from "@/features/posts/stores";
import { FeedPost } from "@/types/post";
import { useUser } from "@/components/shared/user-context";

interface SharePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: FeedPost;
}

export function SharePostModal({ isOpen, onClose, post }: SharePostModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [storyText, setStoryText] = useState("");
  const [isSharingToStory, setIsSharingToStory] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const { shareToStatus } = usePostsStore();
  const { user } = useUser();

  const postUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/home/${post.user?.username}/posts/${post._id}` 
    : "";

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const res = await fetch(`/api/users?search=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.users || []);
      }
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleShareToStory = async () => {
    if (!user) {
      alert("You need to be logged in to share to your story.");
      return;
    }

    setIsSharingToStory(true);
    try {
      await shareToStatus(post._id, storyText);
      onClose();
    } catch (error) {
      alert("Failed to share to story. Please try again.");
    } finally {
      setIsSharingToStory(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExternalShare = (platform: string) => {
    let url = "";
    const text = `Check out this post by @${post.user?.username} on Aeko`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(postUrl);
    
    switch (platform) {
      case "x":
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(text + " " + postUrl)}`;
        break;
      case "telegram":
        url = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case "instagram":
      case "discord":
        navigator.clipboard.writeText(postUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        // Open web app if desired, or just stop here.
        // For now, we'll just copy link as these platforms don't support direct web sharing well.
        if (platform === "instagram") window.open("https://instagram.com", "_blank");
        if (platform === "discord") window.open("https://discord.com/app", "_blank");
        return;
    }

    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }
  };

  const handleSendToUser = async (targetUser: any) => {
    if (!user) {
      alert("You need to be logged in to send messages.");
      return;
    }

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: targetUser._id || targetUser.id,
          content: postUrl,
        }),
      });

      if (res.ok) {
        alert(`Sent to @${targetUser.username}`);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl gap-0 p-0 bg-background">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle>Share to</DialogTitle>
          <DialogDescription>
            Share this post with your friends and community
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 p-4 pt-2">
          {/* Section 1: External Platforms */}
          <div className="grid grid-cols-4 gap-4 pb-4 pt-2 select-none justify-items-center">
            <ShareButton 
              icon={<XIcon className="w-5 h-5" />} 
              label="X" 
              onClick={() => handleExternalShare("x")} 
              color="bg-black text-white"
            />
            <ShareButton 
              icon={<Facebook className="w-5 h-5" />} 
              label="Facebook" 
              onClick={() => handleExternalShare("facebook")} 
              color="bg-[#1877F2] text-white"
            />
            <ShareButton 
              icon={<Instagram className="w-5 h-5" />} 
              label="Instagram" 
              onClick={() => handleExternalShare("instagram")} 
              color="bg-gradient-to-tr from-[#FFD600] via-[#FF0169] to-[#D300C5] text-white"
            />
            <ShareButton 
              icon={<DiscordIcon className="w-5 h-5" />} 
              label="Discord" 
              onClick={() => handleExternalShare("discord")} 
              color="bg-[#5865F2] text-white"
            />
            <ShareButton 
              icon={<WhatsAppIcon className="w-5 h-5" />} 
              label="WhatsApp" 
              onClick={() => handleExternalShare("whatsapp")} 
              color="bg-[#25D366] text-white"
            />
            <ShareButton 
              icon={<Linkedin className="w-5 h-5" />} 
              label="LinkedIn" 
              onClick={() => handleExternalShare("linkedin")} 
              color="bg-[#0A66C2] text-white"
            />
            <ShareButton 
              icon={<TelegramIcon className="w-5 h-5" />} 
              label="Telegram" 
              onClick={() => handleExternalShare("telegram")} 
              color="bg-[#26A5E4] text-white"
            />
            <ShareButton 
              icon={copied ? <Check className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />} 
              label={copied ? "Copied" : "Copy Link"} 
              onClick={handleCopyLink} 
              color="bg-secondary text-foreground"
            />
          </div>

          {/* Section 2: Share to Story */}
          <div className="flex flex-col gap-2 p-2 border rounded-xl bg-muted/30 w-full">
            <h3 className="font-semibold text-xs px-1">Add to your story</h3>
            <div className="flex gap-2 items-center w-full">
              <Input 
                placeholder="Add a caption..." 
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                className="flex-1 bg-background min-w-0 h-8 text-sm"
              />
              <Button 
                onClick={handleShareToStory} 
                disabled={isSharingToStory}
                size="sm"
                className="shrink-0 h-8 px-3 text-xs"
              >
                {isSharingToStory ? "..." : "Share"}
              </Button>
            </div>
          </div>

          {/* Section 3: Send to Users */}
          <div className="flex flex-col gap-3 w-full">
            <h3 className="font-semibold text-sm">Send to users</h3>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input 
                placeholder="Search users..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 w-full"
              />
            </div>
            
            <ScrollArea className="h-[200px] sm:h-[250px] -mx-2 px-2">
              {isSearching ? (
                <div className="flex justify-center py-4 text-sm text-muted-foreground">
                  Searching...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {searchResults.map((u) => (
                    <div key={u._id || u.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={u.profilePicture} />
                          <AvatarFallback>{u.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{u.name}</span>
                          <span className="text-xs text-muted-foreground">@{u.username}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="secondary" onClick={() => handleSendToUser(u)}>
                        Send
                      </Button>
                    </div>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="flex justify-center py-4 text-sm text-muted-foreground">
                  No users found
                </div>
              ) : (
                <div className="flex justify-center py-4 text-sm text-muted-foreground">
                  Type to search users
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShareButton({ icon, label, onClick, color }: { icon: React.ReactNode, label: string, onClick: () => void, color: string }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-2 w-20 shrink-0 group focus:outline-none"
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 ${color}`}>
        {icon}
      </div>
      <span className="text-xs text-muted-foreground font-medium text-center leading-tight">{label}</span>
    </button>
  );
}
