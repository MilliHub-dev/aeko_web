import type {
  ExploreCommunity,
  CommunityDetailsResponse,
} from "@/types/explore";

/**
 * Maps API community response to ExploreCommunity type
 */
export function mapApiCommunityToExploreCommunity(
  apiCommunity: CommunityDetailsResponse | any
): ExploreCommunity {
  return {
    _id: apiCommunity._id,
    name: apiCommunity.name,
    description: apiCommunity.description,
    category: apiCommunity.category || "General",
    cover: apiCommunity.profile?.coverPhoto || "/communities/default.jpg",
    profile: apiCommunity.profile,
    membersCount: apiCommunity.memberCount || 0,
    memberCount: apiCommunity.memberCount,
    memberAvatars: [], // Will be populated from members if needed
    isFollowing: false, // Will be determined by checking if user is in members
    slug: apiCommunity._id, // Using _id as slug for now
    owner: apiCommunity.owner,
    moderators: apiCommunity.moderators,
    settings: apiCommunity.settings,
    isActive: apiCommunity.isActive,
    createdAt: apiCommunity.createdAt,
    updatedAt: apiCommunity.updatedAt,
  };
}

/**
 * Determines if the current user is following a community
 */
export function isUserFollowingCommunity(
  community: CommunityDetailsResponse | any,
  userId?: string
): boolean {
  if (!userId || !community.members) return false;

  return community.members.some(
    (member: any) => member.user === userId || member.user._id === userId
  );
}
