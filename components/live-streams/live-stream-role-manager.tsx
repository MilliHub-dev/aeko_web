"use client";

import { useEffect, useMemo, useState } from "react";
import { Users2, UserPlus, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { inviteCoHost, inviteGuest } from "@/lib/livestream-service";

interface RoleUser {
  id: string;
  username: string;
  name?: string;
  profilePicture?: string;
}

interface LiveStreamRoleManagerProps {
  streamId: string;
}

interface UserSearchResult {
  id: string;
  username: string;
  name: string;
  profilePicture?: string;
}

function normalizeRoleUsers(stream: any, keys: string[]): RoleUser[] {
  const raw = keys.flatMap((key) => {
    const value = stream?.[key];
    return Array.isArray(value) ? value : [];
  });

  return raw.reduce<RoleUser[]>((users, user: any, index: number) => {
    const id = String(user?.id || user?._id || user?.userId || index);

    if (users.some((existingUser) => existingUser.id === id)) {
      return users;
    }

    users.push({
      id,
      username: user?.username || user?.name || `user-${index + 1}`,
      name: user?.name,
      profilePicture: user?.profilePicture || user?.avatar,
    });

    return users;
  }, []);
}

export function LiveStreamRoleManager({ streamId }: LiveStreamRoleManagerProps) {
  const [open, setOpen] = useState(false);
  const [coHostQuery, setCoHostQuery] = useState("");
  const [guestQuery, setGuestQuery] = useState("");
  const [selectedCoHost, setSelectedCoHost] = useState<UserSearchResult | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<UserSearchResult | null>(null);
  const [coHostSuggestions, setCoHostSuggestions] = useState<UserSearchResult[]>([]);
  const [guestSuggestions, setGuestSuggestions] = useState<UserSearchResult[]>([]);
  const [isSearchingCoHost, setIsSearchingCoHost] = useState(false);
  const [isSearchingGuest, setIsSearchingGuest] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<"cohost" | "guest" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [streamData, setStreamData] = useState<any | null>(null);

  useEffect(() => {
    if (!open) {
      setCoHostQuery("");
      setGuestQuery("");
      setSelectedCoHost(null);
      setSelectedGuest(null);
      setCoHostSuggestions([]);
      setGuestSuggestions([]);
      setError(null);
      setSuccess(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    const fetchStream = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/livestream/${streamId}`);
        if (!res.ok) {
          if (!cancelled) {
            setError("Unable to load current livestream participants");
          }
          return;
        }

        const data = await res.json();
        const stream = data?.data?.stream || data?.stream || data?.data || data;

        if (!cancelled) {
          setStreamData(stream);
        }
      } catch (fetchError) {
        console.error("Failed to load livestream roles:", fetchError);
        if (!cancelled) {
          setError("Unable to load current livestream participants");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchStream();

    return () => {
      cancelled = true;
    };
  }, [open, streamId]);

  const coHosts = useMemo(
    () => normalizeRoleUsers(streamData, ["coHosts", "cohosts", "coHosts", "coHostUsers"]),
    [streamData]
  );
  const guests = useMemo(
    () => normalizeRoleUsers(streamData, ["guests", "guestUsers", "guestInvites"]),
    [streamData]
  );

  const mapSearchUsers = (data: any): UserSearchResult[] => {
    const rawUsers = Array.isArray(data?.users)
      ? data.users
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : [];

    return rawUsers
      .map((user: any) => ({
        id: String(user?._id || user?.id || ""),
        username: user?.username || "",
        name: user?.name || user?.username || "Unknown",
        profilePicture: user?.profilePicture || user?.avatar,
      }))
      .filter((user: UserSearchResult) => user.id && user.username);
  };

  useEffect(() => {
    if (!open || !coHostQuery.trim() || selectedCoHost?.username === coHostQuery.trim()) {
      setCoHostSuggestions([]);
      setIsSearchingCoHost(false);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        setIsSearchingCoHost(true);
        const res = await fetch(`/api/users?q=${encodeURIComponent(coHostQuery.trim())}`);
        const data = await res.json();

        if (!cancelled) {
          setCoHostSuggestions(mapSearchUsers(data));
        }
      } catch (searchError) {
        console.error("Failed to search co-host users:", searchError);
        if (!cancelled) {
          setCoHostSuggestions([]);
        }
      } finally {
        if (!cancelled) {
          setIsSearchingCoHost(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [coHostQuery, open, selectedCoHost]);

  useEffect(() => {
    if (!open || !guestQuery.trim() || selectedGuest?.username === guestQuery.trim()) {
      setGuestSuggestions([]);
      setIsSearchingGuest(false);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        setIsSearchingGuest(true);
        const res = await fetch(`/api/users?q=${encodeURIComponent(guestQuery.trim())}`);
        const data = await res.json();

        if (!cancelled) {
          setGuestSuggestions(mapSearchUsers(data));
        }
      } catch (searchError) {
        console.error("Failed to search guest users:", searchError);
        if (!cancelled) {
          setGuestSuggestions([]);
        }
      } finally {
        if (!cancelled) {
          setIsSearchingGuest(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [guestQuery, open, selectedGuest]);

  const handleInviteCoHost = async () => {
    if (!selectedCoHost?.id) {
      setError("Select a username to invite as co-host");
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      setIsSubmitting("cohost");
      const response = await inviteCoHost(streamId, selectedCoHost.id);
      const invitedUser = (response as any)?.data?.user;

      if (invitedUser) {
        setStreamData((prev: any) => ({
          ...(prev || {}),
          coHosts: [...(prev?.coHosts || []), invitedUser],
        }));
      }

      setSuccess("Co-host invite sent");
      setCoHostQuery("");
      setSelectedCoHost(null);
      setCoHostSuggestions([]);
    } catch (inviteError) {
      setError(inviteError instanceof Error ? inviteError.message : "Failed to invite co-host");
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleInviteGuest = async () => {
    if (!selectedGuest?.id) {
      setError("Select a username to invite as guest");
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      setIsSubmitting("guest");
      const response = await inviteGuest(streamId, selectedGuest.id);
      const invitedUser = (response as any)?.data?.user;

      if (invitedUser) {
        setStreamData((prev: any) => ({
          ...(prev || {}),
          guests: [...(prev?.guests || []), invitedUser],
        }));
      }

      setSuccess("Guest invite sent");
      setGuestQuery("");
      setSelectedGuest(null);
      setGuestSuggestions([]);
    } catch (inviteError) {
      setError(inviteError instanceof Error ? inviteError.message : "Failed to invite guest");
    } finally {
      setIsSubmitting(null);
    }
  };

  const renderSuggestions = (
    suggestions: UserSearchResult[],
    isSearching: boolean,
    query: string,
    onSelect: (user: UserSearchResult) => void
  ) => {
    if (!query.trim()) {
      return null;
    }

    return (
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-background">
        <ScrollArea className="max-h-56">
          <div className="p-2">
            {isSearching ? (
              <div className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching usernames...
              </div>
            ) : suggestions.length === 0 ? (
              <div className="rounded-xl px-3 py-3 text-sm text-muted-foreground">
                No users found
              </div>
            ) : (
              suggestions.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => onSelect(user)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-muted/70"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.profilePicture} alt={user.username} />
                    <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-md transition-colors hover:bg-black/30"
        >
          <Users2 className="h-5 w-5 text-white" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-xl rounded-[28px] border border-border/60 p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Manage Co-hosts & Guests</DialogTitle>
          <DialogDescription>
            Search by username and invite people into this stream.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6">
          <Tabs defaultValue="cohosts" className="gap-4">
            <TabsList className="w-full">
              <TabsTrigger value="cohosts" className="flex-1">
                Co-hosts ({coHosts.length})
              </TabsTrigger>
              <TabsTrigger value="guests" className="flex-1">
                Guests ({guests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cohosts" className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={coHostQuery}
                    onChange={(e) => {
                      setCoHostQuery(e.target.value);
                      setSelectedCoHost(null);
                      setError(null);
                      setSuccess(null);
                    }}
                    placeholder="Search username"
                    className="pl-9"
                  />
                </div>
                {selectedCoHost && (
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedCoHost.profilePicture} alt={selectedCoHost.username} />
                      <AvatarFallback>{selectedCoHost.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{selectedCoHost.name}</p>
                      <p className="truncate text-xs text-muted-foreground">@{selectedCoHost.username}</p>
                    </div>
                  </div>
                )}
                {renderSuggestions(coHostSuggestions, isSearchingCoHost, coHostQuery, (user) => {
                  setSelectedCoHost(user);
                  setCoHostQuery(user.username);
                  setCoHostSuggestions([]);
                })}
              </div>
              <div className="flex justify-end">
                <Button onClick={handleInviteCoHost} disabled={isSubmitting === "cohost"}>
                  {isSubmitting === "cohost" ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                  Invite
                </Button>
              </div>
              <div className="space-y-2">
                {isLoading ? (
                  <div className="flex items-center gap-2 rounded-2xl border border-border/60 px-3 py-4 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading co-hosts...
                  </div>
                ) : coHosts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No co-hosts added yet.</p>
                ) : (
                  coHosts.map((user) => (
                    <div key={user.id} className="flex items-center gap-3 rounded-2xl border border-border/60 px-3 py-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profilePicture} alt={user.username} />
                        <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.username}</p>
                        <p className="text-xs text-muted-foreground">Co-host</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="guests" className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={guestQuery}
                    onChange={(e) => {
                      setGuestQuery(e.target.value);
                      setSelectedGuest(null);
                      setError(null);
                      setSuccess(null);
                    }}
                    placeholder="Search username"
                    className="pl-9"
                  />
                </div>
                {selectedGuest && (
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedGuest.profilePicture} alt={selectedGuest.username} />
                      <AvatarFallback>{selectedGuest.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{selectedGuest.name}</p>
                      <p className="truncate text-xs text-muted-foreground">@{selectedGuest.username}</p>
                    </div>
                  </div>
                )}
                {renderSuggestions(guestSuggestions, isSearchingGuest, guestQuery, (user) => {
                  setSelectedGuest(user);
                  setGuestQuery(user.username);
                  setGuestSuggestions([]);
                })}
              </div>
              <div className="flex justify-end">
                <Button onClick={handleInviteGuest} disabled={isSubmitting === "guest"}>
                  {isSubmitting === "guest" ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                  Invite
                </Button>
              </div>
              <div className="space-y-2">
                {isLoading ? (
                  <div className="flex items-center gap-2 rounded-2xl border border-border/60 px-3 py-4 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading guests...
                  </div>
                ) : guests.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No guests added yet.</p>
                ) : (
                  guests.map((user) => (
                    <div key={user.id} className="flex items-center gap-3 rounded-2xl border border-border/60 px-3 py-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profilePicture} alt={user.username} />
                        <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.username}</p>
                        <p className="text-xs text-muted-foreground">Guest</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          {success && <p className="mt-4 text-sm text-emerald-600">{success}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
