"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Users, Bell, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LiveStream {
  id: string;
  title: string;
  streamer: {
    name: string;
    username: string;
    avatar: string;
  };
  category: string;
  viewers: number;
  thumbnail?: string;
  isLive: boolean;
  scheduledFor?: string;
  description: string;
  tags?: string[];
}

const LiveStreamCard = ({ stream }: { stream: LiveStream }) => {
  const streamerName = stream.streamer?.name || "Unknown streamer";
  const streamerUsername = stream.streamer?.username || "@unknown";
  const streamerAvatar = stream.streamer?.avatar || stream.thumbnail || "/placeholder.svg";
  const streamerInitials = streamerName.slice(0, 2).toUpperCase();
  return (
    <Link
      href={`/live-streams/${stream.id}`}
      className={cn(
        "group relative block overflow-hidden rounded-[28px] border border-border/50 bg-background/80 shadow-sm transition-all duration-300",
        "hover:-translate-y-2 hover:shadow-xl hover:border-primary/30"
      )}>
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9]">
        <Image
          src={stream.thumbnail || "/placeholder.svg"}
          alt={stream.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

        {/* Top badges */}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2 sm:inset-x-4 sm:top-4">
          <Badge className="shrink-0 rounded-full bg-red-500/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg sm:px-3 sm:text-xs">
            LIVE
          </Badge>
          <Badge className="max-w-[56%] rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md shadow-lg sm:px-3 sm:text-xs">
            <Users className="mr-1.5 h-3 w-3" />
            <span className="truncate">{stream.viewers.toLocaleString()}</span>
          </Badge>
        </div>

        {/* Play button overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
        </div>

        {/* Bottom content on image */}
        <div className="absolute inset-x-3 bottom-3 space-y-2 text-white sm:inset-x-4 sm:bottom-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border-2 border-white/30">
              <AvatarImage
                src={streamerAvatar}
                alt={streamerName}
              />
              <AvatarFallback className="text-xs">
                {streamerInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="line-clamp-1 text-sm font-semibold leading-tight drop-shadow-md">
                {streamerName}
              </p>
              <p className="line-clamp-1 text-xs leading-tight text-white/80 drop-shadow-md">
                {streamerUsername}
              </p>
            </div>
          </div>

          <h3 className="line-clamp-2 text-sm font-semibold leading-tight drop-shadow-md sm:text-base">
            {stream.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-primary/90 px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground shadow-lg sm:text-xs">
              {stream.category}
            </Badge>
            {stream.tags && stream.tags.length > 0 && (
              <Badge
                variant="outline"
                className="max-w-full rounded-full border-white/30 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm sm:text-xs">
                #{stream.tags[0]}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Desktop hover effect overlay */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hidden md:block pointer-events-none" />
    </Link>
  );
};

const UpcomingStreamCard = ({ stream }: { stream: LiveStream }) => {
  const streamerName = stream.streamer?.name || "Unknown streamer";
  const streamerUsername = stream.streamer?.username || "@unknown";
  const streamerAvatar = stream.streamer?.avatar || stream.thumbnail || "/placeholder.svg";
  const streamerInitials = streamerName.slice(0, 2).toUpperCase();
  return (
    <Link
      href={`/live-streams/${stream.id}`}
      className={cn(
        "group relative block overflow-hidden rounded-[28px] border border-border/50 bg-background/80 shadow-sm transition-all duration-300",
        "hover:-translate-y-2 hover:shadow-xl hover:border-primary/30"
      )}>
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9]">
        <Image
          src={stream.thumbnail || "/placeholder.svg"}
          alt={stream.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Gradient overlay - slightly lighter for upcoming */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

        {/* Top badges */}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2 sm:inset-x-4 sm:top-4">
          <Badge className="shrink-0 rounded-full bg-primary/90 px-2.5 py-1 text-[11px] font-semibold text-primary-foreground shadow-lg sm:px-3 sm:text-xs">
            UPCOMING
          </Badge>
          <Badge className="max-w-[62%] rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md shadow-lg sm:px-3 sm:text-xs">
            <Bell className="mr-1.5 h-3 w-3" />
            <span className="truncate">{stream.scheduledFor}</span>
          </Badge>
        </div>

        {/* Notify button overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            size="lg"
            className="rounded-full shadow-xl backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault();
              // Handle notification
            }}>
            <Bell className="mr-2 h-4 w-4" />
            Remind Me
          </Button>
        </div>

        {/* Bottom content on image */}
        <div className="absolute inset-x-3 bottom-3 space-y-2 text-white sm:inset-x-4 sm:bottom-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border-2 border-white/30">
              <AvatarImage
                src={streamerAvatar}
                alt={streamerName}
              />
              <AvatarFallback className="text-xs">
                {streamerInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="line-clamp-1 text-sm font-semibold leading-tight drop-shadow-md">
                {streamerName}
              </p>
              <p className="line-clamp-1 text-xs leading-tight text-white/80 drop-shadow-md">
                {streamerUsername}
              </p>
            </div>
          </div>

          <h3 className="line-clamp-2 text-sm font-semibold leading-tight drop-shadow-md sm:text-base">
            {stream.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-primary/90 px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground shadow-lg sm:text-xs">
              {stream.category}
            </Badge>
            {stream.tags && stream.tags.length > 0 && (
              <Badge
                variant="outline"
                className="max-w-full rounded-full border-white/30 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm sm:text-xs">
                #{stream.tags[0]}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Desktop hover effect overlay */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hidden md:block pointer-events-none" />
    </Link>
  );
};

export { LiveStreamCard, UpcomingStreamCard };
