import { FeedPost } from "./post";
import { User } from "./user";

// API Response Types for Communities
export interface CommunityMember {
  user: string;
  joinedAt: string;
  role: "member" | "moderator" | "admin";
}

export interface CommunityProfile {
  avatar?: string;
  coverPhoto?: string;
  website?: string;
  location?: string;
}

export interface CommunitySettings {
  isPrivate: boolean;
  requireApproval: boolean;
  canPost: boolean;
  canComment: boolean;
  payment: {
    isPaidCommunity: boolean;
    price: number;
    currency: string;
    subscriptionType: string;
    paymentAddress?: string;
  };
  postSettings: {
    allowImages: boolean;
    allowVideos: boolean;
    allowLinks: boolean;
    requireApproval: boolean;
  };
}

export interface CommunityDetailsResponse {
  _id: string;
  name: string;
  description: string;
  profile: CommunityProfile;
  owner: string;
  moderators: string[];
  members: CommunityMember[];
  settings: CommunitySettings;
  memberCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: string;
}

export interface CommunitiesApiResponse {
  success: boolean;
  data: CommunityDetailsResponse[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface SingleCommunityApiResponse {
  success?: boolean;
  _id: string;
  name: string;
  description: string;
  profile: CommunityProfile;
  owner: string;
  moderators: string[];
  members: CommunityMember[];
  settings: CommunitySettings;
  memberCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SuggestedUser {
  _id: string;
  name: string;
  username: string;
  profilePicture: string;
  avatar?: string; // Alternative to profilePicture
  bio: string;
  followers: string[];
  blueTick: boolean;
  goldenTick: boolean;
  prideTick?: boolean;
  businessTick?: boolean;
  followersCount: number;
  postsCount?: number;
  isFollowing?: boolean; // Optional for search results
}

export interface ExploreCommunity {
  _id: string;
  name: string;
  description: string;
  category: string;
  cover: string;
  profile?: CommunityProfile;
  members?: string[];
  membersCount?: number;
  memberCount?: number;
  memberAvatars?: string[]; // Avatar URLs for display
  isFollowing?: boolean;
  growth?: string; // e.g., "+6.2% weekly"
  slug?: string; // URL-friendly identifier
  owner?: string | { _id?: string; id?: string };
  moderators?: string[] | Pick<User, "_id" | "name" | "username" | "profilePicture">[];
  settings?: unknown;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommunityPost {
  _id: string;
  community: {
    _id: string;
    name: string;
    slug: string;
  };
  user: {
    _id: string;
    name: string;
    username: string;
    profilePicture: string;
  };
  text?: string;
  media?: string | string[];
  mediaUrl?: string;
  mediaUrls?: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
}

export interface CommunityDetails extends ExploreCommunity {
  posts: CommunityPost[];
  about?: string;
  rules?: string[];
  moderators?:
    | string[]
    | Pick<User, "_id" | "name" | "username" | "profilePicture">[];
  owner?: string;
  settings?: CommunitySettings;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface LiveStream {
  _id: string;
  title: string;
  streamer: Pick<User, "_id" | "name" | "username" | "profilePicture">;
  thumbnail: string;
  viewerCount: number;
  isLive: boolean;
  startedAt: string;
  category?: string;
}

export interface ExploreData {
  trending: FeedPost[];
  suggestedUsers: SuggestedUser[];
  communities: ExploreCommunity[];
  liveStreams: LiveStream[];
  viral: FeedPost[];
  forYou: FeedPost[];
}

export interface ExplorePagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasMore: boolean;
}

export interface ExploreResponse {
  success: boolean;
  message?: string;
  data: ExploreData;
  pagination: ExplorePagination;
}
