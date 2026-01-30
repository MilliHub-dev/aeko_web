"use client";

import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
} from "lucide-react";
import type { CommunityPost } from "@/types/explore";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface CommunityPostCardProps {
  post: CommunityPost;
  showCommunityBadge?: boolean;
  className?: string;
}

export function CommunityPostCard({
  post,
  showCommunityBadge = true,
  className,
}: CommunityPostCardProps) {
  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getMediaSource = () => {
    if (post.mediaUrls && post.mediaUrls.length > 0) return post.mediaUrls[0];
    if (Array.isArray(post.media) && post.media.length > 0) return post.media[0];
    if (typeof post.media === 'string') return post.media;
    return post.mediaUrl;
  };

  const mediaUrl = getMediaSource();
  const isVideo = mediaUrl?.endsWith(".mp4") || mediaUrl?.endsWith(".webm") || mediaUrl?.endsWith(".mov");

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-border/60 bg-card/80 shadow-md transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl hover:border-primary/30",
        className
      )}>
      {mediaUrl && (
        <div className="relative aspect-[4/5]">
          {isVideo ? (
            <video 
              src={mediaUrl} 
              className="w-full h-full object-cover" 
              muted 
              loop 
              playsInline 
            />
          ) : (
            <Image
              src={mediaUrl}
              alt={post.text || "Post image"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Top section - User info */}
          <div className="absolute inset-x-4 top-4 flex items-center justify-between text-white">
            <Link
              href={`/${post.user.username}`}
              className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-2 backdrop-blur-sm transition hover:bg-black/60">
              <Avatar className="h-8 w-8 border-2 border-white/80">
                <AvatarImage
                  src={post.user.profilePicture}
                  alt={post.user.name}
                />
                <AvatarFallback className="bg-primary text-xs text-white">
                  {post.user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-left leading-tight">
                <p className="text-sm font-semibold">{post.user.name}</p>
                <p className="text-xs text-white/80">@{post.user.username}</p>
              </div>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60">
                  <MoreVertical className="h-4 w-4 text-white" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-40 rounded-xl border-border/50 bg-background/95 backdrop-blur-lg">
                <DropdownMenuItem className="cursor-pointer rounded-lg text-destructive focus:text-destructive">
                  Report post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Bottom section - Community badge */}
          {showCommunityBadge && (
            <div className="absolute inset-x-4 bottom-4">
              <Badge className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {post.community.name}
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Engagement metrics */}
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <button className="flex items-center gap-1.5 transition hover:text-rose-500">
            <Heart className="h-4 w-4" />
            <span className="font-medium">{formatCount(post.likesCount)}</span>
          </button>
          <button className="flex items-center gap-1.5 transition hover:text-primary">
            <MessageCircle className="h-4 w-4" />
            <span className="font-medium">
              {formatCount(post.commentsCount)}
            </span>
          </button>
          <button className="flex items-center gap-1.5 transition hover:text-primary">
            <Share2 className="h-4 w-4" />
            <span className="font-medium">{formatCount(post.sharesCount)}</span>
          </button>
        </div>
        <button className="transition hover:text-primary">
          <Bookmark className="h-4 w-4" />
        </button>
      </div>

      {/* Text content if no media */}
      {!mediaUrl && post.text && (
        <div className="p-5">
          <p className="text-sm text-foreground line-clamp-3">{post.text}</p>
        </div>
      )}
    </article>
  );
}
