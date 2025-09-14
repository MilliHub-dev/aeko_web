import { Metric } from "@/components/home/post/post-metric";
import { getPost } from "@/lib/get-posts";
import { ReplyOutline } from "@/lib/icons";
import {
	Bookmark,
	Heart,
	MessageCircle,
	MoreHorizontal,
	Share2
} from "lucide-react";
import Link from "next/link";

export default async function PostPage({
	params
}: {
	params: Promise<{ handle: string; id: string }>;
}) {
	const { handle, id } = await params;

	const post = await getPost(handle, id);

	if (!post) {
		return <div>Post not found</div>;
	}

	return (
		<div className="bg-background flex relative">
			<div className="relative">
				<div className="absolute top-10 z-20 isolate left-0 w-full flex justify-between py-2 px-6">
					<Link
						href="/"
						className="rounded-full flex items-center justify-center bg-secondary h-12.5 w-12.5 drop-shadow-xl"
					>
						<ReplyOutline />
					</Link>
					<Link
						href="#"
						className="rounded-full flex items-center justify-center bg-secondary h-12.5 w-12.5 drop-shadow-xl"
					>
						<MoreHorizontal />
					</Link>
				</div>
				{post.type === "text" && (
					<>
						<div className="relative w-full min-w-[100vw] mt-30 py-4 px-6 space-y-4 border-b-1">
							{/* Post header */}
							<div className="space-y-3">
								<p className="text-xl leading-relaxed">
									{post.content}
								</p>
								<div className="flex flex-wrap gap-2">
									{post.hashtags?.map(
										(tag, i) => (
											<span
												key={i}
												className="text-primary hover:underline cursor-pointer text-lg"
											>
												#{tag}
											</span>
										)
									)}
								</div>
							</div>
							<div className="flex items-center justify-between gap-x-6 pt-2 text-foreground">
								<Metric
									icon={
										<Heart className="w-6 h-6" />
									}
									value={post.likes!}
								/>
								<Metric
									icon={
										<Share2 className="w-6 h-6" />
									}
									value={post.shares!}
								/>
								<Metric
									icon={
										<Bookmark className="w-6 h-6" />
									}
									value={post.bookmarks!}
								/>
								<Metric
									icon={
										<MessageCircle className="w-6 h-6" />
									}
									value={
										post.commentMetric!
									}
								/>
							</div>
						</div>
						{/* CommentList*/}
					</>
				)}
				{post.type === "image" &&
					post.backgroundImage && (
						<>
							<div className="h-screen">
								<img
									src={
										post.backgroundImage
									}
									alt="Post media"
									className="w-full h-full object-cover"
								/>
							</div>
							{/* PostDesc */}
						</>
					)}
				{post.type === "video" && post.videoSrc && (
					<>
						<div className="h-screen">
							<video
								src={post.videoSrc}
								className="min-w-[100vw] h-full object-cover"
								autoPlay
								poster={
									post.backgroundImage
								}
								loop
								muted
							/>
						</div>
						{/* PostDesc */}
					</>
				)}
			</div>
		</div>
	);
}
