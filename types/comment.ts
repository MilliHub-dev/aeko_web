export interface Comment {
	id: string;
	user: {
		_id?: string;
		id?: string;
		name: string;
		avatar: string;
		profilePicture?: string;
		isOnline?: boolean;
	};
	text: string;
	timeAgo: string;
	liked?: boolean;
	likesCount?: number;
	parentId?: string;
	replies?: Comment[];
	repliesCount?: number;
}
