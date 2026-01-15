"use client";

import { Badge } from "@/components/ui/badge";

import { LiveStream, LiveStreamCard, UpcomingStreamCard } from "./live-card";

const STREAMS: LiveStream[] = [
  {
    id: 1,
    title: "Ranked grind: Neon mains unlocked",
    streamer: {
      name: "KaylaRush",
      username: "@kaylarush",
      avatar: "/placeholder.svg",
    },
    category: "Gaming",
    viewers: 4820,
    thumbnail: "/placeholder.svg",
    isLive: true,
    description:
      "High-intensity Valorant queues with live comms and chat-picked challenges.",
    tags: ["valorant", "ranked", "fps"],
  },
  {
    id: 2,
    title: "Moonlight rooftop DJ session",
    streamer: {
      name: "Nova.fm",
      username: "@nova",
      avatar: "/placeholder.svg",
    },
    category: "Music",
    viewers: 3270,
    thumbnail: "/placeholder.svg",
    isLive: true,
    description:
      "Future bass set blended with crowd requests and behind-the-track stories.",
    tags: ["live", "futurebass", "nightmix"],
  },
  {
    id: 3,
    title: "Creator hotline: monetise your ideas",
    streamer: {
      name: "Studio 54",
      username: "@studio54",
      avatar: "/placeholder.svg",
    },
    category: "Talk Shows",
    viewers: 1890,
    thumbnail: "/placeholder.svg",
    isLive: true,
    description: "Live coaching on sponsorship pitches with rapid-fire audience Q&A.",
    tags: ["creator", "business", "contracts"],
  },
  {
    id: 4,
    title: "Pick-up game under the lights",
    streamer: {
      name: "StreetBall TV",
      username: "@streetball",
      avatar: "/placeholder.svg",
    },
    category: "Sports",
    viewers: 2540,
    thumbnail: "/placeholder.svg",
    isLive: true,
    description:
      "Mic'd-up commentary, slo-mo replays, and live scoreboard overlays.",
    tags: ["hoops", "cityleague", "replays"],
  },
  {
    id: 5,
    title: "Build a Next.js design system live",
    streamer: {
      name: "DevMaster",
      username: "@devmaster",
      avatar: "/placeholder.svg",
    },
    category: "Education",
    viewers: 0,
    thumbnail: "/placeholder.svg",
    isLive: false,
    scheduledFor: "Today at 8:30 PM",
    description:
      "Refine typography scales, motion tokens, and theme switching with live code reviews.",
    tags: ["nextjs", "design", "frontend"],
  },
  {
    id: 6,
    title: "Illustrate a cyberpunk cityscape",
    streamer: {
      name: "MiraSketch",
      username: "@mira.sketch",
      avatar: "/placeholder.svg",
    },
    category: "Creative",
    viewers: 0,
    thumbnail: "/placeholder.svg",
    isLive: false,
    scheduledFor: "Tomorrow at 2:00 PM",
    description:
      "Layer neon palettes with real-time Procreate tips and brush giveaways.",
    tags: ["digitalart", "illustration", "tutorial"],
  },
];

export function LiveStreamContent({
  activeCategory,
}: {
  activeCategory: string;
}) {
  const filteredStreams =
    activeCategory === "All"
      ? STREAMS
      : STREAMS.filter((stream) => stream.category === activeCategory);

  const liveNow = filteredStreams.filter((stream) => stream.isLive);
  const upcoming = filteredStreams.filter((stream) => !stream.isLive);

  return (
    <div className="mt-12 space-y-12 text-foreground">
      {liveNow.length > 0 && (
        <section className="space-y-6">
          <header className="flex flex-col justify-between gap-4 border-b border-border/60 pb-4 sm:flex-row sm:items-end">
            <div className="space-y-2">
              <Badge className="w-fit rounded-full bg-primary/15 text-xs font-medium uppercase tracking-wide text-primary">
                Live now
              </Badge>
              <h2 className="text-2xl font-semibold">Rooms heating up right now</h2>
              <p className="text-sm text-muted-foreground">
                TikTok-inspired vertical energy, responsive overlays, and community shoutouts in real time.
              </p>
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Updated moments ago
            </p>
          </header>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {liveNow.map((stream) => (
              <LiveStreamCard key={stream.id} stream={stream} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="space-y-6">
          <header className="flex flex-col justify-between gap-4 border-b border-border/60 pb-4 sm:flex-row sm:items-end">
            <div className="space-y-2">
              <Badge variant="outline" className="w-fit rounded-full border-primary/40 text-xs font-medium uppercase tracking-wide text-primary">
                Upcoming
              </Badge>
              <h2 className="text-2xl font-semibold">Secure your spot before the countdown ends</h2>
              <p className="text-sm text-muted-foreground">
                RSVP to unlock pre-show chat perks and get a reminder the moment creators go live.
              </p>
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {upcoming.length} sessions in queue
            </p>
          </header>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((stream) => (
              <UpcomingStreamCard key={stream.id} stream={stream} />
            ))}
          </div>
        </section>
      )}

      {filteredStreams.length === 0 && (
        <div className="rounded-[28px] border border-border/60 bg-card/70 px-8 py-12 text-center shadow-sm">
          <h3 className="text-lg font-semibold">No streams yet</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Explore a different category or follow creators to see their live rooms appear here.
          </p>
        </div>
      )}
    </div>
  );
}
