"use client";

import { Badge } from "@/components/ui/badge";
import { LiveStreamCard, UpcomingStreamCard } from "./live-card";
import { useLiveStreams } from "@/features/livestream/hooks/use-live-streams";
import { Loader2 } from "lucide-react";

export function LiveStreamContent({
  activeCategory,
}: {
  activeCategory: string;
}) {
  const { streams, loading, error } = useLiveStreams();

  if (loading) {
    return (
      <div className="mt-12 flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 rounded-[28px] border border-red-200 bg-red-50 px-8 py-12 text-center text-red-600 shadow-sm dark:border-red-900/50 dark:bg-red-900/10">
        <h3 className="text-lg font-semibold">Failed to load streams</h3>
        <p className="mt-3 text-sm opacity-90">{error}</p>
      </div>
    );
  }

  const filteredStreams =
    activeCategory === "All"
      ? streams
      : streams.filter((stream) => stream.category === activeCategory);

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
          <h3 className="text-lg font-semibold">No streams found</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            {activeCategory === "All"
              ? "There are no live or upcoming streams right now."
              : `There are no streams in the "${activeCategory}" category right now.`}
          </p>
        </div>
      )}
    </div>
  );
}
