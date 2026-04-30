"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { CommunityCard } from "@/components/communities/community-card";
import type { ExploreCommunity, CommunitiesApiResponse } from "@/types/explore";
import { useUser } from "@/components/shared/user-context";

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

export default function MyCommunitiesPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const [communities, setCommunities] = useState<ExploreCommunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchCommunities = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/communities");
        const data: CommunitiesApiResponse = await response.json();

        if (data.success && data.data) {
          const isMyCommunity = (raw: any) => {
            const communityId = extractCommunityId(raw);
            if (communityId) {
              if (ownedCommunityIds.has(communityId)) return true;
              if (membershipCommunityIds.has(communityId)) return true;
              if (followingCommunityIds.has(communityId)) return true;
            }
            if (!currentUserId) return false;
            const ownerId = toId(raw?.owner) || toId(raw?.owner?._id);
            if (ownerId && ownerId === currentUserId) return true;

            const rawMembers = raw?.members || raw?.communityMembers || [];
            if (Array.isArray(rawMembers)) {
              return rawMembers.some(
                (m: any) => extractUserIdFromMember(m) === currentUserId
              );
            }
            return false;
          };

          const getSortDate = (raw: any) =>
            Date.parse(raw?.updatedAt || raw?.createdAt || "") || 0;

          const isOwnerCommunity = (raw: any) => {
            if (!currentUserId) return false;
            const ownerId = toId(raw?.owner) || toId(raw?.owner?._id);
            return !!ownerId && ownerId === currentUserId;
          };

          const mappedCommunities: ExploreCommunity[] = data.data
            .filter(isMyCommunity)
            .sort((a: any, b: any) => {
              const ownerDiff =
                Number(isOwnerCommunity(b)) - Number(isOwnerCommunity(a));
              if (ownerDiff !== 0) return ownerDiff;
              return getSortDate(b) - getSortDate(a);
            })
            .map((community) => {
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
                isFollowing: true,
                slug: id || undefined,
              };
            })
            .filter((c) => !!c._id);

          setCommunities(mappedCommunities);
        } else {
          setError("Failed to load communities");
        }
      } catch (err) {
        console.error("Error fetching communities:", err);
        setError("Failed to load communities");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunities();
  }, [currentUserId, isUserLoading]);

  const handleFollowToggle = (communityId: string, isFollowing: boolean) => {
    setCommunities((prev) =>
      prev.map((c) =>
        c._id === communityId ? { ...c, isFollowing: !isFollowing } : c
      )
    );
    // TODO: Implement API call to follow/unfollow
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background gradient */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,hsla(var(--primary),0.12),transparent_50%),radial-gradient(circle_at_90%_0%,hsla(var(--muted-foreground),0.08),transparent_45%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full px-4 pb-24 pt-8 sm:px-6 lg:max-w-5xl lg:px-8">
        {/* Header */}
        <header className="mb-8 flex items-center gap-4">
          <Link
            href="/communities"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-card/80 text-foreground transition hover:bg-card"
            aria-label="Back to communities">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            My Communities
          </h1>
        </header>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
            <p className="font-medium text-destructive">{error}</p>
          </div>
        ) : communities.length > 0 ? (
          /* Communities grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {communities.map((community) => (
              <CommunityCard
                key={community._id}
                community={community}
                onFollowToggle={handleFollowToggle}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-6">
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
            <h2 className="text-xl font-semibold text-foreground">
              No communities yet
            </h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Start exploring and join communities that match your interests.
            </p>
            <Link
              href="/communities"
              className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
              Explore Communities
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
