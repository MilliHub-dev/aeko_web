"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MemberAvatarStack } from "@/components/communities/member-avatar-stack";
import { CommunityMenu } from "@/components/communities/community-menu";
import { Search, ChevronLeft, Share2, UserPlus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SingleCommunityApiResponse } from "@/types/explore";

interface CommunityProfileProps {
  params: { slug: string };
}

export default function CommunityProfilePage({
  params,
}: CommunityProfileProps) {
  const [slug, setSlug] = useState<string>("");
  const [community, setCommunity] = useState<SingleCommunityApiResponse | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"posts" | "about">("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Load community data and user
  useEffect(() => {
    checkCurrentUser();
    setSlug(params.slug);
    fetchCommunity(params.slug);
  }, [params.slug]);

  // Update isFollowing and isMember when community or user data changes
  useEffect(() => {
    if (community && currentUserId) {
      const memberStatus = community.members?.some((m: any) => 
        (typeof m.user === 'string' ? m.user : m.user?._id) === currentUserId
      );
      setIsMember(!!memberStatus);

      const followers = (community as any).followers || [];
      const isFollower = followers.some((f: any) => 
        (typeof f === 'string' ? f : f?._id) === currentUserId
      );
      setIsFollowing(!!(memberStatus || isFollower));
    }
  }, [community, currentUserId]);

  const checkCurrentUser = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        const user = data.user || data.data || data;
        setCurrentUserId(user._id);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  const fetchCommunity = async (communityId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const trimmed = (communityId || "").trim();
      if (!trimmed || trimmed === "undefined" || trimmed === "null") {
        throw new Error("Community not found");
      }
      const response = await fetch(`/api/communities/${communityId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch community");
      }

      const data: SingleCommunityApiResponse = await response.json();
      setCommunity(data);
    } catch (err) {
      console.error("Error fetching community:", err);
      setError(err instanceof Error ? err.message : "Failed to load community");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!community) return;

    // Optimistic update
    setIsFollowing(!isFollowing);

    try {
      const action = isFollowing ? "unfollow" : "follow";
      console.log(`${action} community:`, community._id);

      const endpoint =
        action === "follow"
          ? `/api/community-profiles/${community._id}/follow`
          : `/api/community-profiles/${community._id}/unfollow`;

      const res = await fetch(endpoint, { method: "POST" });

      if (!res.ok) {
        throw new Error(`Failed to ${action}`);
      }
    } catch (err) {
      // Revert on error
      setIsFollowing(!isFollowing);
      console.error("Error toggling follow:", err);
    }
  };

  const handleAbout = () => setActiveTab("about");
  const handleReport = () => console.log("Report community");
  const handleLeave = async () => {
    if (!community) return;
    
    if (confirm("Are you sure you want to leave this community?")) {
      try {
        const res = await fetch(`/api/communities/${community._id}/leave`, {
          method: "POST",
        });
        
        if (res.ok) {
          // Refresh community data to reflect changes
          fetchCommunity(slug);
        } else {
          console.error("Failed to leave community");
        }
      } catch (err) {
        console.error("Error leaving community:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <p className="mb-4 text-lg font-medium text-destructive">
            {error || "Community not found"}
          </p>
          <Link
            href="/communities"
            className="text-sm font-semibold text-primary hover:underline">
            Back to Communities
          </Link>
        </div>
      </div>
    );
  }

  const coverImage =
    community.profile?.coverPhoto || "/cover.png";
  const category = "General"; // Can be added to API response

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background gradient */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_5%_10%,hsla(var(--primary),0.15),transparent_55%),radial-gradient(circle_at_95%_0%,hsla(var(--muted-foreground),0.1),transparent_50%)]"
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative h-[65vh] sm:h-[70vh] lg:h-[60vh]">
          <Image
            src={coverImage}
            alt={community.name}
            fill
            priority
            className="object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

          {/* Top bar */}
          <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-4 py-4 sm:px-6">
            <Link
              href="/communities"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"
              aria-label="Back to communities">
              <ChevronLeft className="h-5 w-5" />
            </Link>

            <div className="flex items-center gap-2">
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"
                aria-label="Search in community">
                <Search className="h-5 w-5" />
              </button>
              <CommunityMenu
                onAbout={handleAbout}
                onReport={handleReport}
                onLeave={isMember ? handleLeave : undefined}
              />
            </div>
          </div>

          {/* Hero content */}
          <div className="absolute inset-x-0 bottom-0 space-y-4 px-4 pb-6 text-white sm:px-6">
            <Badge className="w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
              {category}
            </Badge>

            <div className="space-y-1.5">
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                {community.name}
              </h1>
              <p className="text-sm text-white/90 sm:text-base">
                {community.description}
              </p>
            </div>

            <MemberAvatarStack
              memberCount={community.memberCount}
              avatars={[]} // Can extract from members array if needed
              className="text-white/90"
            />

            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={handleFollowToggle}
                size="sm"
                className={cn(
                  "rounded-full px-6 text-sm font-semibold shadow-lg transition-all",
                  isFollowing
                    ? "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}>
                {isFollowing ? (
                  "Following"
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Follow
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full border-white/40 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
          {/* Tab switcher */}
          <div className="mb-8 flex items-center rounded-full border border-border/60 bg-card/80 p-1 text-sm font-semibold">
            {(["posts", "about"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 rounded-full px-4 py-2 transition-all capitalize",
                  activeTab === tab
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-primary"
                )}>
                {tab}
              </button>
            ))}
          </div>

          {/* Content based on active tab */}
          {activeTab === "posts" ? (
            <div className="space-y-6">
              <div className="py-20 text-center">
                <p className="text-muted-foreground">
                  No posts yet in this community
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <section className="space-y-3 rounded-[28px] border border-border/60 bg-card/80 p-6 shadow-sm">
                <h2 className="text-base font-semibold text-foreground">
                  About this community
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {community.description}
                </p>
              </section>

              {/* Community Settings */}
              <section className="space-y-4 rounded-[28px] border border-border/60 bg-card/80 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-foreground">
                  Community Settings
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Visibility</span>
                    <Badge variant="outline" className="text-xs">
                      {community.settings.isPrivate ? "Private" : "Public"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Posts</span>
                    <Badge variant="outline" className="text-xs">
                      {community.settings.canPost ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Comments</span>
                    <Badge variant="outline" className="text-xs">
                      {community.settings.canComment ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  {community.settings.payment.isPaidCommunity && (
                    <div className="flex items-center justify-between">
                      <span>Membership</span>
                      <Badge variant="outline" className="text-xs">
                        {community.settings.payment.price}{" "}
                        {community.settings.payment.currency}
                      </Badge>
                    </div>
                  )}
                </div>
              </section>

              {/* Location and Website */}
              {(community.profile?.location || community.profile?.website) && (
                <section className="space-y-3 rounded-[28px] border border-border/60 bg-card/80 p-6 shadow-sm">
                  <h3 className="text-base font-semibold text-foreground">
                    Information
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {community.profile.location && (
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>{community.profile.location}</span>
                      </div>
                    )}
                    {community.profile.website && (
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        <a
                          href={community.profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline">
                          {community.profile.website}
                        </a>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Member count and created date */}
              <section className="rounded-[28px] border border-border/60 bg-primary/10 p-6 text-sm text-primary">
                <div className="space-y-1">
                  <p>
                    <strong>{community.memberCount}</strong> members
                  </p>
                  <p className="text-xs text-primary/80">
                    Created on{" "}
                    {new Date(community.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
