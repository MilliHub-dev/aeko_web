"use client";

import { useEffect, useState, useCallback } from "react";
import type { FocusEvent } from "react";

import { cn } from "@/lib/utils";
import { ExploreSearchBar } from "@/components/explore/explore-search-bar";
import { SearchResultsDropdown } from "@/components/explore/search-results-dropdown";
import { ExploreCommunities } from "@/components/explore/explore-communities";
import { SuggestedUsers } from "@/components/explore/suggested-users";
import { LiveStreams } from "@/components/explore/live-streams";
import { ViralPosts } from "@/components/explore/viral-posts";
import { Button } from "@/components/ui/button";
import { Grid3x3, Loader2, Sparkles } from "lucide-react";
import type {
  ExploreResponse,
  ExploreData,
  ExplorePagination,
  SuggestedUser,
  ExploreCommunity,
} from "@/types/explore";
import type { FeedPost } from "@/types/post";
import { ExploreTrendingPosts } from "@/components/explore/explore-trending-posts";

const discoverFilters = [
  "For You",
  "Trending",
  "DeFi",
  "NFTs",
  "Creators",
  "Live",
  "Technology",
  "Communities",
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(discoverFilters[0]);

  // Search results state
  const [searchUsers, setSearchUsers] = useState<SuggestedUser[]>([]);
  const [searchCommunities, setSearchCommunities] = useState<
    ExploreCommunity[]
  >([]);
  const [searchPosts, setSearchPosts] = useState<FeedPost[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // API data state
  const [exploreData, setExploreData] = useState<ExploreData | null>(null);
  const [pagination, setPagination] = useState<ExplorePagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounced search function
  const searchUsersAndCommunities = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchUsers([]);
      setSearchCommunities([]);
      return;
    }

    setIsSearching(true);
    try {
      // Fetch users, communities, and posts in parallel
      const [usersRes, communitiesRes, postsRes] = await Promise.all([
        fetch(`/api/users?q=${encodeURIComponent(query)}`),
        fetch(`/api/communities?q=${encodeURIComponent(query)}`),
        fetch(`/api/posts/search?q=${encodeURIComponent(query)}`),
      ]);

      const usersData = await usersRes.json();
      const communitiesData = await communitiesRes.json();
      const postsData = await postsRes.json();

      // Handle users - API returns { success: true, users: [...] }
      if (usersData.success && Array.isArray(usersData.users)) {
        setSearchUsers(usersData.users);
      } else if (usersData.success && Array.isArray(usersData.data)) {
        setSearchUsers(usersData.data);
      } else if (Array.isArray(usersData)) {
        setSearchUsers(usersData);
      } else {
        setSearchUsers([]);
      }

      // Handle communities - API returns { success: true, communities: [...] }
      if (
        communitiesData.success &&
        Array.isArray(communitiesData.communities)
      ) {
        setSearchCommunities(communitiesData.communities);
      } else if (
        communitiesData.success &&
        Array.isArray(communitiesData.data)
      ) {
        setSearchCommunities(communitiesData.data);
      } else if (Array.isArray(communitiesData)) {
        setSearchCommunities(communitiesData);
      } else {
        setSearchCommunities([]);
      }

      // Handle posts
      if (postsData.posts && Array.isArray(postsData.posts)) {
        setSearchPosts(postsData.posts);
      } else if (Array.isArray(postsData)) {
        setSearchPosts(postsData);
      } else {
        setSearchPosts([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchUsers([]);
      setSearchCommunities([]);
      setSearchPosts([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchUsersAndCommunities(searchQuery);
      } else {
        setSearchUsers([]);
        setSearchCommunities([]);
        setSearchPosts([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchUsersAndCommunities]);

  // Fetch explore data
  const fetchExploreData = async (
    page: number = 1,
    append: boolean = false
  ) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const res = await fetch(`/api/explore?page=${page}`);
      const data: ExploreResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch explore data");
      }

      if (data.success) {
        if (append && exploreData) {
          // Append new data to existing data
          setExploreData({
            trending: [...exploreData.trending, ...data.data.trending],
            suggestedUsers: [
              ...exploreData.suggestedUsers,
              ...data.data.suggestedUsers,
            ],
            communities: [...exploreData.communities, ...data.data.communities],
            liveStreams: [...exploreData.liveStreams, ...data.data.liveStreams],
            viral: [...exploreData.viral, ...data.data.viral],
            forYou: [...exploreData.forYou, ...data.data.forYou],
          });
        } else {
          setExploreData(data.data);
        }
        setPagination(data.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching explore data:", err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchExploreData(1);
  }, []);

  const handleLoadMore = () => {
    if (pagination?.hasMore && !isLoadingMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchExploreData(nextPage, true);
    }
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
    setSearchUsers([]);
    setSearchCommunities([]);
    setSearchPosts([]);
  };

  const showSearchOverlay = isSearchOpen && searchQuery.trim().length > 0;

  // Get posts based on active filter
  const getFilteredPosts = () => {
    if (!exploreData) return [];

    switch (activeFilter) {
      case "Trending":
        return exploreData.trending;
      case "For You":
        return exploreData.forYou;
      default:
        // For other filters, show forYou posts
        return exploreData.forYou.length > 0
          ? exploreData.forYou
          : exploreData.trending;
    }
  };

  const filteredPosts = getFilteredPosts();

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(80%_120%_at_10%_0%,rgba(0,127,109,0.18),transparent_55%),radial-gradient(60%_90%_at_100%_10%,rgba(15,23,42,0.12),transparent_55%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pt-6">
        <section className="mb-8 overflow-hidden rounded-[32px] border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,248,247,0.92))] shadow-[0_26px_90px_-56px_rgba(15,23,42,0.45)]">
          <div className="flex flex-col gap-6 p-5 md:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Discover
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <button
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-card/80 text-foreground transition hover:bg-card lg:hidden"
                      aria-label="Grid view"
                    >
                      <Grid3x3 className="h-5 w-5" />
                    </button>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                      Explore
                    </h1>
                  </div>
                  <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                    Tap into live conversations, rising creators, and communities shaping the Aeko feed.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:w-fit">
                <div className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Filter
                  </p>
                  <p className="mt-2 text-lg font-semibold text-foreground">{activeFilter}</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Search
                  </p>
                  <p className="mt-2 text-lg font-semibold text-foreground">
                    {searchQuery ? "Active" : "Ready"}
                  </p>
                </div>
              </div>
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
                  users={searchUsers}
                  communities={searchCommunities}
                  posts={searchPosts}
                  isLoading={isSearching}
                  query={searchQuery}
                  className="absolute left-0 right-0 top-full z-30 mt-4"
                />
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {discoverFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    activeFilter === filter
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/60 bg-background/80 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
            <p className="text-destructive font-medium">{error}</p>
            <Button
              onClick={() => fetchExploreData(1)}
              variant="outline"
              className="mt-4">
              Retry
            </Button>
          </div>
        ) : (
          <>
            {/* Suggested Users */}
            {exploreData?.suggestedUsers &&
              exploreData.suggestedUsers.length > 0 && (
                <SuggestedUsers users={exploreData.suggestedUsers} />
              )}

            {/* Live Streams */}
            {exploreData?.liveStreams && exploreData.liveStreams.length > 0 && (
              <LiveStreams streams={exploreData.liveStreams} />
            )}

            {/* Trending Posts based on active filter */}
            {filteredPosts.length > 0 && (
              <ExploreTrendingPosts
                posts={filteredPosts.map((post) => {
                  const mediaSource = (post.mediaUrls && post.mediaUrls.length > 0) 
                    ? post.mediaUrls[0] 
                    : (Array.isArray(post.media) ? post.media[0] : post.media);
                    
                  return {
                  id: parseInt(post._id, 36) || 1,
                  cover: mediaSource || "/placeholder.svg",
                  title: post.text?.substring(0, 50) || "Post",
                  caption: post.text || "",
                  hashtags: [],
                  metrics: {
                    views: post.views.toString(),
                    likes: post.likesCount.toString(),
                    comments: post.commentsCount.toString(),
                    shares: post.engagement.totalShares.toString(),
                  },
                  author: {
                    name: post.user.name,
                    handle: `@${post.user.username}`,
                    avatar: post.user.profilePicture || "/placeholder.svg",
                  },
                  badge: activeFilter !== "For You" ? activeFilter : undefined,
                }})}
                activeFilter={activeFilter}
              />
            )}

            {/* Viral Posts */}
            {exploreData?.viral && exploreData.viral.length > 0 && (
              <ViralPosts posts={exploreData.viral} />
            )}

            {/* Communities */}
            {exploreData?.communities && exploreData.communities.length > 0 && (
              <ExploreCommunities communities={exploreData.communities} />
            )}

            {/* Load More Button */}
            {pagination?.hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  size="lg"
                  className="min-w-[200px] rounded-full">
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
