"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useExploreData } from "@/features/explore/hooks/use-explore-data";
import { Loader2, Search, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchResultsDropdown } from "@/components/explore/search-results-dropdown";
import type { SuggestedUser, ExploreCommunity } from "@/types/explore";
import type { FeedPost } from "@/types/post";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { useRouter } from "next/navigation";

export function RightSidebar() {
  const { data, isLoading } = useExploreData();
  const router = useRouter();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchUsers, setSearchUsers] = useState<SuggestedUser[]>([]);
  const [searchCommunities, setSearchCommunities] = useState<ExploreCommunity[]>([]);
  const [searchPosts, setSearchPosts] = useState<FeedPost[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(searchContainerRef as React.RefObject<HTMLElement>, () => {
    setShowResults(false);
  });

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchUsers([]);
      setSearchCommunities([]);
      setSearchPosts([]);
      return;
    }

    setIsSearching(true);
    try {
      const [usersRes, communitiesRes, postsRes] = await Promise.all([
        fetch(`/api/users?q=${encodeURIComponent(query)}`),
        fetch(`/api/communities?q=${encodeURIComponent(query)}`),
        fetch(`/api/posts/search?q=${encodeURIComponent(query)}`),
      ]);

      const usersData = await usersRes.json();
      const communitiesData = await communitiesRes.json();
      const postsData = await postsRes.json();

      // Handle users
      if (usersData.success && Array.isArray(usersData.users)) {
        setSearchUsers(usersData.users);
      } else if (usersData.success && Array.isArray(usersData.data)) {
        setSearchUsers(usersData.data);
      } else if (Array.isArray(usersData)) {
        setSearchUsers(usersData);
      } else {
        setSearchUsers([]);
      }

      // Handle communities
      if (communitiesData.success && Array.isArray(communitiesData.communities)) {
        setSearchCommunities(communitiesData.communities);
      } else if (communitiesData.success && Array.isArray(communitiesData.data)) {
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowResults(!!query);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };
  
  // Custom hook replacement for simple debounce inside change handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
    }
  };

  if (isLoading) {
    return (
      <aside className="sticky top-0 hidden h-screen w-full shrink-0 xl:flex border-l items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </aside>
    );
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-full shrink-0 xl:flex border-l">
      <div className="flex h-full w-full flex-col gap-6 overflow-hidden border-none">
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {/* Search Bar */}
          <div className="relative" ref={searchContainerRef}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(!!e.target.value);
              }}
              onFocus={() => setShowResults(!!searchQuery)}
              onKeyDown={handleKeyDown}
              placeholder="Search Aeko..." 
              className="pl-10 rounded-full bg-muted/50 border-border/50 focus-visible:ring-1 focus-visible:ring-primary/20" 
            />
            
            {showResults && (
              <SearchResultsDropdown
                users={searchUsers}
                communities={searchCommunities}
                posts={searchPosts}
                isLoading={isSearching}
                query={searchQuery}
                className="absolute left-0 right-0 top-full z-50 mt-2 bg-background border rounded-xl shadow-lg"
              />
            )}
          </div>

          {/* Who to Follow Section */}
          {data?.suggestedUsers && data.suggestedUsers.length > 0 && (
            <section className="space-y-4 rounded-3xl border border-border/60 bg-card/50 p-4 shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-between px-1">
                <p className="text-sm font-bold text-foreground">
                  Who to follow
                </p>
                <Link
                  href="/communities"
                  className="text-xs font-medium text-primary hover:text-primary/80">
                  See all
                </Link>
              </div>
              <div className="space-y-4">
                {data.suggestedUsers.slice(0, 3).map((user, index) => (
                  <div
                    key={`${user._id}-${index}`}
                    className="flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Avatar className="h-10 w-10 border border-border/50">
                        <AvatarImage src={user.profilePicture} alt={user.name} />
                        <AvatarFallback>
                          <Image
                            src="/profile_icon.jpg"
                            alt="Profile"
                            fill
                            className="object-cover"
                          />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <div className="flex items-center gap-1">
                          <span className="truncate text-sm font-semibold text-foreground">
                            {user.name}
                          </span>
                          {user.blueTick && (
                            <Image
                              src="/blue_tick.png"
                              alt="Verified"
                              width={12}
                              height={12}
                              className="h-3 w-3"
                            />
                          )}
                          {user.goldenTick && (
                            <Image
                              src="/gold_tick.png"
                              alt="Gold Verified"
                              width={12}
                              height={12}
                              className="h-3 w-3"
                            />
                          )}
                        </div>
                        <span className="truncate text-xs text-muted-foreground">
                          @{user.username}
                        </span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="h-8 rounded-full px-3 text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      Follow
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Premium Ads Card */}
          <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/5 via-background to-background p-5 shadow-sm">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Check className="h-24 w-24 rotate-12 text-primary" />
            </div>
            <div className="relative space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10 ring-1 ring-yellow-500/20">
                  <Check className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Get Premium</h3>
                  <p className="text-xs text-muted-foreground">Unlock exclusive features</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-3 w-3 text-primary" />
                  <span>Ad-free experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-3 w-3 text-primary" />
                  <span>Gold verification tick</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-3 w-3 text-primary" />
                  <span>Exclusive content access</span>
                </div>
              </div>

              <Button className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 font-semibold shadow-lg shadow-primary/5">
                Subscribe Now
              </Button>
            </div>
          </section>

          {/* Trending Posts Section */}
          {data?.trending && data.trending.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                  Trending Posts
                </p>
                <Link
                  href="/explore"
                  className="text-xs text-primary hover:text-primary/80">
                  See all
                </Link>
              </div>
              <div className="space-y-3">
                {data.trending.slice(0, 3).map((post, index) => (
                  <Link
                    key={`${post._id}-${index}`}
                    href={`/post/${post._id}`}
                    className="flex w-full flex-col gap-1 rounded-2xl border border-border/60 bg-muted px-4 py-3 text-sm text-muted-foreground transition hover:bg-muted/80 hover:text-foreground">
                    <span className="line-clamp-2 text-foreground font-medium">
                      {post.text || "Untitled Post"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {post.user.name}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Live Streams Section */}
          {data?.liveStreams && data.liveStreams.length > 0 && (
            <section className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                Live Now
              </p>
              <div className="space-y-4">
                {data.liveStreams.slice(0, 2).map((stream, index) => (
                  <div
                    key={`${stream._id}-${index}`}
                    className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 p-4 transition hover:bg-muted/50">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-foreground">
                        {stream.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {stream.streamer.name}
                      </span>
                    </div>
                    <Link
                      href={`/live/${stream._id}`}
                      className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20">
                      Watch
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </aside>
  );
}
