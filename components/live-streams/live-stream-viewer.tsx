"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Menu,
  UserPlus,
  MoreVertical,
  Users,
  Heart,
  Share2,
} from "lucide-react";
import { useLiveChat } from "@/features/livestream/hooks/use-live-chat";

interface LiveStreamViewerProps {
  streamId: string;
  title: string;
  streamer: {
    name: string;
    username: string;
    avatar: string;
    followers?: string;
  };
  viewers: number;
  likes: number;
  thumbnail?: string;
  playbackUrl?: string | null;
  category: string;
  isFollowing?: boolean;
}

export function LiveStreamViewer({
  streamId,
  title,
  streamer,
  viewers,
  likes,
  thumbnail = "/placeholder.svg",
  playbackUrl,
  category,
  isFollowing = false,
}: LiveStreamViewerProps) {
  const [inputText, setInputText] = useState("");
  const { messages, sendMessage } = useLiveChat(streamId);
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [following, setFollowing] = useState(isFollowing);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText("");
    }
  };

  const handleLike = () => {
    if (hasLiked) {
      setCurrentLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setCurrentLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleFollow = () => {
    setFollowing(!following);
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-black">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        {playbackUrl ? (
          <video
            src={playbackUrl}
            autoPlay
            playsInline
            controls
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={thumbnail || streamer.avatar || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        )}
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Top Header */}
      <header className="relative z-20 mx-auto flex w-full max-w-screen-sm items-start justify-between px-3 pt-[max(env(safe-area-inset-top),0.75rem)] sm:px-4">
        <div className="flex min-w-0 items-center gap-3 py-3">
          <Link
            href="/live-streams"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/25 backdrop-blur-md transition-colors hover:bg-black/35">
            <Menu className="h-5 w-5 text-white" />
          </Link>

          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0 border-2 border-white/30">
              <AvatarImage src={streamer.avatar} alt={streamer.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {streamer.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold text-white drop-shadow-md">
                {streamer.name}
              </p>
              <p className="truncate text-xs text-white/80 drop-shadow-md">
                {streamer.username}
              </p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 py-3">
          <button
            onClick={handleFollow}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/25 backdrop-blur-md transition-colors hover:bg-black/35">
            <UserPlus
              className={`h-5 w-5 ${following ? "text-primary" : "text-white"}`}
            />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black/25 backdrop-blur-md transition-colors hover:bg-black/35">
            <MoreVertical className="h-5 w-5 text-white" />
          </button>
        </div>
      </header>

      {/* Live Badge and Viewer Count */}
      <div className="absolute left-3 top-[calc(max(env(safe-area-inset-top),0.75rem)+4.5rem)] z-20 flex max-w-[calc(100vw-1.5rem)] flex-wrap items-center gap-2 sm:left-4">
        <Badge className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lg">
          Live
        </Badge>
        <Badge className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md shadow-lg">
          <Users className="mr-1.5 h-3.5 w-3.5" />
          {viewers.toLocaleString()}
        </Badge>
        <Badge className="max-w-full rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md shadow-lg">
          <span className="truncate">{category}</span>
        </Badge>
      </div>

      {/* Stream meta */}
      <div className="absolute inset-x-0 bottom-44 z-10 mx-auto w-full max-w-screen-sm px-3 sm:px-4">
        <div className="max-w-[min(100%,28rem)] rounded-3xl bg-black/20 p-3 backdrop-blur-sm">
          <h1 className="line-clamp-2 text-base font-semibold text-white drop-shadow-md sm:text-lg">
            {title}
          </h1>
        </div>
      </div>

      {/* Floating Chat Messages */}
      <div className="absolute inset-x-0 bottom-28 z-10 mx-auto w-full max-w-screen-sm px-3 sm:px-4">
        <div className="flex max-h-[28dvh] flex-col gap-2 overflow-hidden">
          {messages.slice(-5).map((chat, index) => (
            <div
              key={chat.id}
              className="animate-slide-up w-fit max-w-[88%] rounded-2xl bg-black/35 px-3 py-2 backdrop-blur-md"
              style={{
                animationDelay: `${index * 100}ms`,
              }}>
              <div className="flex items-baseline gap-2">
                <span className="shrink-0 text-sm font-bold text-white drop-shadow-md">
                  {chat.user.name}
                </span>
                <span className="break-words text-sm text-white/90 drop-shadow-md">
                  {chat.message}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-linear-to-t from-black/85 via-black/45 to-transparent pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        <div className="mx-auto w-full max-w-screen-sm px-3 pt-8 sm:px-4">
          <div className="flex items-end gap-2 sm:gap-3">
          {/* Comment Input */}
          <div className="min-w-0 flex-1">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Drop a comment....."
              className="h-11 rounded-full border-white/20 bg-black/30 px-4 text-sm text-white placeholder:text-white/60 backdrop-blur-md focus:border-white/40 sm:h-12 sm:px-5"
            />
          </div>

          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex shrink-0 flex-col items-center justify-center gap-0.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/30 backdrop-blur-md transition-all hover:scale-110 active:scale-95 sm:h-12 sm:w-12">
              <Heart
                className={`h-6 w-6 transition-colors ${
                  hasLiked ? "fill-red-500 text-red-500" : "text-white"
                }`}
              />
            </div>
            <span className="text-xs font-semibold text-white drop-shadow-md">
              {currentLikes >= 1000
                ? `${(currentLikes / 1000).toFixed(1)}k`
                : currentLikes}
            </span>
          </button>

          {/* Share Button */}
          <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/30 backdrop-blur-md transition-all hover:scale-110 active:scale-95 sm:h-12 sm:w-12">
            <Share2 className="h-5 w-5 text-white" />
          </button>
          </div>
        </div>

        {/* Share Stats */}
        <div className="mx-auto flex w-full max-w-screen-sm items-center justify-between px-3 pb-2 pt-3 sm:px-4 sm:pb-4">
          <span className="text-xs text-white/80 drop-shadow-md">
            {viewers > 0 ? `${viewers.toLocaleString()} views` : "No views yet"}
          </span>
          <span className="text-xs text-white/80 drop-shadow-md">Share</span>
        </div>
      </div>
    </div>
  );
}
