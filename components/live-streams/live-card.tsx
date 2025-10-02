import type { ReactNode } from "react";

import Link from "next/link";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Heart, MessageCircle, Share2, Users, Bell } from "lucide-react";

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

const PosterShell = ({
  children,
}: {
  children: ReactNode;
}) => (
  <div className="relative overflow-hidden rounded-[22px]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsla(var(--primary),0.3),transparent_60%),radial-gradient(circle_at_80%_15%,hsla(var(--muted-foreground),0.22),transparent_55%),linear-gradient(180deg,rgba(6,12,24,0.88),rgba(6,12,24,0.92))]" />
    {children}
  </div>
);

const LiveStreamCard = ({ stream }: { stream: LiveStream }) => {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-border/60 bg-card/80 shadow-lg shadow-primary/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/live-streams/${stream.id}`} className="relative block">
        <PosterShell>
          <div className="relative aspect-[9/16]">
            <div className="absolute inset-0" />
            <div className="absolute inset-x-0 top-4 flex items-center gap-2 px-4">
              <Badge className="rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                Live
              </Badge>
              <Badge className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white">
                <Users className="mr-1 h-3 w-3" />
                {stream.viewers.toLocaleString()} watching
              </Badge>
            </div>
          </div>
        </PosterShell>
      </Link>

      <div className="flex flex-1 flex-col gap-4 px-5 py-6">
        <div className="flex items-center justify-between gap-3">
          <Badge
            variant="outline"
            className="rounded-full border-primary/40 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary"
          >
            {stream.category}
          </Badge>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Live for {new Date().getMinutes()} min
          </span>
        </div>

        <Link href={`/live-streams/${stream.id}`} className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
            {stream.title}
          </h3>
          <p className="text-sm text-muted-foreground">{stream.description}</p>
        </Link>

        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src={stream.streamer.avatar} alt={stream.streamer.name} />
            <AvatarFallback>{stream.streamer.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-foreground">{stream.streamer.name}</p>
            <p className="text-xs text-muted-foreground">{stream.streamer.username}</p>
          </div>
        </div>

        {stream.tags && stream.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {stream.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-full border-border/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-3 text-muted-foreground">
            <button className="rounded-full border border-border/60 p-2 transition hover:border-primary/50 hover:text-primary">
              <Heart className="h-4 w-4" />
            </button>
            <button className="rounded-full border border-border/60 p-2 transition hover:border-primary/50 hover:text-primary">
              <MessageCircle className="h-4 w-4" />
            </button>
            <button className="rounded-full border border-border/60 p-2 transition hover:border-primary/50 hover:text-primary">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
          <Button size="sm" className="rounded-full px-5 text-sm">
            Watch live
          </Button>
        </div>
      </div>
    </article>
  );
};

const UpcomingStreamCard = ({ stream }: { stream: LiveStream }) => {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-border/60 bg-card/70 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <PosterShell>
        <div className="relative aspect-[9/16]">
          <div className="absolute inset-x-0 top-4 flex items-center justify-between px-4">
            <Badge className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Upcoming
            </Badge>
            <Badge className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white">
              {stream.scheduledFor}
            </Badge>
          </div>
        </div>
      </PosterShell>

      <div className="flex flex-1 flex-col gap-4 px-5 py-6">
        <div className="flex items-center justify-between gap-3">
          <Badge
            variant="outline"
            className="rounded-full border-border/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground"
          >
            {stream.category}
          </Badge>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Bell className="h-4 w-4" />
            Reminder ready
          </span>
        </div>

        <Link href={`/live-streams/${stream.id}`} className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
            {stream.title}
          </h3>
          <p className="text-sm text-muted-foreground">{stream.description}</p>
        </Link>

        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src={stream.streamer.avatar} alt={stream.streamer.name} />
            <AvatarFallback>{stream.streamer.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-foreground">{stream.streamer.name}</p>
            <p className="text-xs text-muted-foreground">{stream.streamer.username}</p>
          </div>
        </div>

        {stream.tags && stream.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {stream.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-full border-border/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Receive a push alert when we go live</span>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full border-border/70 px-5 text-sm text-foreground"
          >
            Notify me
          </Button>
        </div>
      </div>
    </article>
  );
};

export { LiveStreamCard, UpcomingStreamCard };
export type { LiveStream };
