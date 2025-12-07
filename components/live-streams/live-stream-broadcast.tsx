"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Send,
  Mic,
  MicOff,
  Camera as CameraIcon,
  X,
  Loader2,
} from "lucide-react";
import { startLivestream, endLivestream } from "@/lib/livestream-service";
import type { LivestreamCreateData } from "@/types/livestream";
import type { useCamera } from "@/hooks/use-camera";
import { cn } from "@/lib/utils";

interface LiveStreamBroadcastProps {
  streamId: string;
  camera: ReturnType<typeof useCamera>;
  streamData: LivestreamCreateData | null;
  isLive: boolean;
  onGoLive?: () => void;
  onEndStream?: () => void;
  onBack?: () => void;
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

export function LiveStreamBroadcast({
  streamId,
  camera,
  streamData,
  isLive,
  onGoLive,
  onEndStream,
  onBack,
}: LiveStreamBroadcastProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [viewerCount, setViewerCount] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(
    isLive ? MOCK_MESSAGES : []
  );
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  // Simulate viewer count increase when live
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setViewerCount((prev) => prev + Math.floor(Math.random() * 5));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isLive]);

  // Simulate new messages when live
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        const newMessage: ChatMessage = {
          id: Date.now(),
          user: {
            name: ["Alex", "Jordan", "Sam", "Taylor"][
              Math.floor(Math.random() * 4)
            ],
            username: "@user" + Math.floor(Math.random() * 1000),
            avatar: ["🎨", "🎮", "🎵", "💻"][Math.floor(Math.random() * 4)],
          },
          message: [
            "Great stream!",
            "Love this!",
            "Keep it up!",
            "Amazing content!",
          ][Math.floor(Math.random() * 4)],
          timestamp: "Just now",
        };

        setChatMessages((prev) => [...prev.slice(-10), newMessage]);
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [isLive]);

  const handleGoLive = async () => {
    try {
      setIsStarting(true);
      await startLivestream(streamId);
      onGoLive?.();
    } catch (error) {
      console.error("Error starting stream:", error);
      alert("Failed to start stream. Please try again.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleEndStream = async () => {
    try {
      setIsEnding(true);
      await endLivestream(streamId);
      onEndStream?.();
    } catch (error) {
      console.error("Error ending stream:", error);
      alert("Failed to end stream. Please try again.");
    } finally {
      setIsEnding(false);
      setShowEndConfirm(false);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, send to backend
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Camera Feed Background */}
      <div className="absolute inset-0">
        {camera.hasPermission ? (
          <video
            ref={camera.videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
            <div className="text-center text-white">
              <CameraIcon className="mx-auto mb-4 h-16 w-16 opacity-50" />
              <p className="text-lg">Camera access denied</p>
            </div>
          </div>
        )}

        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/90" />
      </div>

      {/* Top Header */}
      <header className="relative z-20 flex items-center justify-between px-4 py-4 safe-top">
        <div className="flex items-center gap-4">
          <button
            onClick={() => (isLive ? setShowEndConfirm(true) : onBack?.())}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-md transition-colors hover:bg-black/30">
            <Menu className="h-5 w-5 text-white" />
          </button>

          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-white/30">
              <AvatarImage src="/placeholder.svg" alt="Streamer" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                DM
              </AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white drop-shadow-md">
                {streamData?.title || "Livestream"}
              </p>
              <p className="text-xs text-white/80 drop-shadow-md">@username</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={camera.toggleMute}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-md transition-colors hover:bg-black/30">
            {camera.isMuted ? (
              <MicOff className="h-5 w-5 text-red-500" />
            ) : (
              <Mic className="h-5 w-5 text-white" />
            )}
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-md transition-colors hover:bg-black/30">
            <MoreVertical className="h-5 w-5 text-white" />
          </button>
        </div>
      </header>

      {/* Live Badge and Viewer Count */}
      <div className="absolute left-4 top-20 z-20 flex items-center gap-2">
        <Badge
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide shadow-lg",
            isLive ? "bg-red-500 text-white" : "bg-yellow-500 text-black"
          )}>
          {isLive ? "Live" : "Ready"}
        </Badge>
        {isLive && (
          <Badge className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md shadow-lg">
            <Users className="mr-1.5 h-3.5 w-3.5" />
            {viewerCount.toLocaleString()}
          </Badge>
        )}
      </div>

      {/* Floating Chat Messages (only when live) */}
      {isLive && chatMessages.length > 0 && (
        <div className="absolute bottom-32 left-0 right-0 z-10 px-4">
          <div className="flex flex-col gap-2">
            {chatMessages.slice(-5).map((chat, index) => (
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
      )}

      {/* Go Live Button (only when not live) */}
      {!isLive && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="text-center">
            <Button
              size="lg"
              className="h-16 rounded-full px-12 text-lg font-semibold shadow-2xl"
              onClick={handleGoLive}
              disabled={isStarting || !camera.hasPermission}>
              {isStarting ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Starting...
                </>
              ) : (
                "Go Live"
              )}
            </Button>
            {onBack && (
              <Button
                variant="ghost"
                className="mt-4 text-white"
                onClick={onBack}
                disabled={isStarting}>
                Back to Edit
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Bottom Action Bar (only when live) */}
      {isLive && (
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

            {/* Share Button */}
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 backdrop-blur-md transition-all hover:scale-110 active:scale-95">
              <Share2 className="h-5 w-5 text-white" />
            </button>

            {/* End Stream Button */}
            <button
              onClick={() => setShowEndConfirm(true)}
              className="flex h-12 items-center gap-2 rounded-full bg-red-500 px-6 font-semibold text-white transition-all hover:bg-red-600 active:scale-95">
              <X className="h-5 w-5" />
              End
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between px-4 pb-4">
            <span className="text-xs text-white/80 drop-shadow-md">
              {viewerCount > 0
                ? `${viewerCount.toLocaleString()} views`
                : "Starting..."}
            </span>
            <span className="text-xs text-white/80 drop-shadow-md">Share</span>
          </div>
        </div>
      )}

      {/* End Stream Confirmation Modal */}
      {showEndConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-[28px] border border-border/60 bg-card p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-foreground">
              End Livestream?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to end this livestream? This action cannot
              be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowEndConfirm(false)}
                disabled={isEnding}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleEndStream}
                disabled={isEnding}>
                {isEnding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ending...
                  </>
                ) : (
                  "End Stream"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
