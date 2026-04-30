"use client";

import { useState, useEffect, useCallback } from "react";
import type { FocusEvent } from "react";
import Link from "next/link";
import { Grid3x3, ChevronRight, Loader2, Plus, Sparkles } from "lucide-react";
import { ExploreSearchBar } from "@/components/explore/explore-search-bar";
import { SearchResultsDropdown } from "@/components/explore/search-results-dropdown";
import { CommunityCard } from "@/components/communities/community-card";
import { CreateCommunityDialog } from "@/components/communities/create-community-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ExploreCommunity, CommunitiesApiResponse } from "@/types/explore";
import { useUser } from "@/components/shared/user-context";

const exploreFilters = ["For You", "DeFi", "NFTs", "Trading", "Technology"];

type UiCommunity = ExploreCommunity & {
  owner?: string;
  moderators?: string[];
  settings?: unknown;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

function toId(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (trimmed === "undefined" || trimmed === "null") return null;
    return trimmed;
  }
  if (typeof value === "number") return String(value);
  return null;
}

function toIdList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => toId(v)).filter((v): v is string => !!v);
}

function extractCommunityId(raw: any): string | null {
  return (
    toId(raw?._id) ||
    toId(raw?.id) ||
    toId(raw?.communityId) ||
    toId(raw?.data?._id) ||
    toId(raw?.data?.id) ||
    null
  );
}

function extractUserIdFromMember(rawMember: any): string | null {
  if (!rawMember) return null;
  if (typeof rawMember === "string") return rawMember;
  return (
    toId(rawMember?.user) ||
    toId(rawMember?.user?._id) ||
    toId(rawMember?.user?.id) ||
    null
  );
}

