"use client";

import { getAllStories } from "@/lib/stories-queries";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMemo } from "react";
import { useStoriesStore } from "@/features/stories/stores";

export function Stories() {
	const stories = getAllStories();
	const router = useRouter();
	const { isStorySeen } = useStoriesStore();

	// Check if user has unseen stories
	const hasUnseenStories = useMemo(() => {
		return stories.some((story) =>
			story.stories.some((s) => !isStorySeen(s.id))
		);
	}, [stories, isStorySeen]);

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
		router.push(
			`/home/stories/${username}/story/${id}`
		);
	};

	if (stories.length === 0) {
		return (
			<aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-24 shrink-0 md:flex">
				<div className="relative flex h-full w-full flex-col items-center overflow-hidden rounded-[32px] border-none shadow-sm bg-secondary/30">
					<div className="flex flex-col items-center justify-center h-full text-center px-4">
						<p className="text-xs text-muted-foreground">
							No stories available
						</p>
					</div>
				</div>
			</aside>
		);
	}

	return (
		<aside 
			className="sticky top-6 hidden h-[calc(100vh-3rem)] w-24 shrink-0 md:flex"
			aria-label="Stories sidebar"
		>
			<div className="relative flex h-full w-full flex-col items-center overflow-hidden rounded-[32px] border-none shadow-sm bg-secondary/30">
				<div className="mt-6 flex flex-col items-center gap-3 px-4">
					<button
						type="button"
						onClick={() => router.push("/home")}
						className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
						aria-label="Create new story"
					>
						+
					</button>
					<p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
						New
					</p>
				</div>

				<div className="mt-4 flex-1 w-full overflow-y-auto pb-6 pr-1">
					<div className="flex flex-col items-center gap-5 pt-2">
						{stories.map((story) => {
							const hasUnseen = story.stories.some((s) => !isStorySeen(s.id));
							const firstStory = story.stories[0];

							return (
								<div
									key={story.username}
									onClick={(event) =>
										handleRoute(
											event,
											story.username,
											firstStory.id
										)
									}
									className="flex flex-col items-center gap-2 text-center text-muted-foreground transition hover:text-foreground cursor-pointer group"
									role="button"
									tabIndex={0}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											router.push(
												`/home/stories/${story.username}/story/${firstStory.id}`
											);
										}
									}}
									aria-label={`View stories by ${story.username}`}
								>
									<div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-border/60 shadow-inner outline-primary/30 outline-4 outline-offset-4 transition-all group-hover:border-primary/50">
										<Image
											src={story.avatarUrl}
											alt={`${story.username}'s avatar`}
											fill
											className="object-cover"
											sizes="48px"
										/>
										{hasUnseen && (
											<div 
												className="absolute inset-0 rounded-full border-2 border-primary"
												aria-label="Unseen stories"
											/>
										)}
									</div>
									<p className="w-16 truncate text-[11px]">
										{story.username}
									</p>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</aside>
	);
}
