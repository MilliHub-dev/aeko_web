"use client";

import { useState, useEffect } from "react";
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
  const [streamId, setStreamId] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    params.then(({ id }) => setStreamId(id));
  }, [params]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const stream = {
    id: Number(streamId) || 1,
    title: "Building a Next.js app from scratch in 90 minutes",
    streamer: {
      name: "Dr Mille",
      username: "@drmille",
      avatar: "/placeholder.svg",
      followers: "12.5k",
    },
    category: "Education",
    viewers: 1245,
    likes: 342,
    description:
      "Learn how to stitch together a production-ready Next.js app with design tokens, streaming SSR, and live QA. We ship a responsive layout, component library, and deploy to the edge.",
    tags: ["nextjs", "design-system", "frontend"],
    language: "English",
    duration: "58 minutes in",
    thumbnail: "/placeholder.svg",
  };

  const recommended: LiveStream[] = [
    {
      id: 21,
      title: "Deep dive into server actions",
      streamer: {
        name: "CodeZen",
        username: "@codezen",
        avatar: "/placeholder.svg",
      },
      category: "Education",
      viewers: 2680,
      thumbnail: "/placeholder.svg",
      isLive: true,
      description:
        "Ship auth flows and webhooks powered by the newest Next.js server actions.",
      tags: ["server", "actions", "webhooks"],
    },
    {
      id: 19,
      title: "Design system teardown: TikTok UI",
      streamer: {
        name: "Studio 54",
        username: "@studio54",
        avatar: "/placeholder.svg",
      },
      category: "Creative",
      viewers: 1940,
      thumbnail: "/placeholder.svg",
      isLive: true,
      description:
        "Reverse engineer motion, typography, and iconography from trending apps.",
      tags: ["design", "ui", "motion"],
    },
    {
      id: 37,
      title: "Launch a Supabase SaaS backend",
      streamer: {
        name: "Shipstream",
        username: "@shipstream",
        avatar: "/placeholder.svg",
      },
      category: "Talk Shows",
      viewers: 1480,
      thumbnail: "/placeholder.svg",
      isLive: true,
      description:
        "Live build with founders on pricing, auth, and tenant onboarding.",
      tags: ["supabase", "saas", "growth"],
    },
  ];

  // Mobile/Tablet Layout (< 1024px)
  if (isMobile) {
    return (
      <LiveStreamViewer
        streamId={streamId}
        title={stream.title}
        streamer={stream.streamer}
        viewers={stream.viewers}
        likes={stream.likes}
        thumbnail={stream.thumbnail}
        category={stream.category}
      />
    );
  }

  // Desktop Layout (>= 1024px)
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_5%_20%,hsla(var(--primary),0.22),transparent_60%),radial-gradient(circle_at_95%_30%,hsla(var(--muted-foreground),0.16),transparent_65%)]"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto w-full px-6 pb-20 pt-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-10">
            <section className="overflow-hidden rounded-[36px] border border-border/60 bg-card/80 shadow-2xl shadow-primary/10">
              <div className="relative aspect-video">
                <video
                  src="/demo.mp4"
                  className="h-full w-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,12,24,0.15)_0%,rgba(6,12,24,0.75)_65%,rgba(6,12,24,0.9)_100%)]" />
                <div className="absolute left-6 top-6 flex items-center gap-3">
                  <Badge className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    Live
                  </Badge>
                  <Badge className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white">
                    <Users className="mr-1 h-3 w-3" />
                    {stream.viewers.toLocaleString()} watching
                  </Badge>
                </div>
                <div className="absolute right-6 top-6 flex items-center gap-3">
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

              <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_240px]">
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
                    <div className="leading-tight">
                      <p className="text-sm font-semibold text-foreground">
                        {stream.streamer.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stream.streamer.username} | {stream.streamer.followers}{" "}
                        followers
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
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  Keep exploring
                </h2>
                <p className="text-sm text-muted-foreground">
                  More rooms remixing the same energy.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {recommended.map((item) => (
                  <LiveStreamCard key={item.id} stream={item} />
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-20">
            <div className="rounded-[32px] border border-border/60 bg-card/80 shadow-2xl shadow-primary/10">
              <LiveChat streamId={streamId} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
