import {
	Heart,
	Share2,
	Bookmark,
	MessageCircle
} from "lucide-react";
import { Metric } from "./post-metric";
import { ReAeko } from "@/lib/icons";
import { useCommentsPanel } from "./comments-panel-context";

interface PostActionsProps {
	likes: string;
	shares: string;
	bookmarks: string;
	comments: string;
	postId: string;
}

const PostActions = ({
	likes,
	shares,
	bookmarks,
	comments,
	postId
}: PostActionsProps) => {
	const { open } = useCommentsPanel();

	return (
		<div className="hidden lg:flex lg:items-center lg:justify-between">
			<div className="flex flex-col items-center gap-y-8 px-2">
				<Metric
					icon={
						<Heart className="w-8 h-8 fill-red-500" />
					}
					value={likes}
				/>
				<Metric
					icon={<Share2 className="w-8 h-8" />}
					value={shares}
				/>
				<Metric
					icon={<Bookmark className="w-8 h-8" />}
					value={bookmarks}
				/>
				<Metric
					icon={
						<MessageCircle className="w-8 h-8" />
					}
					value={comments}
					onClick={() => open(postId)}
					className="cursor-pointer hover:opacity-80 transition-opacity"
				/>
				<Metric
					icon={<ReAeko strokeWidth={4} />}
					value={120}
					className="cursor-pointer hover:opacity-80 transition-opacity"
				/>
			</div>
		</div>
	);
};

export { PostActions };
