import { Dialog } from "@base-ui-components/react/dialog";
import { PostProps } from "./post";
import Image from "next/image";
import { PostHeader } from "./post-header";
import { CommentSection } from "./post-modal-comment";
import { PostEngagement } from "./post-engagement";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface PostModalProps extends PostProps {
	isOpen: boolean;
	onClose: () => void;
}

const PostModal = ({ isOpen, onClose, ...props }: PostModalProps) => {
	return (
		<AnimatePresence>
			{isOpen && (
				<Dialog.Root
					open={isOpen}
					onOpenChange={onClose}
				>
					<Dialog.Portal>
						<Dialog.Backdrop>
							<motion.div
								className="fixed inset-0 bg-black/50 backdrop-blur-sm"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
							/>
						</Dialog.Backdrop>

						<Dialog.Popup className="outline-none">
							<motion.div
								initial={{ opacity: 0, y: "10px", scale: 0.98 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: "10px", scale: 0.98 }}
								transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
								className="fixed inset-0 z-50 flex bg-background"
							>
								{/* Media Section */}
								<div className="flex-1 bg-black relative">
									{props.type === "image" && props.backgroundImage && (
										<div className="relative w-full h-full">
											<Image
												src={props.backgroundImage}
												alt="Post media"
												fill
												className="object-contain"
												priority
											/>
										</div>
									)}
									{props.type === "video" && props.videoSrc && (
										<video
											src={props.videoSrc}
											className="w-full h-full object-cover"
											controls
											poster={props.backgroundImage}
											loop
										/>
									)}
								</div>

								{/* Content Panel */}
								<div className="hidden w-full sm:w-[400px] max-w-[100%] h-full md:flex flex-col bg-background border-l border-neutral-200 relative">
									{/* Close Button */}
									<Dialog.Close className="absolute top-4 right-4 p-2 z-10 bg-secondary rounded-full hover:bg-neutral-100 transition-colors">
										<X className="w-6 h-6 text-neutral-600" />
									</Dialog.Close>

									{/* Header */}
									<div className="shrink-0 p-4 pt-16 xl:pt-20 border-b border-neutral-200">
										<PostHeader
											username={props.username!}
											handle={props.handle!}
											profileImage={props.profileImage!}
											avatarBackground="bg-none"
											avatarText="text-primary"
											className="bg-secondary rounded-lg p-2 border"
										/>
									</div>

									{/* Scrollable Content */}
									<div className="flex-1 overflow-y-auto p-4 space-y-6">
										{/* Caption */}
										<div>
											<p className="text-sm md:text-base leading-relaxed mb-2">
												{props.content}
											</p>
											<div className="flex flex-wrap gap-2">
												{props.hashtags?.map((tag, index) => (
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
										<CommentSection postId={props.username!} />
									</div>

									{/* Engagement Footer */}
									<div className="shrink-0 p-4 border-t border-neutral-200">
										<PostEngagement
											likes={props.likes}
											comments={props.comments}
											shares={props.shares}
											bookmarks={props.bookmarks}
										/>
									</div>
								</div>
							</motion.div>
						</Dialog.Popup>
					</Dialog.Portal>
				</Dialog.Root>
			)}
		</AnimatePresence>
	);
};

export { PostModal };
