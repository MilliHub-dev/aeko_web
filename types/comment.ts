export interface Comment {
	id: string;
	user: {
		name: string;
		avatar: string;
		isOnline?: boolean;
	};
	text: string;
	timeAgo: string;
	liked?: boolean;
}
