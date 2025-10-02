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

export interface PostProps {
	id: string;
	type: PostType;
	username: string;
	handle: string;
	profileImage: string;
	backgroundImage?: string;
	videoSrc?: string;
	content: string;
	likes: string;
	shares: string;
	bookmarks: string;
	tag?: string;
	comments?: Comment[];
	commentMetric: string;
	hashtags?: string[];
	taggedUsers?: string[];
	timePosted?: string;
}

export interface Post {
	_id: string;
	user: User;
	originalOwner: User;
	text?: string;
	media?: string;
	type: PostType;
	views: number;
	uniqueViewers: string[]; // array of userIds
	transferHistory: TransferHistory[];
	isEligibleForNFT: boolean;
	nftMinted: boolean;
	nftTokenId?: string;
	isListedForSale: boolean;
	salePrice?: number;
	engagement: Engagement;
	createdAt: string; // ISO date-time
	updatedAt: string; // ISO date-time
}
