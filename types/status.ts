export interface Status {
	_id: string;
	userId: string;
	user: {
		_id: string;
		name: string;
		username: string;
		profilePicture?: string;
	};
	type: "image" | "text" | "video" | "post";
	content?: string;
	media?: string;
	mediaType?: "image" | "video";
	originalPostId?: string;
	expiresAt: Date;
	createdAt: Date;
	reactions: StatusReaction[];
	views: number;
}

export interface StatusReaction {
	_id: string;
	userId: string;
	user: {
		_id: string;
		name: string;
		username: string;
		profilePicture?: string;
	};
	emoji: string;
	createdAt: Date;
}

export interface CreateStatusRequest {
	type: "image" | "text" | "video";
	content?: string;
	media?: string;
	mediaType?: "image" | "video";
}

export interface SharePostToStatusRequest {
	postId: string;
}

export interface ReactToStatusRequest {
	emoji: string;
}

export interface StatusResponse {
	success: boolean;
	data: Status;
	message?: string;
}

export interface StatusListResponse {
	success: boolean;
	data: Status[];
	message?: string;
}

export interface StatusReactionResponse {
	success: boolean;
	data: StatusReaction;
	message?: string;
}
