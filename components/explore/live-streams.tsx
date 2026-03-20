"use client";

import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, Users } from "lucide-react";
import type { LiveStream } from "@/types/explore";

interface LiveStreamsProps {
  streams: LiveStream[];
}

export function LiveStreams({ streams }: LiveStreamsProps) {
  if (!streams || streams.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Live Now</h2>
          <p className="text-sm text-muted-foreground">
            Join live streams and interact with creators in real-time.
          </p>
        </div>
        <Link
          href="/live-streams"
          className="text-sm font-semibold text-secondary transition hover:text-secondary/80">
          See all streams
        </Link>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {streams.map((stream) => (
          <LiveStreamCard key={stream._id} stream={stream} />
        ))}
      </div>
    </section>
  );
}

function LiveStreamCard({ stream }: { stream: LiveStream }) {
  return (
    <Link
      href={`/live-streams/${stream._id}`}
      className="group relative overflow-hidden rounded-[28px] border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,248,247,0.88))] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl">
      <div className="relative aspect-video">
        <Image
          fill
          src={stream.thumbnail || "/placeholder.svg"}
          alt={stream.title}
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/20 to-black/70" />

        {/* Live Badge */}
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-red-500 px-3 py-1.5">
          <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
          <span className="text-xs font-semibold uppercase tracking-wide text-white">
            Live
          </span>
        </div>

        {/* Viewer Count */}
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-sm">
          <Users className="h-3.5 w-3.5 text-white" />
          <span className="text-xs font-medium text-white">
            {stream.viewerCount.toLocaleString()}
          </span>
        </div>

        {/* Streamer Info */}
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-4">
          <Avatar className="h-10 w-10 border-2 border-white/70">
            <AvatarImage
              src={stream.streamer.profilePicture}
              alt={stream.streamer.name}
            />
            <AvatarFallback className="bg-primary text-white">
              {stream.streamer.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {stream.streamer.name}
            </p>
            <p className="text-xs text-white/80 truncate">
              @{stream.streamer.username}
            </p>
          </div>
          <Play className="h-5 w-5 text-white flex-shrink-0" />
        </div>
      </div>

      <div className="space-y-2 p-4">
        <h3 className="text-base font-semibold text-foreground line-clamp-2">
          {stream.title}
        </h3>
        {stream.category && (
          <span className="inline-block rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {stream.category}
          </span>
        )}
      </div>
    </Link>
  );
}
