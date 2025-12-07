"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Users, Bell, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveStream {
  id: number;
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
  return (
    <Link
      href={`/live-streams/${stream.id}`}
      className={cn(
        "group relative block overflow-hidden rounded-[28px] border border-border/50 bg-background/80 shadow-sm transition-all duration-300",
        "hover:-translate-y-2 hover:shadow-xl hover:border-primary/30"
      )}>
      {/* Thumbnail */}
      <div className="relative aspect-[16/9]">
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
        <div className="absolute inset-x-4 top-4 flex items-center justify-between">
          <Badge className="rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            LIVE
          </Badge>
          <Badge className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-md shadow-lg">
            <Users className="mr-1.5 h-3 w-3" />
            {stream.viewers.toLocaleString()}
          </Badge>
        </div>

        {/* Play button overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
        </div>

        {/* Bottom content on image */}
        <div className="absolute inset-x-4 bottom-4 space-y-2 text-white">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border-2 border-white/30">
              <AvatarImage
                src={stream.streamer.avatar}
                alt={stream.streamer.name}
              />
              <AvatarFallback className="text-xs">
                {stream.streamer.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight line-clamp-1 drop-shadow-md">
                {stream.streamer.name}
              </p>
              <p className="text-xs text-white/80 leading-tight drop-shadow-md">
                {stream.streamer.username}
              </p>
            </div>
          </div>

          <h3 className="text-base font-semibold leading-tight line-clamp-2 drop-shadow-md">
            {stream.title}
          </h3>

          <div className="flex items-center gap-2">
            <Badge className="rounded-full bg-primary/90 px-2.5 py-0.5 text-xs font-semibold text-primary-foreground shadow-lg">
              {stream.category}
            </Badge>
            {stream.tags && stream.tags.length > 0 && (
              <Badge
                variant="outline"
                className="rounded-full border-white/30 bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
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
  return (
    <Link
      href={`/live-streams/${stream.id}`}
      className={cn(
        "group relative block overflow-hidden rounded-[28px] border border-border/50 bg-background/80 shadow-sm transition-all duration-300",
        "hover:-translate-y-2 hover:shadow-xl hover:border-primary/30"
      )}>
      {/* Thumbnail */}
      <div className="relative aspect-[16/9]">
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
        <div className="absolute inset-x-4 top-4 flex items-center justify-between">
          <Badge className="rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
            UPCOMING
          </Badge>
          <Badge className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-md shadow-lg">
            <Bell className="mr-1.5 h-3 w-3" />
            {stream.scheduledFor}
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
        <div className="absolute inset-x-4 bottom-4 space-y-2 text-white">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border-2 border-white/30">
              <AvatarImage
                src={stream.streamer.avatar}
                alt={stream.streamer.name}
              />
              <AvatarFallback className="text-xs">
                {stream.streamer.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight line-clamp-1 drop-shadow-md">
                {stream.streamer.name}
              </p>
              <p className="text-xs text-white/80 leading-tight drop-shadow-md">
                {stream.streamer.username}
              </p>
            </div>
          </div>

          <h3 className="text-base font-semibold leading-tight line-clamp-2 drop-shadow-md">
            {stream.title}
          </h3>

          <div className="flex items-center gap-2">
            <Badge className="rounded-full bg-primary/90 px-2.5 py-0.5 text-xs font-semibold text-primary-foreground shadow-lg">
              {stream.category}
            </Badge>
            {stream.tags && stream.tags.length > 0 && (
              <Badge
                variant="outline"
                className="rounded-full border-white/30 bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
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
export type { LiveStream };