export default function CommunitiesPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [primaryTab, setPrimaryTab] = useState<"my" | "explore">("my");
  const [exploreFilter, setExploreFilter] = useState(exploreFilters[0]);

  // Search results state
  const [searchCommunities, setSearchCommunities] = useState<
    ExploreCommunity[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);

  // API state
  const [communities, setCommunities] = useState<ExploreCommunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounced search function
  const searchCommunitiesFunc = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchCommunities([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/communities?q=${encodeURIComponent(query)}`
      );
      const communitiesData: CommunitiesApiResponse = await response.json();

      // Handle communities - API returns { success: true, data: [...] }
      if (communitiesData.success && Array.isArray(communitiesData.data)) {
        const mappedCommunities: ExploreCommunity[] = communitiesData.data.map(
          (community) => ({
            _id: extractCommunityId(community) || "",
            name: community.name,
            description: community.description,
            category: community.category || "General",
            cover: community.profile?.coverPhoto || "/cover.png",
            profile: community.profile,
            memberCount: community.memberCount,
            membersCount: community.memberCount,
            memberAvatars: [],
            isFollowing: false,
            slug: extractCommunityId(community) || undefined,
          })
        );
        setSearchCommunities(mappedCommunities.filter((c) => !!c._id));
      } else {
        setSearchCommunities([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchCommunities([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchCommunitiesFunc(searchQuery);
      } else {
        setSearchCommunities([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchCommunitiesFunc]);

  // Fetch communities from API
  useEffect(() => {
    const fetchCommunities = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/communities");
        const data: CommunitiesApiResponse = await response.json();

        if (data.success && data.data) {
          // Map API response to ExploreCommunity format
          const mappedCommunities: UiCommunity[] = data.data.map(
            (community) => ({
              _id: extractCommunityId(community) || "",
              name: community.name,
              description: community.description,
              category: community.category || "General",
              cover:
                community.profile?.coverPhoto || "/cover.png",
              profile: community.profile,
              memberCount: community.memberCount,
              membersCount: community.memberCount,
              memberAvatars: [], // Can be populated from members if needed
              isFollowing: false,
              slug: extractCommunityId(community) || undefined,
              owner: community.owner,
              moderators: community.moderators,
              settings: community.settings,
              isActive: community.isActive,
              createdAt: community.createdAt,
              updatedAt: community.updatedAt,
            })
          );

          setCommunities(mappedCommunities.filter((c) => !!c._id));
        } else {
          setError("Failed to load communities");
        }
      } catch (err) {
        console.error("Error fetching communities:", err);
        setError("Failed to load communities");
        setCommunities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  useEffect(() => {
    if (!user) return;
    const ownedIds = new Set<string>(
      [
        ...toIdList((user as any)?.ownedCommunities),
        ...toIdList((user as any)?.createdCommunities),
        ...toIdList((user as any)?.communitiesOwned),
      ]
    );
    if (ownedIds.size === 0) return;
    if (isLoading) return;
    if (error) return;

    const existingIds = new Set(communities.map((c) => c._id));
    const missing = Array.from(ownedIds).filter((id) => !existingIds.has(id));
    if (missing.length === 0) return;

    const fetchMissing = async () => {
      try {
        const results = await Promise.all(
          missing.slice(0, 10).map(async (id) => {
            const res = await fetch(`/api/communities/${id}`);
            if (!res.ok) return null;
            return res.json();
          })
        );

        const normalized: UiCommunity[] = results
          .map((raw: any) => raw?.data || raw?.community || raw)
          .filter((c: any) => !!c)
          .map((community: any) => {
            const id = extractCommunityId(community) || "";
            return {
              _id: id,
              name: community.name,
              description: community.description,
              category: community.category || "General",
              cover: community.profile?.coverPhoto || "/cover.png",
              profile: community.profile,
              memberCount: community.memberCount,
              membersCount: community.memberCount,
              memberAvatars: [],
              isFollowing: false,
              slug: id || undefined,
              owner: community.owner,
              moderators: community.moderators,
              settings: community.settings,
              isActive: community.isActive,
              createdAt: community.createdAt,
              updatedAt: community.updatedAt,
            } as UiCommunity;
          })
          .filter((c) => !!c._id);

        if (normalized.length > 0) {
          setCommunities((prev) => {
            const merged = [...normalized, ...prev];
            const seen = new Set<string>();
            return merged.filter((c) => {
              if (seen.has(c._id)) return false;
              seen.add(c._id);
              return true;
            });
          });
        }
      } catch {
        return;
      }
    };

    void fetchMissing();
  }, [user, isLoading, error, communities]);

  const handleFollowToggle = (communityId: string, isFollowing: boolean) => {
    console.log(`Toggle follow for ${communityId}: ${isFollowing}`);
    // TODO: Implement API call to follow/unfollow
    setCommunities((prev) =>
      prev.map((c) => (c._id === communityId ? { ...c, isFollowing } : c))
    );
  };

  const handleSearchFocus = () => {
    setIsSearchOpen(true);
  };

  const handleSearchBlur = (event: FocusEvent<HTMLDivElement>) => {
    const relatedTarget = event.relatedTarget as Node | null;

    if (!relatedTarget || !event.currentTarget.contains(relatedTarget)) {
      // Delay to allow clicking on results
      setTimeout(() => {
        setIsSearchOpen(false);
      }, 200);
    }
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    setIsSearchOpen(false);
    setSearchCommunities([]);
  };

  const showSearchOverlay = isSearchOpen && searchQuery.trim().length > 0;

  const currentUserId = toId((user as any)?._id) || toId((user as any)?.id);
  const ownedCommunityIds = new Set<string>(
    [
      ...toIdList((user as any)?.ownedCommunities),
      ...toIdList((user as any)?.createdCommunities),
      ...toIdList((user as any)?.communitiesOwned),
    ]
  );
  const membershipCommunityIds = new Set<string>(
    [
      ...toIdList((user as any)?.communityMemberships),
      ...toIdList((user as any)?.communities),
      ...toIdList((user as any)?.communityMembers),
    ]
  );
  const followingCommunityIds = new Set<string>(
    [
      ...toIdList((user as any)?.followingCommunities),
      ...toIdList((user as any)?.followedCommunities),
    ]
  );

  const isMyCommunity = (c: UiCommunity) => {
    const communityId = toId((c as any)?._id) || toId((c as any)?.id) || toId((c as any)?.slug);
    if (communityId) {
      if (ownedCommunityIds.has(communityId)) return true;
      if (membershipCommunityIds.has(communityId)) return true;
      if (followingCommunityIds.has(communityId)) return true;
    }
    if (!currentUserId) return false;
    const ownerId = toId((c as any).owner) || toId((c as any).owner?._id);
    if (ownerId && ownerId === currentUserId) return true;

    const rawMembers = (c as any).members || (c as any).communityMembers || [];
    if (Array.isArray(rawMembers)) {
      return rawMembers.some((m: any) => extractUserIdFromMember(m) === currentUserId);
    }
    return false;
  };

  const isOwnerCommunity = (c: UiCommunity) => {
    if (!currentUserId) return false;
    const ownerId = toId((c as any).owner) || toId((c as any).owner?._id);
    return !!ownerId && ownerId === currentUserId;
  };

  const getSortDate = (c: UiCommunity) =>
    Date.parse((c as any).updatedAt || (c as any).createdAt || "") || 0;

  const myCommunities = (communities as UiCommunity[])
    .filter(isMyCommunity)
    .sort((a, b) => {
      const ownerDiff = Number(isOwnerCommunity(b)) - Number(isOwnerCommunity(a));
      if (ownerDiff !== 0) return ownerDiff;
      return getSortDate(b) - getSortDate(a);
    })
    .map((c) => ({ ...c, isFollowing: true }));

  const exploreCommunities = (communities as UiCommunity[])
    .filter((c) => !isMyCommunity(c))
    .sort((a, b) => getSortDate(b) - getSortDate(a))
    .map((c) => ({ ...c, isFollowing: false }));

  const filteredExploreCommunities =
    exploreFilter === "For You"
      ? exploreCommunities
      : exploreCommunities.filter((c) => c.category === exploreFilter);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background gradient */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,hsla(var(--primary),0.12),transparent_50%),radial-gradient(circle_at_90%_0%,hsla(var(--muted-foreground),0.08),transparent_45%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pt-6">
        <section className="mb-8 overflow-hidden rounded-[32px] border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,248,247,0.92))] shadow-[0_26px_90px_-56px_rgba(15,23,42,0.45)]">
          <div className="flex flex-col gap-6 p-5 md:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Circles
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <button
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-card/80 text-foreground transition hover:bg-card lg:hidden"
                      aria-label="Grid view">
                      <Grid3x3 className="h-5 w-5" />
                    </button>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                      Communities
                    </h1>
                  </div>
                  <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                    Find your people, explore niche spaces, and build momentum around what matters to you.
                  </p>
                </div>
              </div>

              <CreateCommunityDialog
                trigger={
                  <Button className="rounded-full gap-2 self-start lg:self-auto">
                    <Plus className="h-4 w-4" />
                    Create Community
                  </Button>
                }
              />
            </div>

            <div tabIndex={-1} onBlur={handleSearchBlur} className="relative">
              <ExploreSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onFocus={handleSearchFocus}
                onClear={handleSearchClear}
                showCancel={showSearchOverlay}
              />
              {showSearchOverlay && (
                <SearchResultsDropdown
                  users={[]}
                  communities={searchCommunities}
                  isLoading={isSearching}
                  query={searchQuery}
                  className="absolute left-0 right-0 top-full z-30 mt-4"
                />
              )}
            </div>

            <div className="mx-auto flex w-full max-w-md items-center rounded-full border border-border/60 bg-card/80 p-1 text-sm font-semibold">
              {(["my", "explore"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPrimaryTab(tab)}
                  className={cn(
                    "flex-1 rounded-full px-4 py-2 transition-all",
                    primaryTab === tab
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-primary"
                  )}>
                  {tab === "my" ? "My Communities" : "Explore"}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
            <p className="font-medium text-destructive">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-4">
              Retry
            </Button>
          </div>
        ) : (
          /* Desktop grid layout */
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            <main className="space-y-12">
              {primaryTab === "my" ? (
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Your communities
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Communities you created, joined, or follow.
                      </p>
                    </div>
                    {myCommunities.length > 0 && (
                      <Link
                        href="/communities/following"
                        className="text-sm font-semibold text-primary hover:underline">
                        See All
                      </Link>
                    )}
                  </div>
                  {isUserLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : myCommunities.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {myCommunities.map((community) => (
                      <CommunityCard
                          key={community._id}
                          community={community}
                          onFollowToggle={handleFollowToggle}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center">
                      <div className="mb-4 inline-flex rounded-full bg-primary/10 p-6">
                        <svg
                          className="h-12 w-12 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        No communities yet
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Start exploring and join communities that match your
                        interests.
                      </p>
                      <Button
                        onClick={() => setPrimaryTab("explore")}
                        className="mt-6">
                        Explore Communities
                      </Button>
                    </div>
                  )}
                </section>
              ) : (
                <section className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Featured communities
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Discover communities based on your interests.
                      </p>
                    </div>
                    {/* <div className="flex flex-wrap items-center gap-2">
                      {exploreFilters.map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setExploreFilter(filter)}
                          className={cn(
                            "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                            exploreFilter === filter
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "border border-border/50 bg-background/80 text-muted-foreground hover:border-primary/30 hover:text-primary"
                          )}>
                          {filter}
                        </button>
                      ))}
                    </div> */}
                  </div>
                  {filteredExploreCommunities.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {filteredExploreCommunities.map((community) => (
                        <CommunityCard
                          key={community._id}
                          community={community}
                          variant="explore"
                          onFollowToggle={handleFollowToggle}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center">
                      <p className="text-muted-foreground">
                        No communities found in this category
                      </p>
                    </div>
                  )}
                </section>
              )}
            </main>

            {/* Sidebar - Desktop only */}
            <aside className="hidden space-y-6 lg:block">
              <div className="rounded-[28px] border border-border/60 bg-card/80 p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-foreground">
                  Build your own community
                </h3>
                <p className="my-2 text-xs leading-relaxed text-muted-foreground">
                  Spin up a room for AMAs, prayer circles, or creative sessions.
                </p>
                <CreateCommunityDialog />
              </div>
              <div className="rounded-[28px] border border-border/60 bg-primary/10 p-6 text-sm leading-relaxed text-primary">
                Keep an eye on safety guidelines and signal moderators if you
                spot anything suspicious.
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
