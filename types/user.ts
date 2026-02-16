import { EmailVerification, ProfileCompletion } from "./auth";
import { BotPersonality, BotPreferences, BotAnalytics } from "./bot";
import { Post } from "./post";

export type UserStatus = "online" | "offline" | "away" | "busy";

export interface Onboarding {
  interestsSelected: boolean;
  completed: boolean;
}

export interface Privacy {
  isPrivate: boolean;
  allowFollowRequests: boolean;
  showOnlineStatus: boolean;
  allowDirectMessages: "everyone" | "followers" | "none";
}

export interface TwoFactorAuth {
  isEnabled: boolean;
  secret: string | null;
  enabledAt: string | null;
  lastUsed: string | null;
  backupCodes: string[];
}

export interface User {
  id: string;
  _id?: string; // Backward compatibility
  name: string;
  username: string;
  email: string;
  oauthProvider: string | null;
  oauthId: string | null;
  avatar: string;
  lastLoginAt: string | null;
  profilePicture: string;
  coverPicture?: string;
  bio: string;
  location?: string;
  followers: string[]; // Assuming IDs
  following: string[]; // Assuming IDs
  posts: Post[]; // Assuming IDs
  aekoBalance: number;
  blueTick: boolean;
  goldenTick: boolean;
  prideTick?: boolean;
  businessTick?: boolean;
  subscriptionStatus: "active" | "inactive";
  subscriptionExpiry: string | null;
  banned: boolean;
  isAdmin: boolean;
  botEnabled: boolean;
  botPersonality: BotPersonality;
  botPreferences: BotPreferences;
  botAnalytics: BotAnalytics;
  botResponses: string[]; // Assuming IDs or strings
  interests: string[]; // Assuming IDs
  createdAt: string; // ISO date-time
  updatedAt: string; // ISO date-time
  __v: number;
  communities: string[]; // Assuming IDs
  followingCommunities: string[]; // Assuming IDs
  communityMemberships: string[]; // Assuming IDs
  blockedUsers: string[]; // Assuming IDs
  followRequests: string[]; // Assuming IDs

  // Nested objects
  emailVerification: EmailVerification;
  profileCompletion: ProfileCompletion;
  onboarding: Onboarding;
  privacy: Privacy;
  twoFactorAuth: TwoFactorAuth;
  ownedCommunities: string[]; // Assuming IDs

  // Deprecated or not in new JSON but keeping if needed (checking against previous file)
  status?: UserStatus; // Not in JSON but was in file
  solanaWalletAddress?: string; // Not in JSON but was in file
  twoFactorEnabled?: boolean; // Replaced by twoFactorAuth object
  
  // Stats
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
  likesCount?: number;
  bookmarksCount?: number;
  
  // Privacy settings from flat update
  allowComments?: boolean;
  allowTags?: boolean;
}
