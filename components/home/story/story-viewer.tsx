"use client";

import { Button } from "@/components/ui/button";
import { UserStoryGroup } from "@/types/story";
import { Dialog } from "@base-ui-components/react/dialog";
import clsx from "clsx";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface StoryViewerProps {
	userStories: UserStoryGroup;
	storyId: string;
	prevUser?: UserStoryGroup | null;
	nextUser?: UserStoryGroup | null;
}

const StoryViewer = ({
	userStories,
	storyId,
	prevUser,
	nextUser
}: StoryViewerProps) => {
	const router = useRouter();

	const handleClose = () => router.back();

	const currentStoryIndex = userStories.stories.findIndex(
		(s) => s.id === storyId
	);
	const currentStory =
		userStories.stories[currentStoryIndex];

	const goNext = () => {
		const nextStory =
			userStories.stories[currentStoryIndex + 1];

		if (nextStory) {
			router.replace(
				`/home/stories/${userStories.username}/story/${nextStory.id}`
			);
		} else if (nextUser) {
			router.replace(
				`/home/stories/${nextUser.username}/story/${nextUser.stories[0].id}`
			);
		} else {
			handleClose();
		}
	};

	const goPrev = () => {
		const prevStory =
			userStories.stories[currentStoryIndex - 1];

		if (prevStory) {
			router.replace(
				`/home/stories/${userStories.username}/story/${prevStory.id}`
			);
		} else if (prevUser) {
			const lastStory =
				prevUser.stories[
					prevUser.stories.length - 1
				];
			router.replace(
				`/home/stories/${prevUser.username}/story/${lastStory.id}`
			);
		} else {
			handleClose();
		}
	};

	return (
		<Dialog.Root
			defaultOpen={true}
			onOpenChange={handleClose}
		>
			<Dialog.Portal>
				<Dialog.Backdrop className="isolate relative">
					<div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
				</Dialog.Backdrop>
				<Dialog.Popup className="fixed inset-0 flex items-center justify-center outline-none m-0 gap-6">
					<div className="fixed top-8 right-12">
						<Dialog.Close
							autoFocus
							className="bg-black/30 backdrop-blur-md border border-white/20 shadow-[inset_0_1px_4px_rgba(255,255,255,0.25),0_4px_10px_rgba(0,0,0,0.35),0_0_12px_rgba(255,255,255,0.15)] w-16 h-16 rounded-full flex items-center justify-center cursor-pointer select-none focus-visible:outline-2 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
							onClick={handleClose}
							tabIndex={0}
						>
							<X className="w-5 h-5" />
						</Dialog.Close>
					</div>
					<Button
						size="icon"
						onClick={goPrev}
						className="bg-black/30 backdrop-blur-md border border-white/20 shadow-[inset_0_1px_4px_rgba(255,255,255,0.25),0_4px_10px_rgba(0,0,0,0.35),0_0_12px_rgba(255,255,255,0.15)] w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
					>
						<ArrowLeft className="w-6 h-6 text-white" />
					</Button>

					<div className="relative flex flex-col items-center justify-center  bg-black lg:w-[35rem] lg:h-[61.12rem] w-[40rem] h-[71.12rem] rounded-lg overflow-hidden">
						<h1 className="absolute top-12 left-0 right-0 text-white text-center font-bold text-3xl">
							Header
						</h1>
						<div className="flex items-center justify-center w-full h-full">
							{currentStory?.mediaType ===
							"image" ? (
								<Image
									src={
										currentStory.mediaUrl
									}
									alt="Story media"
									fill
									priority
									className={clsx(
										"object-contain"
									)}
								/>
							) : (
								<video
									src={
										currentStory?.mediaUrl
									}
									autoPlay
									loop
									muted
									playsInline
									className="inset-0 object-cover"
								/>
							)}
						</div>
						<h1 className="absolute bottom-12 left-0 right-0 text-white text-center font-bold text-3xl">
							Footer
						</h1>
					</div>

					<Button
						size="icon"
						onClick={goNext}
						className="bg-black/30 backdrop-blur-md border border-white/20 shadow-[inset_0_1px_4px_rgba(255,255,255,0.25),0_4px_10px_rgba(0,0,0,0.35),0_0_12px_rgba(255,255,255,0.15)] w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
					>
						<ArrowRight className="w-6 h-6 text-white" />
					</Button>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export { StoryViewer };

{
	/* <Button
	size="icon"
	onClick={handleClose}
	className="bg-black/30 backdrop-blur-md border border-white/20 shadow-[inset_0_1px_4px_rgba(255,255,255,0.25),0_4px_10px_rgba(0,0,0,0.35),0_0_12px_rgba(255,255,255,0.15)] w-16 h-16 rounded-full flex items-center justify-center cursor-pointer select-none focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100"
>
	<X className="w-5 h-5" />
</Button>; */
}
