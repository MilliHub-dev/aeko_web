"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useExploreData } from "@/features/explore/hooks/use-explore-data";
import { useSuggestedUsers } from "@/features/explore/hooks/use-suggested-users";
import { Loader2, Search, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchResultsDropdown } from "@/components/explore/search-results-dropdown";
import type { SuggestedUser, ExploreCommunity } from "@/types/explore";
import type { FeedPost } from "@/types/post";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { usePathname, useRouter } from "next/navigation";
import { useFollowUser } from "@/features/profile/hooks/use-follow-user";
import { useUserRelationsStore } from "@/features/profile/stores/user-relations-store";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

import { Coins, Gift, Rocket, ArrowRight } from "lucide-react";

function RightSidebarSuggestedUserRow({ user }: { user: SuggestedUser }) {
  const { isFollowing, toggleFollow, isLoading } = useFollowUser(
    user._id,
    user.isFollowing
  );
  const displayName = user?.name || user?.username || "Unknown";

  return (
    <div className="flex items-center justify-between">
      <Link
        href={`/${user.username}`}
        className="flex items-center gap-3 overflow-hidden flex-1 min-w-0"
      >
        <Avatar className="h-10 w-10 border border-border/50">
          <AvatarImage src={user?.profilePicture || user?.avatar || "/placeholder.svg"} alt={displayName} />
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
              {displayName}
            </span>
            {user.blueTick && (
              <Image
                src="/ticks/blue_tick.jpg"
                alt="Verified"
                width={16}
                height={16}
                className="h-4 w-4"
              />
            )}
            {user.goldenTick && (
              <Image
                src="/ticks/gold_tick.jpg"
                alt="Gold Verified"
                width={16}
                height={16}
                className="h-4 w-4"
              />
            )}
            {user.prideTick && (
              <Image
                src="/ticks/pride_tick.jpg"
                alt="Pride Verified"
                width={16}
                height={16}
                className="h-4 w-4"
              />
            )}
            {user.businessTick && (
              <Image
                src="/ticks/green_tick.jpg"
                alt="Business Verified"
                width={16}
                height={16}
                className="h-4 w-4"
              />
            )}
          </div>
          <span className="truncate text-xs text-muted-foreground">
            @{user.username}
          </span>
        </div>
      </Link>
      <Button
        size="sm"
        onClick={toggleFollow}
        disabled={isLoading}
        variant={isFollowing ? "outline" : "secondary"}
        className="h-8 rounded-full px-3 text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors ml-2"
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </div>
  );
}

function AekoWaitlistCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      toast.error("Please enter both your name and email");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(payload.message || "Failed to join waitlist");
        return;
      }

      toast.success("You’re on the Aeko Coin waitlist");
      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error("Waitlist signup failed:", error);
      toast.error("Failed to join waitlist");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(0,127,109,0.22),transparent_52%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,251,249,0.96))] p-5 shadow-sm">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/15">
              <Coins className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary/80">
                Join Waitlist
              </p>
              <h3 className="text-lg font-bold text-foreground">$AEKO Coin</h3>
              <p className="text-sm text-muted-foreground">
                Get in early for rewards and priority access before the wider launch.
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/70 px-3 py-2 text-sm text-foreground">
              <Rocket className="h-4 w-4 text-primary" />
              <span>Early access to Aeko Coin drops</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/70 px-3 py-2 text-sm text-foreground">
              <Gift className="h-4 w-4 text-primary" />
              <span>Airdrop opportunity up to 3000 $AEKO</span>
            </div>
          </div>

          <Button
            className="w-full rounded-full bg-foreground font-semibold text-background hover:bg-foreground/90"
            onClick={() => setIsOpen(true)}
          >
            Join Waitlist
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[460px] rounded-[28px] p-0 overflow-hidden">
          <div className="bg-[radial-gradient(120%_120%_at_0%_0%,rgba(0,127,109,0.14),transparent_52%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,250,249,0.95))] p-6">
            <DialogHeader className="space-y-3 text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/15">
                <Coins className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-semibold text-foreground">
                  Join the $AEKO waitlist
                </DialogTitle>
                <DialogDescription className="pt-1">
                  Enter your details to secure early access and an airdrop chance of up to 3000 $AEKO.
                </DialogDescription>
              </div>
            </DialogHeader>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="waitlist-name">
                  Name
                </label>
                <Input
                  id="waitlist-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Jane Doe"
                  className="rounded-full border-border/70 bg-background"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="waitlist-email">
                  Email
                </label>
                <Input
                  id="waitlist-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="jane@example.com"
                  className="rounded-full border-border/70 bg-background"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/70 p-3 text-sm text-muted-foreground">
                Rewards include early access and an airdrop opportunity of up to 3000 $AEKO.
              </div>

              <Button
                type="submit"
                className="w-full rounded-full bg-foreground font-semibold text-background hover:bg-foreground/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Joining..." : "Secure My Spot"}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function RightSidebar() {
  const { data, isLoading } = useExploreData();
  const { users: rawSuggestedUsers } = useSuggestedUsers();
  const following = useUserRelationsStore((state) => state.following);
  const router = useRouter();
  const pathname = usePathname();
  const lockSidebarScroll = pathname === "/home";
  
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

  const suggestedUsers = useMemo(() => {
    const seen = new Set<string>();

    return (rawSuggestedUsers ?? []).filter((user) => {
      const normalizedId = user._id ? String(user._id) : "";
      const key = normalizedId || user.username?.toLowerCase();
      if (!key || (normalizedId && following.has(normalizedId))) {
        return false;
      }

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }, [rawSuggestedUsers, following]);

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
      <aside className="sticky top-0 hidden h-screen w-full shrink-0 xl:flex border-l items-center justify-center overflow-hidden">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </aside>
    );
  }

  return (
    <aside
      className={`sticky top-0 hidden h-screen w-full shrink-0 border-l xl:flex ${
        lockSidebarScroll ? "overflow-hidden" : ""
      }`}
    >
      <div className="flex h-full w-full flex-col gap-6 overflow-hidden border-none">
        <div
          className={`flex-1 space-y-6 px-6 py-6 ${
            lockSidebarScroll ? "overflow-hidden" : "overflow-y-auto"
          }`}
        >
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
          {suggestedUsers.length > 0 && (
            <section className="space-y-4 rounded-3xl border border-border/60 bg-card/50 p-4 shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-between px-1">
                <p className="text-sm font-bold text-foreground">
                  Who to follow
                </p>
                <Link
                  href="/explore"
                  className="text-xs font-medium text-primary hover:text-primary/80">
                  See all
                </Link>
              </div>
              <div className="space-y-4">
                {suggestedUsers
                  .slice(0, 5)
                  .map((user, index) => (
                  <RightSidebarSuggestedUserRow
                    key={`${user._id}-${index}`}
                    user={user}
                  />
                ))}
              </div>
            </section>
          )}

          <AekoWaitlistCard />

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

              <Button asChild className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 font-semibold shadow-lg shadow-primary/5">
                <Link href="/subscription">
                  Subscribe Now
                </Link>
              </Button>
            </div>
          </section>

          {/* Trending Posts Section */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                Trending Now
              </p>
              <Link
                href="/explore"
                className="text-xs text-primary hover:text-primary/80">
                See all
              </Link>
            </div>
            <div className="space-y-3">
              {data?.trending && data.trending.length > 0 ? (
                data.trending.slice(0, 3).map((post, index) => (
                  <Link
                    key={`${post._id}-${index}`}
                    href={`/post/${post._id}`}
                    className="flex w-full flex-col gap-1 rounded-2xl border border-border/60 bg-muted px-4 py-3 text-sm text-muted-foreground transition hover:bg-muted/80 hover:text-foreground">
                    <span className="line-clamp-2 text-foreground font-medium">
                      {post.text || "Untitled Post"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {post.user?.name || "Unknown User"}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="text-sm text-muted-foreground px-4 py-3 rounded-2xl border border-border/60 bg-muted/50">
                  No trending posts right now.
                </div>
              )}
            </div>
          </section>

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
                        {stream.streamer?.name || stream.streamer?.username || "Unknown streamer"}
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
