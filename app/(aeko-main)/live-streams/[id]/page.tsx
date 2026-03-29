"use client";

import { use } from "react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LiveChat } from "@/components/live-streams/live-chat";
import { LiveStreamViewer } from "@/components/live-streams/live-stream-viewer";
import {
  LiveStreamCard,
  type LiveStream,
} from "@/components/live-streams/live-card";
import { useLiveStreams } from "@/features/livestream/hooks/use-live-streams";
import {
  Flame,
  Gift,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";

interface LiveStreamPageProps {
  params: Promise<{
    id: string;
  }>;
}

const StatTile = ({
  icon,
  label,
  value,
  helper,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  helper: string;
}) => (
  <div className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm">
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      {icon}
      <span>{label}</span>
    </div>
    <p className="mt-3 text-2xl font-semibold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground">{helper}</p>
  </div>
);

export default function LiveStreamPage({ params }: LiveStreamPageProps) {
  const { id: streamId } = use(params);
  const [streamData, setStreamData] = useState<any | null>(null);
  const { streams } = useLiveStreams();

  useEffect(() => {
    let cancelled = false;

    const fetchStream = async () => {
      try {
        const res = await fetch(`/api/livestream/${streamId}`);
        if (!res.ok) {
          return;
        }

        const data = await res.json();
        const stream = data?.data?.stream || data?.stream || data?.data || data;

        if (!cancelled) {
          setStreamData(stream);
        }
      } catch (error) {
        console.error("Failed to fetch livestream details:", error);
      }
    };

    if (streamId) {
      fetchStream();
    }

    return () => {
      cancelled = true;
    };
  }, [streamId]);

  const stream = useMemo(() => {
    const createdAt = streamData?.createdAt || streamData?.scheduledFor;
    const minutesIn = createdAt
      ? Math.max(1, Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000))
      : null;

    return {
      id: streamData?._id || streamData?.id || streamId,
      title: streamData?.title || "Untitled livestream",
      streamer: {
        name: streamData?.hostName || streamData?.user?.name || "Unknown streamer",
        username: streamData?.hostName ? `@${streamData.hostName}` : (streamData?.user?.username ? `@${streamData.user.username}` : "@unknown"),
        avatar: streamData?.hostProfilePicture || streamData?.user?.avatar || streamData?.user?.profilePicture || "/placeholder.svg",
        followers: streamData?.hostFollowers ? String(streamData.hostFollowers) : undefined,
      },
      category: streamData?.category || "General",
      viewers: streamData?.currentViewers || streamData?.viewerCount || 0,
      likes: streamData?.likes || 0,
      description: streamData?.description || "No description yet.",
      tags: Array.isArray(streamData?.tags) ? streamData.tags : [],
      language: streamData?.language || "English",
      duration: minutesIn ? `${minutesIn} minutes in` : "Just started",
      thumbnail:
        streamData?.thumbnail ||
        streamData?.thumbnailUrl ||
        streamData?.hostProfilePicture ||
        streamData?.user?.avatar ||
        streamData?.user?.profilePicture ||
        "/placeholder.svg",
      playbackUrl: streamData?.hlsUrl || streamData?.urls?.hls || null,
    };
  }, [streamData, streamId]);

  const recommended = useMemo(
    () => streams.filter((item) => String(item.id) !== String(streamId)).slice(0, 3),
    [streams, streamId]
  );

  return (
    <>
      <div className="lg:hidden">
        <LiveStreamViewer
          streamId={streamId}
          title={stream.title}
          streamer={stream.streamer}
          viewers={stream.viewers}
          likes={stream.likes}
          thumbnail={stream.thumbnail}
          playbackUrl={stream.playbackUrl}
          category={stream.category}
        />
      </div>

      <div className="relative hidden min-h-screen overflow-hidden bg-background lg:block">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_5%_20%,hsla(var(--primary),0.22),transparent_60%),radial-gradient(circle_at_95%_30%,hsla(var(--muted-foreground),0.16),transparent_65%)]"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-20 pt-8 xl:px-8">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-10">
            <div className="space-y-8 xl:space-y-10">
              <section className="overflow-hidden rounded-[36px] border border-border/60 bg-card/80 shadow-2xl shadow-primary/10">
                <div className="relative aspect-video">
                  {stream.playbackUrl ? (
                    <video
                      src={stream.playbackUrl}
                      className="h-full w-full object-cover"
                      autoPlay
                      muted
                      playsInline
                      controls
                    />
                  ) : (
                    <img
                      src={stream.thumbnail}
                      alt={stream.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,12,24,0.15)_0%,rgba(6,12,24,0.75)_65%,rgba(6,12,24,0.9)_100%)]" />
                  <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2 xl:left-6 xl:top-6 xl:gap-3">
                    <Badge className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                      Live
                    </Badge>
                    <Badge className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white">
                      <Users className="mr-1 h-3 w-3" />
                      {stream.viewers.toLocaleString()} watching
                    </Badge>
                  </div>
                  <div className="absolute right-4 top-4 flex flex-wrap justify-end gap-2 xl:right-6 xl:top-6 xl:gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-white/30 text-white hover:bg-white/10">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-white/30 text-white hover:bg-white/10">
                      <Gift className="mr-2 h-4 w-4" />
                      Send gift
                    </Button>
                  </div>
                </div>

                <div className="grid gap-6 px-5 py-5 2xl:grid-cols-[minmax(0,1fr)_240px] xl:px-6 xl:py-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                        {stream.category}
                      </Badge>
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {stream.duration}
                      </span>
                    </div>
                    <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
                      {stream.title}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {stream.description}
                    </p>
                    {stream.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {stream.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="rounded-full border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 rounded-[28px] border border-border/60 bg-background/70 p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border border-border">
                        <AvatarImage
                          src={stream.streamer.avatar}
                          alt={stream.streamer.name}
                        />
                        <AvatarFallback>
                          {stream.streamer.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 leading-tight">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {stream.streamer.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {stream.streamer.username} | {stream.streamer.followers} followers
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button className="flex-1 rounded-full">
                        <Flame className="mr-2 h-4 w-4" />
                        Follow
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-full border-border/70 text-foreground">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Language: {stream.language}</span>
                      <span>Likes: {stream.likes.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-6 rounded-[32px] border border-border/60 bg-card/80 p-6 shadow-lg shadow-primary/5">
                <header className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Live session stats
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Pulse checks pulled from the last five minutes.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-full border-border/70 text-foreground">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Boost stream
                  </Button>
                </header>
                <div className="grid gap-4 sm:grid-cols-2">
                  <StatTile
                    icon={<Users className="h-5 w-5 text-primary" />}
                    label="Peak concurrent viewers"
                    value="1,980"
                    helper="Up 22% since last session"
                  />
                  <StatTile
                    icon={<MessageCircle className="h-5 w-5 text-primary" />}
                    label="Chat velocity"
                    value="146 msg/min"
                    helper='Top question: "How do you structure design tokens?"'
                  />
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-foreground">
                    Keep exploring
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    More rooms remixing the same energy.
                  </p>
                </div>
                <div className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-3">
                  {recommended.map((item) => (
                    <LiveStreamCard key={item.id} stream={item} />
                  ))}
                </div>
              </section>
            </div>

            <aside className="xl:sticky xl:top-20">
              <div className="rounded-[32px] border border-border/60 bg-card/80 shadow-2xl shadow-primary/10">
                <LiveChat streamId={streamId} />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
