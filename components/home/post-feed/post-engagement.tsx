import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";

interface PostEngagementProps {
	likes?: string;
	comments?: string;
	shares?: string;
	bookmarks?: string;
}

export function PostEngagement({
	likes,
	comments,
	shares,
	bookmarks
}: PostEngagementProps) {
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button className="hover:text-primary transition-colors">
						<Heart className="w-6 h-6" />
					</button>
					<button className="hover:text-primary transition-colors">
						<MessageCircle className="w-6 h-6" />
					</button>
					<button className="hover:text-primary transition-colors">
						<Share2 className="w-6 h-6" />
					</button>
				</div>
				<button className="hover:text-primary transition-colors">
					<Bookmark className="w-6 h-6" />
				</button>
			</div>
			<div className="space-y-1">
				<p className="font-semibold">{likes} likes</p>
				{/* <p className="text-xs text-muted-foreground uppercase">
          Posted {timePosted}
        </p> */}
			</div>
		</div>
	);
}
