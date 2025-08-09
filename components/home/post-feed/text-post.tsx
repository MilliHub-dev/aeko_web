import { Heart, Share2, Bookmark, MessageCircle } from "lucide-react";
import { PostProps } from "./post";
import { PostHeader } from "./post-header";
import { Metric } from "./post-metric";

const TextPost = (props: PostProps) => (
	<div className="relative w-full max-w-md md:max-w-xl mx-auto bg-card p-2 md:p-4 space-y-4 rounded-2xl border-1">
		<PostHeader
			username={props.username!}
			handle={props.handle!}
			profileImage={props.profileImage!}
			avatarBackground="bg-none"
			dropDownBackground="bg-secondary"
			avatarText="text-primary"
		/>
		<div className="space-y-3">
			<p className="text-xl leading-relaxed">{props.content}</p>
			<div className="flex flex-wrap gap-2">
				{props.hashtags?.map((tag, i) => (
					<span
						key={i}
						className="text-primary hover:underline cursor-pointer text-lg"
					>
						#{tag}
					</span>
				))}
			</div>
		</div>
		<div className="flex items-center space-x-6 pt-2 text-foreground">
			<Metric
				icon={<Heart className="w-6 h-6" />}
				value={props.likes!}
			/>
			<Metric
				icon={<Share2 className="w-6 h-6" />}
				value={props.shares!}
			/>
			<Metric
				icon={<Bookmark className="w-6 h-6" />}
				value={props.bookmarks!}
			/>
			<Metric
				icon={<MessageCircle className="w-6 h-6" />}
				value={props.comments!}
			/>
		</div>
	</div>
);

export { TextPost };
