import { Comment } from "./comment";
import { TransferHistory } from "./transfer";
import { User } from "./user";

export type PostType = "text" | "image" | "video";

export interface Engagement {
  totalShares: number;
  totalComments: number;
  totalLikes: number;
  engagementRate: number;
}

export interface Ad {
  isPromoted: boolean;
  budget: number;
  target: string;
  startDate: string | null; // ISO date-time
  endDate: string | null; // ISO date-time
}

export interface Privacy {
  level: "public" | "followers" | "select_users" | "only_me";
  selectedUsers: string[]; // array of userIds
  updatedAt: string; // ISO date-time
  updateHistory: {
    previousLevel: string;
    newLevel: string;
    updatedAt: string;
    updatedBy: string;
  }[]; // array of level changes with timestamps
}

export interface Post {
  _id: string;
  user: Partial<User>;
  originalOwner: Partial<User> | null;
  text?: string;
  media?: string | string[];
  mediaUrl?: string;
  mediaUrls?: string[];
  type: PostType;
  privacy: Privacy;
  views: number;
  uniqueViewers: string[]; // array of userIds
  transferHistory: TransferHistory[];
  isEligibleForNFT: boolean;
  nftMinted: boolean;
  nftTokenId?: string | null;
  isListedForSale: boolean;
  salePrice?: number;
  engagement: Engagement;
  createdAt: string; // ISO date-time
  updatedAt: string; // ISO date-time
}

export interface FeedPost extends Pick<
  Post,
  | "_id"
  | "text"
  | "media"
  | "mediaUrl"
  | "mediaUrls"
  | "type"
  | "engagement"
  | "views"
  | "uniqueViewers"
  | "isEligibleForNFT"
  | "nftMinted"
  | "nftTokenId"
  | "isListedForSale"
  | "salePrice"
  | "privacy"
  | "transferHistory"
  | "createdAt"
  | "updatedAt"
> {
  ad: Ad;
  isAd?: boolean;
  targetUrl?: string;
  user: Pick<
    User,
    | "_id"
    | "name"
    | "username"
    | "email"
    | "profilePicture"
    | "blueTick"
    | "goldenTick"
    | "prideTick"
    | "businessTick"
  >;
  comments: Comment[];
  likes: string[];
  bookmarks: string[];
  reposts: string[];
  originalPost: null | FeedPost;
  likesCount: number;
  commentsCount: number;
  bookmarksCount: number;
  nftMetadataUri?: string | null;
  __v: number;
}

export interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface PaginatedPostsResponse {
  posts: FeedPost[];
  pagination: Pagination;
}

// Legacy type for mock data - will be replaced with FeedPost
export interface PostProps {
  id?: string;
  _id?: string;
  type: PostType;
  username?: string;
  handle?: string;
  profileImage?: string;
  backgroundImage?: string;
  videoSrc?: string;
  content?: string;
  text?: string;
  media?: string;
  likes?: string | number;
  likesCount?: number;
  shares?: string;
  bookmarks?: string;
  commentMetric?: string;
  commentsCount?: number;
  hashtags?: string[];
  taggedUsers?: string[];
  timePosted?: string;
  comments?: Comment[];
  user?: Pick<User, "_id" | "name" | "username" | "email" | "profilePicture">;
}

const userPost: FeedPost = {
  engagement: {
    totalShares: 0,
    totalComments: 0,
    totalLikes: 0,
    engagementRate: 0,
  },
  ad: {
    isPromoted: false,
    budget: 0,
    target: "",
    startDate: null,
    endDate: null,
  },
  privacy: {
    level: "public",
    selectedUsers: [],
    updatedAt: "2025-11-18T09:34:48.975Z",
    updateHistory: [],
  },
  _id: "691b26f5948e14c91046df09",
  user: {
    _id: "68de86c4452868486908302f",
    name: "Abdullahi Ismail ",
    username: "Abuaslam",
    email: "abdullahabuaslam@gmail.com",
    profilePicture: "",
    blueTick: false,
    goldenTick: false,
    prideTick: false,
    businessTick: false,
  },
  text: "{@}[Bob Johnson](3)  weldone ",
  media: "",
  type: "text",
  likes: [],
  bookmarks: [],
  reposts: [],
  originalPost: null,
  comments: [],
  views: 0,
  uniqueViewers: [],
  isEligibleForNFT: false,
  nftMinted: false,
  nftTokenId: null,
  nftMetadataUri: null,
  isListedForSale: false,
  salePrice: 0,
  transferHistory: [],
  createdAt: "2025-11-17T13:45:25.735Z",
  updatedAt: "2025-11-17T13:45:25.735Z",
  __v: 0,
  likesCount: 0,
  commentsCount: 0,
  bookmarksCount: 0,
};
