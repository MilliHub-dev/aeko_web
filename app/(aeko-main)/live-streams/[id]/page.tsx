"use client";

import { use } from "react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LiveChat } from "@/components/live-streams/live-chat";
import { LiveStreamViewer } from "@/components/live-streams/live-stream-viewer";
import { LiveStreamCard } from "@/components/live-streams/live-card";
import { useLiveStreams } from "@/features/livestream/hooks/use-live-streams";
import {
  CalendarClock,
  Clock3,
  Flame,
  Gift,
  Heart,
  Radio,
  MessageCircle,
  Tag,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";
import { useUser } from "@/components/shared/user-context";
import { acceptCoHostInvite, acceptGuestInvite } from "@/lib/livestream-service";
import { getSocket } from "@/lib/socket";

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

const formatCompactNumber = (value: number) =>
  value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : `${value}`;

export default function LiveStreamPage({ params }: LiveStreamPageProps) {
  const { id: streamId } = use(params);
  const [streamData, setStreamData] = useState<any | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<number[]>([]);
  const [shareLabel, setShareLabel] = useState("Share");
  const [isAcceptingInvite, setIsAcceptingInvite] = useState(false);
  const { streams } = useLiveStreams();
  const { user } = useUser();

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
  const streamerName = stream.streamer?.name || "Unknown streamer";
  const streamerInitials = streamerName.slice(0, 2).toUpperCase();
  const currentLikes = hasLiked ? stream.likes + 1 : stream.likes;
  const rawParticipants = Array.isArray(streamData?.participants) ? streamData.participants : [];
  const coHostCount = Array.isArray(streamData?.coHosts)
    ? streamData.coHosts.length
    : Array.isArray(streamData?.coHostUsers)
      ? streamData.coHostUsers.length
      : 0;
  const guestCount = Array.isArray(streamData?.guests)
    ? streamData.guests.length
    : Array.isArray(streamData?.guestUsers)
      ? streamData.guestUsers.length
      : 0;
  const participantCount = rawParticipants.length || coHostCount + guestCount + 1;
  const streamStatus = String(streamData?.status || "live").toLowerCase();
  const statusTone =
    streamStatus === "ended"
      ? "bg-zinc-500"
      : streamStatus === "scheduled"
        ? "bg-amber-500 text-black"
        : "bg-red-500";

  const currentUserId = user?.id || user?._id;

  const isUserInInviteList = (items: unknown) => {
    if (!Array.isArray(items) || !currentUserId) {
      return false;
    }

    return items.some((item) => {
      if (typeof item === "string") {
        return item === currentUserId;
      }

      if (!item || typeof item !== "object") {
        return false;
      }

      const candidate = item as Record<string, unknown>;
      return (
        candidate.id === currentUserId ||
        candidate._id === currentUserId ||
        candidate.userId === currentUserId ||
        (candidate.user &&
          typeof candidate.user === "object" &&
          (((candidate.user as Record<string, unknown>).id === currentUserId) ||
            ((candidate.user as Record<string, unknown>)._id === currentUserId)))
      );
    });
  };

  const addRoleUser = (items: unknown, nextUser: unknown) => {
    const existingItems = Array.isArray(items) ? items : [];
    const nextId =
      typeof nextUser === "object" && nextUser
        ? String(
            (nextUser as Record<string, unknown>).id ||
              (nextUser as Record<string, unknown>)._id ||
              (nextUser as Record<string, unknown>).userId ||
              ""
          )
        : "";

    if (!nextId) {
      return existingItems;
    }

    const alreadyExists = existingItems.some((item) => {
      if (typeof item === "string") {
        return item === nextId;
      }

      if (!item || typeof item !== "object") {
        return false;
      }

      const candidate = item as Record<string, unknown>;
      return (
        String(candidate.id || candidate._id || candidate.userId || "") === nextId ||
        (candidate.user &&
          typeof candidate.user === "object" &&
          String(
            (candidate.user as Record<string, unknown>).id ||
              (candidate.user as Record<string, unknown>)._id ||
              ""
          ) === nextId)
      );
    });

    return alreadyExists ? existingItems : [...existingItems, nextUser];
  };

  const removeRoleUser = (items: unknown, userId: string) => {
    if (!Array.isArray(items)) {
      return [];
    }

    return items.filter((item) => {
      if (typeof item === "string") {
        return item !== userId;
      }

      if (!item || typeof item !== "object") {
        return false;
      }

      const candidate = item as Record<string, unknown>;
      const nestedUser =
        candidate.user && typeof candidate.user === "object"
          ? (candidate.user as Record<string, unknown>)
          : null;

      const candidateId = String(
        candidate.id ||
          candidate._id ||
          candidate.userId ||
          nestedUser?.id ||
          nestedUser?._id ||
          ""
      );

      return candidateId !== userId;
    });
  };

  const pendingInviteRole = useMemo<"co_host" | "guest" | null>(() => {
    if (!currentUserId || !streamData) {
      return null;
    }

    if (
      isUserInInviteList(streamData?.coHostInvites) ||
      isUserInInviteList(streamData?.coHostsInvites) ||
      isUserInInviteList(streamData?.invitedCoHosts)
    ) {
      return "co_host";
    }

    if (
      isUserInInviteList(streamData?.guestInvites) ||
      isUserInInviteList(streamData?.invitedGuests)
    ) {
      return "guest";
    }

    return null;
  }, [currentUserId, streamData]);

  const activeRole = useMemo<"host" | "co_host" | "guest" | "viewer">(() => {
    if (!currentUserId || !streamData) {
      return "viewer";
    }

    const hostId = String(
      streamData?.hostId || streamData?.user?._id || streamData?.user?.id || ""
    );
    if (hostId && hostId === String(currentUserId)) {
      return "host";
    }

    if (
      isUserInInviteList(streamData?.coHosts) ||
      isUserInInviteList(streamData?.cohosts) ||
      isUserInInviteList(streamData?.coHostUsers)
    ) {
      return "co_host";
    }

    if (
      isUserInInviteList(streamData?.guests) ||
      isUserInInviteList(streamData?.guestUsers)
    ) {
      return "guest";
    }

    return "viewer";
  }, [currentUserId, streamData]);

  const handleAcceptInvite = async () => {
    if (!pendingInviteRole) {
      return;
    }

    try {
      setIsAcceptingInvite(true);

      if (pendingInviteRole === "co_host") {
        await acceptCoHostInvite(streamId);
      } else {
        await acceptGuestInvite(streamId);
      }

      setStreamData((prev: any) => ({
        ...(prev || {}),
        ...(pendingInviteRole === "co_host"
          ? {
              coHosts: addRoleUser(prev?.coHosts, {
                id: currentUserId,
                username: user?.username || user?.name || "You",
                profilePicture: user?.profilePicture || user?.avatar,
              }),
            }
          : {
              guests: addRoleUser(prev?.guests, {
                id: currentUserId,
                username: user?.username || user?.name || "You",
                profilePicture: user?.profilePicture || user?.avatar,
              }),
            }),
        coHostInvites: [],
        coHostsInvites: [],
        invitedCoHosts: [],
        guestInvites: [],
        invitedGuests: [],
      }));

      toast.success(
        pendingInviteRole === "co_host"
          ? "Co-host invite accepted"
          : "Guest invite accepted"
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to accept invite");
    } finally {
      setIsAcceptingInvite(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    let socketCleanup: (() => void) | null = null;

    const initSocket = async () => {
      try {
        const res = await fetch("/api/auth/token");
        if (!res.ok) {
          return;
        }

        const { token } = await res.json();
        if (!token || cancelled) {
          return;
        }

        const socket = getSocket(token);
        socket.emit("join_stream", { streamId });

        const sameStream = (payload: any) =>
          String(payload?.streamId || payload?.data?.streamId || "") === String(streamId);

        const invitedUserId = (payload: any) =>
          String(
            payload?.userId ||
              payload?.data?.userId ||
              payload?.user?.id ||
              payload?.user?._id ||
              payload?.data?.user?.id ||
              payload?.data?.user?._id ||
              ""
          );

        const invitedUser = (payload: any) =>
          payload?.user || payload?.data?.user || null;

        const handleCoHostInvited = (payload: any) => {
          if (!sameStream(payload) || !currentUserId || invitedUserId(payload) !== String(currentUserId)) {
            return;
          }

          setStreamData((prev: any) => ({
            ...(prev || {}),
            coHostInvites: addRoleUser(prev?.coHostInvites, invitedUser(payload) || { id: currentUserId }),
          }));
          toast.success("You were invited to join as a co-host");
        };

        const handleGuestInvited = (payload: any) => {
          if (!sameStream(payload) || !currentUserId || invitedUserId(payload) !== String(currentUserId)) {
            return;
          }

          setStreamData((prev: any) => ({
            ...(prev || {}),
            guestInvites: addRoleUser(prev?.guestInvites, invitedUser(payload) || { id: currentUserId }),
          }));
          toast.success("You were invited to join as a guest");
        };

        const handleCoHostAccepted = (payload: any) => {
          if (!sameStream(payload)) {
            return;
          }

          const nextUser = invitedUser(payload);
          const nextUserId = invitedUserId(payload);

          setStreamData((prev: any) => ({
            ...(prev || {}),
            coHosts: addRoleUser(prev?.coHosts, nextUser || { id: nextUserId }),
            coHostInvites: removeRoleUser(prev?.coHostInvites, nextUserId),
            coHostsInvites: removeRoleUser(prev?.coHostsInvites, nextUserId),
            invitedCoHosts: removeRoleUser(prev?.invitedCoHosts, nextUserId),
          }));

          if (currentUserId && nextUserId === String(currentUserId)) {
            toast.success("You joined as a co-host");
          }
        };

        const handleGuestAccepted = (payload: any) => {
          if (!sameStream(payload)) {
            return;
          }

          const nextUser = invitedUser(payload);
          const nextUserId = invitedUserId(payload);

          setStreamData((prev: any) => ({
            ...(prev || {}),
            guests: addRoleUser(prev?.guests, nextUser || { id: nextUserId }),
            guestInvites: removeRoleUser(prev?.guestInvites, nextUserId),
            invitedGuests: removeRoleUser(prev?.invitedGuests, nextUserId),
          }));

          if (currentUserId && nextUserId === String(currentUserId)) {
            toast.success("You joined as a guest");
          }
        };

        const handleCoHostRemoved = (payload: any) => {
          if (!sameStream(payload)) {
            return;
          }

          const removedUserId = invitedUserId(payload);
          setStreamData((prev: any) => ({
            ...(prev || {}),
            coHosts: removeRoleUser(prev?.coHosts, removedUserId),
            cohosts: removeRoleUser(prev?.cohosts, removedUserId),
            coHostUsers: removeRoleUser(prev?.coHostUsers, removedUserId),
          }));

          if (currentUserId && removedUserId === String(currentUserId)) {
            toast.info("You were removed as a co-host");
          }
        };

        const handleGuestRemoved = (payload: any) => {
          if (!sameStream(payload)) {
            return;
          }

          const removedUserId = invitedUserId(payload);
          setStreamData((prev: any) => ({
            ...(prev || {}),
            guests: removeRoleUser(prev?.guests, removedUserId),
            guestUsers: removeRoleUser(prev?.guestUsers, removedUserId),
          }));

          if (currentUserId && removedUserId === String(currentUserId)) {
            toast.info("You were removed as a guest");
          }
        };

        const handleParticipantsUpdated = (payload: any) => {
          if (!sameStream(payload)) {
            return;
          }

          const data = payload?.data && typeof payload.data === "object" ? payload.data : payload;

          setStreamData((prev: any) => ({
            ...(prev || {}),
            ...(Array.isArray(data?.coHosts) ? { coHosts: data.coHosts } : {}),
            ...(Array.isArray(data?.guests) ? { guests: data.guests } : {}),
            ...(Array.isArray(data?.participants) ? { participants: data.participants } : {}),
          }));
        };

        socket.on("co_host_invited", handleCoHostInvited);
        socket.on("guest_invited", handleGuestInvited);
        socket.on("co_host_added", handleCoHostAccepted);
        socket.on("co_host_joined", handleCoHostAccepted);
        socket.on("co_host_accepted", handleCoHostAccepted);
        socket.on("guest_added", handleGuestAccepted);
        socket.on("guest_joined", handleGuestAccepted);
        socket.on("guest_accepted", handleGuestAccepted);
        socket.on("co_host_removed", handleCoHostRemoved);
        socket.on("removed_as_co_host", handleCoHostRemoved);
        socket.on("guest_removed", handleGuestRemoved);
        socket.on("removed_as_guest", handleGuestRemoved);
        socket.on("stream_participants_updated", handleParticipantsUpdated);

        socketCleanup = () => {
          socket.emit("leave_stream", { streamId });
          socket.off("co_host_invited", handleCoHostInvited);
          socket.off("guest_invited", handleGuestInvited);
          socket.off("co_host_added", handleCoHostAccepted);
          socket.off("co_host_joined", handleCoHostAccepted);
          socket.off("co_host_accepted", handleCoHostAccepted);
          socket.off("guest_added", handleGuestAccepted);
          socket.off("guest_joined", handleGuestAccepted);
          socket.off("guest_accepted", handleGuestAccepted);
          socket.off("co_host_removed", handleCoHostRemoved);
          socket.off("removed_as_co_host", handleCoHostRemoved);
          socket.off("guest_removed", handleGuestRemoved);
          socket.off("removed_as_guest", handleGuestRemoved);
          socket.off("stream_participants_updated", handleParticipantsUpdated);
        };
      } catch (error) {
        console.error("Failed to initialize livestream socket", error);
      }
    };

    if (streamId) {
      initSocket();
    }

    return () => {
      cancelled = true;
      socketCleanup?.();
    };
  }, [currentUserId, streamId, user]);

  const handleLike = () => {
    if (hasLiked) {
      setHasLiked(false);
      return;
    }

    setHasLiked(true);
    const heartId = Date.now();
    setFloatingHearts((prev) => [...prev, heartId]);
    window.setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((id) => id !== heartId));
    }, 1600);
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : `/live-streams/${streamId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: stream.title,
          text: `Watch ${streamerName} live on Aeko`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareLabel("Copied");
        window.setTimeout(() => setShareLabel("Share"), 1600);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareLabel("Copied");
        window.setTimeout(() => setShareLabel("Share"), 1600);
      } catch {
        setShareLabel("Failed");
        window.setTimeout(() => setShareLabel("Share"), 1600);
      }
    }
  };

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
          inviteRole={pendingInviteRole}
          isAcceptingInvite={isAcceptingInvite}
          onAcceptInvite={handleAcceptInvite}
          currentRole={activeRole}
        />
      </div>

      <div className="relative hidden min-h-screen overflow-hidden bg-background lg:block">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_82%_16%,rgba(34,197,94,0.12),transparent_30%),linear-gradient(180deg,#f7fbfa_0%,#f3f8f7_42%,#edf4f2_100%)]"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1580px] px-6 pb-20 pt-8 xl:px-8">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.5fr)_380px] 2xl:grid-cols-[minmax(0,1.65fr)_420px]">
            <div className="space-y-8">
              <section className="overflow-hidden rounded-[40px] border border-black/5 bg-white/80 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <div className="grid gap-0 2xl:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="relative min-w-0">
                    <div className="relative aspect-video overflow-hidden bg-zinc-950">
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
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,12,24,0.05)_0%,rgba(6,12,24,0.15)_35%,rgba(6,12,24,0.75)_100%)]" />
                      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-5 xl:p-6">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white ${statusTone}`}>
                            {streamStatus === "scheduled" ? "Scheduled" : streamStatus === "ended" ? "Ended" : "Live now"}
                          </Badge>
                          <Badge className="rounded-full border border-white/20 bg-white/12 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                            <Users className="mr-1.5 h-3.5 w-3.5" />
                            {stream.viewers.toLocaleString()} watching
                          </Badge>
                          <Badge className="rounded-full border border-white/20 bg-white/12 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                            <Radio className="mr-1.5 h-3.5 w-3.5" />
                            {participantCount} on stage
                          </Badge>
                        </div>
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLike}
                            className="rounded-full border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/15">
                            <Heart
                              className={`mr-2 h-4 w-4 ${hasLiked ? "fill-red-500 text-red-500" : ""}`}
                            />
                            {formatCompactNumber(currentLikes)}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleShare}
                            className="rounded-full border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/15">
                            <Share2 className="mr-2 h-4 w-4" />
                            {shareLabel}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/15">
                            <Gift className="mr-2 h-4 w-4" />
                            Send gift
                          </Button>
                        </div>
                      </div>
                      {floatingHearts.map((heartId, index) => (
                        <div
                          key={heartId}
                          className="pointer-events-none absolute bottom-8 right-8 z-20 animate-[ping_1.6s_ease-out_forwards]"
                          style={{ transform: `translateY(-${index * 18}px)` }}>
                          <Heart className="h-7 w-7 fill-red-500 text-red-500 drop-shadow-lg" />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-5 px-6 py-6 xl:px-7">
                      {pendingInviteRole && (
                        <div className="rounded-[28px] border border-emerald-500/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(16,185,129,0.04))] p-5">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                You&apos;ve been invited as a {pendingInviteRole === "co_host" ? "co-host" : "guest"}
                              </p>
                              <p className="mt-1 text-sm text-muted-foreground">
                                Accept to join the stream chat and step onto the live stage.
                              </p>
                            </div>
                            <Button
                              onClick={handleAcceptInvite}
                              disabled={isAcceptingInvite}
                              className="rounded-full bg-emerald-600 hover:bg-emerald-700"
                            >
                              {isAcceptingInvite
                                ? "Joining..."
                                : `Accept ${pendingInviteRole === "co_host" ? "Co-host" : "Guest"} Invite`}
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3">
                        <Badge className="rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
                          {stream.category}
                        </Badge>
                        {activeRole !== "viewer" && (
                          <Badge className="rounded-full border border-black/10 bg-black/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground">
                            {activeRole === "co_host"
                              ? "Co-host"
                              : activeRole === "guest"
                                ? "Guest"
                                : "Host"}
                          </Badge>
                        )}
                        <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                          {stream.duration}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-foreground xl:text-[2.4rem]">
                          {stream.title}
                        </h1>
                        <p className="max-w-3xl text-sm leading-7 text-muted-foreground xl:text-[15px]">
                          {stream.description}
                        </p>
                      </div>

                      {stream.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {stream.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="rounded-full border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-l border-black/6 bg-[linear-gradient(180deg,rgba(15,23,42,0.03),rgba(15,23,42,0.01))] p-6">
                    <div className="space-y-5">
                      <div className="rounded-[30px] border border-black/6 bg-white/85 p-5 shadow-sm">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-14 w-14 border border-black/8">
                            <AvatarImage src={stream.streamer.avatar} alt={streamerName} />
                            <AvatarFallback>{streamerInitials}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {streamerName}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {stream.streamer.username}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {stream.streamer.followers || "0"} followers
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                          <Button className="flex-1 rounded-full">
                            <Flame className="mr-2 h-4 w-4" />
                            Follow
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleLike}
                            className="rounded-full border-border/70"
                          >
                            <Heart className={`h-4 w-4 ${hasLiked ? "fill-red-500 text-red-500" : ""}`} />
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <StatTile
                          icon={<Users className="h-5 w-5 text-emerald-600" />}
                          label="Audience now"
                          value={stream.viewers.toLocaleString()}
                          helper={`${participantCount} active on-stage participants`}
                        />
                        <StatTile
                          icon={<Heart className="h-5 w-5 text-emerald-600" />}
                          label="Reactions"
                          value={currentLikes.toLocaleString()}
                          helper="Instant heart count from this session"
                        />
                        <StatTile
                          icon={<MessageCircle className="h-5 w-5 text-emerald-600" />}
                          label="Stream chat"
                          value={streamData?.chatId ? "Connected" : "Pending"}
                          helper={streamData?.chatId ? "Realtime chat room attached" : "Waiting for chat room sync"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
                <div className="overflow-hidden rounded-[34px] border border-black/5 bg-white/82 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
                  <div className="border-b border-black/6 bg-[linear-gradient(135deg,rgba(16,185,129,0.08),rgba(255,255,255,0.7))] px-6 py-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                          Session snapshot
                        </p>
                        <h2 className="mt-2 text-xl font-semibold text-foreground">
                          Stream rhythm
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          A quick read on audience energy, timing, and momentum.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="rounded-full border-border/70 bg-background/80 text-foreground">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Boost stream
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_300px]">
                    <div className="grid gap-0 sm:grid-cols-2">
                      <div className="border-b border-r border-black/6 px-6 py-6 sm:border-b-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          Live viewers
                        </p>
                        <div className="mt-4 flex items-end gap-3">
                          <Users className="h-6 w-6 text-emerald-600" />
                          <span className="text-4xl font-semibold text-foreground">
                            {formatCompactNumber(stream.viewers)}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">
                          Watching the room right now.
                        </p>
                      </div>
                      <div className="border-b border-black/6 px-6 py-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          Audience pulse
                        </p>
                        <div className="mt-4 flex items-end gap-3">
                          <Heart className="h-6 w-6 text-emerald-600" />
                          <span className="text-4xl font-semibold text-foreground">
                            {formatCompactNumber(currentLikes)}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">
                          Hearts and positive reactions from viewers.
                        </p>
                      </div>
                      <div className="border-r border-black/6 px-6 py-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          Time on air
                        </p>
                        <div className="mt-4 flex items-end gap-3">
                          <Clock3 className="h-6 w-6 text-emerald-600" />
                          <span className="text-2xl font-semibold text-foreground">
                            {stream.duration}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">
                          How long this room has been active.
                        </p>
                      </div>
                      <div className="px-6 py-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          Broadcast language
                        </p>
                        <div className="mt-4 flex items-end gap-3">
                          <CalendarClock className="h-6 w-6 text-emerald-600" />
                          <span className="text-2xl font-semibold text-foreground">
                            {stream.language}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">
                          Primary language set for the stream.
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-black/6 bg-black/[0.02] px-6 py-6 xl:border-l xl:border-t-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        Momentum lane
                      </p>
                      <div className="mt-6 space-y-4">
                        <div className="rounded-[22px] border border-black/6 bg-white/75 px-4 py-4">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-foreground">Viewers</span>
                            <span className="text-sm font-semibold text-foreground">
                              {stream.viewers.toLocaleString()}
                            </span>
                          </div>
                          <div className="mt-3 h-2 rounded-full bg-black/[0.06]">
                            <div
                              className="h-2 rounded-full bg-emerald-500"
                              style={{ width: `${Math.min(100, Math.max(12, stream.viewers / 2))}%` }}
                            />
                          </div>
                        </div>
                        <div className="rounded-[22px] border border-black/6 bg-white/75 px-4 py-4">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-foreground">On stage</span>
                            <span className="text-sm font-semibold text-foreground">
                              {participantCount}
                            </span>
                          </div>
                          <div className="mt-3 h-2 rounded-full bg-black/[0.06]">
                            <div
                              className="h-2 rounded-full bg-emerald-400"
                              style={{ width: `${Math.min(100, Math.max(12, participantCount * 18))}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[34px] border border-black/5 bg-white/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                    Stream DNA
                  </p>
                  <div className="mt-4 space-y-4">
                    <div className="rounded-[24px] border border-black/6 bg-background/70 p-4">
                      <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                        <Tag className="h-4 w-4 text-emerald-600" />
                        Topic cluster
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {stream.tags.length > 0
                          ? stream.tags.map((tag) => `#${tag}`).join(" • ")
                          : "No topic tags added yet for this stream."}
                      </p>
                    </div>
                    <div className="rounded-[24px] border border-black/6 bg-background/70 p-4">
                      <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                        <Radio className="h-4 w-4 text-emerald-600" />
                        On-stage lineup
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {coHostCount} co-host{coHostCount === 1 ? "" : "s"}, {guestCount} guest{guestCount === 1 ? "" : "s"}, and {participantCount} total active participant{participantCount === 1 ? "" : "s"}.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                      More streams
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-foreground">
                      Keep exploring
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Rooms carrying a similar energy.
                  </p>
                </div>
                <div className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-3">
                  {recommended.map((item) => (
                    <LiveStreamCard key={item.id} stream={item} />
                  ))}
                </div>
              </section>
            </div>

            <aside className="xl:sticky xl:top-8 xl:h-[calc(100vh-4rem)]">
              <div className="flex h-full min-h-[720px] flex-col overflow-hidden rounded-[36px] border border-black/5 bg-white/85 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <div className="border-b border-black/6 px-6 py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                    Conversation
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-foreground">
                    Live chat
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Drop comments, react in real time, and keep the room moving.
                  </p>
                </div>
                <div className="min-h-0 flex-1">
                  <LiveChat streamId={streamId} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
