import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PostProps } from "./post";
import Image from "next/image";
import { PostHeader } from "./post-header";
import { CommentSection } from "./post-modal-comment";
import { PostEngagement } from "./post-engagement";

interface PostModalProps extends PostProps {
	isOpen: boolean;
	onClose: () => void;
}

export function PostModal({
	isOpen,
	onClose,
	type,
	username,
	handle,
	profileImage,
	backgroundImage,
	videoSrc,
	content,
	likes,
	shares,
	bookmarks,
	comments,
	hashtags,
	timePosted
}: PostModalProps) {
	return (
		<Dialog
			open={isOpen}
			onOpenChange={onClose}
		>
			<DialogContent className="p-0 bg-background w-full max-w-7xl md:aspect-square lg:aspect-[16/9] rounded-lg overflow-hidden">
				<DialogTitle className="sr-only">{username}'s Post</DialogTitle>

				<div className="grid grid-cols-1 grid-rows-5 xl:grid-rows-1 xl:grid-cols-5 h-full">
					{/* Media */}
					<div className="relative bg-black h-100 xl:row-span-1 xl:h-full w-full xl:col-span-3">
						{type === "image" && backgroundImage && (
							<Image
								src={backgroundImage}
								alt="Post media"
								fill
								className="object-cover"
								priority
							/>
						)}

						{type === "video" && videoSrc && (
							<video
								src={videoSrc}
								className="w-full h-full object-cover"
								controls
								poster={backgroundImage}
								loop
							/>
						)}
					</div>

					{/* Content Panel */}
					<div className="flex flex-col h-full bg-background row-span-3 xl:row-span-1 xl:col-span-2">
						{/* Header */}
						<div className="p-4 border-b border-border xl:mt-8">
							<PostHeader
								username={username!}
								handle={handle!}
								profileImage={profileImage!}
								avatarBackground="bg-none"
								avatarText="text-primary"
							/>
						</div>

						{/* Scrollable content */}
						<div className="flex-1 overflow-y-auto p-4 space-y-6">
							{/* Caption */}
							<div>
								<p className="text-sm md:text-base leading-relaxed mb-2">
									{content}
								</p>
								<div className="flex flex-wrap gap-2">
									{hashtags?.map((tag, index) => (
										<span
											key={index}
											className="text-primary hover:underline cursor-pointer text-xs md:text-sm"
										>
											#{tag}
										</span>
									))}
								</div>
							</div>

							{/* Comments */}
							<CommentSection postId={username!} />
						</div>

						{/* Engagement Footer */}
						<div className="p-4 border-t border-border">
							<PostEngagement
								likes={likes}
								comments={comments}
								shares={shares}
								bookmarks={bookmarks}
							/>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
