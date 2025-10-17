"use client";

import { getAllStories } from "@/lib/stories-queries";
import { useRouter } from "next/navigation";

export function Stories() {
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
		router.push(
			`/home/stories/${username}/story/${id}`
		);
	};

	return (
		<aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-24 shrink-0 md:flex">
			<div className="relative flex h-full w-full flex-col items-center overflow-hidden rounded-[32px] border-none shadow-sm bg-secondary/30">
				<div className="mt-6 flex flex-col items-center gap-3 px-4">
					<button
						type="button"
						onClick={() => router.push("/home")}
						className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 transition hover:bg-primary/90"
					>
						+
					</button>
					<p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
						New
					</p>
				</div>

				<div className="mt-4 flex-1 w-full overflow-y-auto pb-6 pr-1">
					<div className="flex flex-col items-center gap-5 pt-2">
						{stories.map((story) => (
							<div
								key={story.username}
								onClick={(event) =>
									handleRoute(
										event,
										story.username,
										story.stories[0].id
									)
								}
								className="flex flex-col items-center gap-2 text-center text-muted-foreground transition hover:text-foreground"
							>
								<div className="relative h-12 w-12 overflow-hidden rounded-full border border-border/60 shadow-inner outline-primary/30 outline-4 outline-offset-4">
									<img
										src={
											story.avatarUrl
										}
										alt={story.username}
										className="h-full w-full object-cover"
									/>
								</div>
								<p className="w-16 truncate text-[11px]">
									{story.username}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</aside>
	);
}
