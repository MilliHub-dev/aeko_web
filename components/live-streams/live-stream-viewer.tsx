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
  MessageCircle,
  Share2,
  Send,
} from "lucide-react";

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
  category: string;
  isFollowing?: boolean;
}

interface ChatMessage {
  id: number;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  message: string;
  timestamp: string;
}

// Mock chat messages for demonstration
const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    user: { name: "Mercy", username: "@mercy", avatar: "🙏" },
    message: "Yes sirr!!",
    timestamp: "2m ago",
  },
  {
    id: 2,
    user: { name: "Mayy", username: "@mayy", avatar: "🎵" },
    message: "I am blessed IJN",
    timestamp: "1m ago",
  },
  {
    id: 3,
    user: { name: "Banks", username: "@banks", avatar: "🎸" },
    message: "Ride on Sir",
    timestamp: "30s ago",
  },
  {
    id: 4,
    user: { name: "Gwana", username: "@gwana", avatar: "😈" },
    message: "The devil is a liar!!!",
    timestamp: "15s ago",
  },
  {
    id: 5,
    user: { name: "Samuel", username: "@samuel", avatar: "❤️" },
    message: "I love this message!",
    timestamp: "5s ago",
  },
];

export function LiveStreamViewer({
  streamId,
  title,
  streamer,
  viewers,
  likes,
  thumbnail = "/placeholder.svg",
  category,
  isFollowing = false,
}: LiveStreamViewerProps) {
  const [message, setMessage] = useState("");
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [following, setFollowing] = useState(isFollowing);

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, you would send the message to a backend
      console.log("Sending message:", message);
      setMessage("");
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
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Top Header */}
      <header className="relative z-20 flex items-center justify-between px-4 pt-safe-top safe-top">
        <div className="flex items-center gap-4 py-4">
          <Link
            href="/live-streams"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-md transition-colors hover:bg-black/30">
            <Menu className="h-5 w-5 text-white" />
          </Link>

          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-white/30">
              <AvatarImage src={streamer.avatar} alt={streamer.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {streamer.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white drop-shadow-md">
                {streamer.name}
              </p>
              <p className="text-xs text-white/80 drop-shadow-md">
                {streamer.username}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 py-4">
          <button
            onClick={handleFollow}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-md transition-colors hover:bg-black/30">
            <UserPlus
              className={`h-5 w-5 ${following ? "text-primary" : "text-white"}`}
            />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-md transition-colors hover:bg-black/30">
            <MoreVertical className="h-5 w-5 text-white" />
          </button>
        </div>
      </header>

      {/* Live Badge and Viewer Count */}
      <div className="absolute left-4 top-20 z-20 flex items-center gap-2">
        <Badge className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lg">
          Live
        </Badge>
        <Badge className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md shadow-lg">
          <Users className="mr-1.5 h-3.5 w-3.5" />
          {viewers.toLocaleString()}
        </Badge>
      </div>

      {/* Floating Chat Messages */}
      <div className="absolute bottom-32 left-0 right-0 z-10 px-4">
        <div className="flex flex-col gap-2">
          {MOCK_MESSAGES.slice(-5).map((chat, index) => (
            <div
              key={chat.id}
              className="animate-slide-up w-fit max-w-[85%] rounded-2xl bg-black/30 px-4 py-2 backdrop-blur-md"
              style={{
                animationDelay: `${index * 100}ms`,
              }}>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-white drop-shadow-md">
                  {chat.user.name}
                </span>
                <span className="text-sm text-white/90 drop-shadow-md">
                  {chat.message}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-linear-to-t from-black/80 via-black/40 to-transparent pb-safe-bottom safe-bottom">
        <div className="flex items-center gap-3 px-4 pb-6 pt-8">
          {/* Comment Input */}
          <div className="flex-1">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Drop a comment....."
              className="h-12 rounded-full border-white/20 bg-black/30 px-5 text-sm text-white placeholder:text-white/60 backdrop-blur-md focus:border-white/40"
            />
          </div>

          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex flex-col items-center justify-center gap-0.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 backdrop-blur-md transition-all hover:scale-110 active:scale-95">
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
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 backdrop-blur-md transition-all hover:scale-110 active:scale-95">
            <Share2 className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Share Stats */}
        <div className="flex items-center justify-between px-4 pb-4">
          <span className="text-xs text-white/80 drop-shadow-md">
            2.68K views
          </span>
          <span className="text-xs text-white/80 drop-shadow-md">Share</span>
        </div>
      </div>
    </div>
  );
}
