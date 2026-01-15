"use client";

import { Dialog } from "@base-ui-components/react/dialog";

import Image from "next/image";

import { CommentSection } from "./post-modal-comment";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { PostProps } from "@/types/post";

interface PostModalProps extends PostProps {
	isOpen: boolean;
}

const PostModal = ({
	isOpen,
	...props
}: PostModalProps) => {
	const router = useRouter();

	const handleClose = () => {
		router.back();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<Dialog.Root
					open={isOpen}
					onOpenChange={handleClose}
				>
					<Dialog.Portal>
						<Dialog.Backdrop className="isolate">
							<motion.div
								className="fixed inset-0 bg-black/50 backdrop-blur-sm"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{
									duration: 0.2
								}}
							/>
						</Dialog.Backdrop>

						<Dialog.Popup className="fixed top-1/2 left-1/2 -mt-8 -translate-x-1/2 -translate-y-[47%] w-96 lg:h-[70rem] lg:w-[120rem]  outline-none m-0">
							<motion.div
								initial={{
									opacity: 0,
									scale: 0.98
								}}
								animate={{
									opacity: 1,
									scale: 1
								}}
								exit={{
									opacity: 0,
									scale: 0.98
								}}
								transition={{
									duration: 0.25,
									ease: [0.16, 1, 0.3, 1]
								}}
								className="z-50 grid grid-cols-3 bg-background h-full"
							>
								{/* Media Section */}
								<div className="col-span-2 bg-black relative">
									{props.type ===
										"image" &&
										props.backgroundImage && (
											<div className="relative w-full h-full">
												<Image
													src={
														props.backgroundImage
													}
													alt="Post media"
													fill
													className="object-contain"
													priority
												/>
											</div>
										)}
									{props.type ===
										"video" &&
										props.videoSrc && (
											<div className="relative w-full h-full">
												<video
													src={
														props.videoSrc
													}
													className="aspect-square object-contain"
													controls
													poster={
														props.backgroundImage
													}
													loop
													muted
												/>
											</div>
										)}
								</div>

								{/* Content Panel */}
								<div className="hidden col-span-1 w-full  h-full md:flex flex-col bg-background border-l border-neutral-200 relative">
									{/* Close Button */}
									<Dialog.Close
										className="absolute top-4 right-4 p-2 z-10 bg-secondary rounded-full hover:bg-neutral-100 transition-colors"
										onClick={
											handleClose
										}
									>
										<X className="w-6 h-6 text-neutral-600" />
									</Dialog.Close>

									<div className="shrink-0 p-4 pt-16 xl:pt-20 border-b border-neutral-200">
										{/* Header */}
									</div>

									{/* Scrollable Content */}
									<div className="flex-1 overflow-y-auto p-4 space-y-6">
										{/* Caption */}
										<div>
											<p className="text-sm md:text-base leading-relaxed mb-2">
												{
													props.content
												}
											</p>
											<div className="flex flex-wrap gap-2">
												{props.hashtags?.map(
													(
														tag,
														index
													) => (
														<span
															key={
																index
															}
															className="text-primary hover:underline cursor-pointer text-xs md:text-sm"
														>
															#
															{
																tag
															}
														</span>
													)
												)}
											</div>
										</div>

										{/* Comments */}
										<CommentSection
											postId={
												props.username!
											}
										/>
									</div>

									{/* Footer */}
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
