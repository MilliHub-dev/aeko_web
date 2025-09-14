"use client";

import { Button } from "../../ui/button";
import { Avatar } from "@base-ui-components/react/avatar";
import { getAllStories } from "@/lib/stories-queries";
import { useRouter } from "next/navigation";

const Stories = () => {
	const stories = getAllStories();
	const router = useRouter();
	const handleRoute = (
		event: React.MouseEvent<HTMLDivElement>,
		username: string,
		id: string
	) => {
		if (
			(event.target as HTMLElement).closest(
				"button, a"
			)
		)
			return;
		event.preventDefault();
		event.stopPropagation();
		router.push(`/stories/${username}/story/${id}`);
	};
	return (
		<div className="hidden md:block relative border-r-1 border-border/30 bg-background">
			<div className="w-full sticky top-0 h-screen overflow-y-auto bg-background no-scrollbar">
				{/* Add Story */}
				<div className="flex flex-col items-center gap-2 py-6">
					<Button
						variant="outline"
						className="inline-flex size-12 items-center justify-center overflow-hidden rounded-full bg-gray-100 align-middle text-base font-medium text-black select-none outline-primary/50  cursor-pointer hover:border-primary/70 transition-colors outline-4 outline-offset-4"
					>
						<span className="text-xl sm:text-2xl">
							+
						</span>
					</Button>
					<p className="text-[10px] sm:text-xs text-muted-foreground truncate w-20 text-center">
						Add Story
					</p>
				</div>

				{/* Story Circles (scrollable content) */}
				<div className="flex flex-col gap-6 px-6">
					{stories.map((story, i) => (
						<div
							onClick={(event) =>
								handleRoute(
									event,
									story.username,
									story.stories[0].id
								)
							}
							key={i}
							className="flex flex-col items-center gap-2"
						>
							<Avatar.Root className="inline-flex size-12 items-center justify-center overflow-hidden rounded-full bg-gray-100 align-middle text-base font-medium text-black select-none outline-primary/50  cursor-pointer hover:border-primary/70 transition-colors outline-4 outline-offset-4">
								<Avatar.Image
									src={story.avatarUrl}
									width="48"
									height="48"
									className="size-full object-cover"
								/>
							</Avatar.Root>

							<p className="text-[10px] sm:text-xs text-muted-foreground truncate w-20 text-center">
								{story.username}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export { Stories };
