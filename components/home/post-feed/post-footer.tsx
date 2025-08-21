import { Heart, Share2, Bookmark, MessageCircle } from "lucide-react";
import { Metric } from "./post-metric";

interface PostFooterProps {
	content: string;
	hashtags: string[];
	likes: string;
	shares: string;
	bookmarks: string;
	comments: string;
	textColor?: string;
	onCommentClick?: () => void;
}

const PostFooter = ({
	content,
	hashtags,
	likes,
	shares,
	bookmarks,
	comments,
	textColor = "text-white",
	onCommentClick
}: PostFooterProps) => (
	<div className="space-y-4">
		<div className="space-y-2">
			<p className={`${textColor} text-lg font-medium leading-relaxed`}>
				{content}
			</p>
			<div className="flex flex-wrap gap-1">
				{hashtags.map((tag, i) => (
					<span
						key={i}
						className={`${textColor} text-base`}
					>
						#{tag}
					</span>
				))}
			</div>
		</div>
		<div className="flex items-center justify-between gap-x-6 ">
			<Metric
				icon={<Heart className="w-6 h-6 fill-white" />}
				value={likes}
				className={textColor}
			/>
			<Metric
				icon={<Share2 className="w-6 h-6" />}
				value={shares}
				className={textColor}
			/>
			<Metric
				icon={<Bookmark className="w-6 h-6" />}
				value={bookmarks}
				className={textColor}
			/>
			<Metric
				icon={<MessageCircle className="w-6 h-6" />}
				value={comments}
				className={`${textColor} cursor-pointer hover:opacity-80 transition-opacity`}
				onClick={onCommentClick}
			/>
		</div>
	</div>
);

export { PostFooter };
