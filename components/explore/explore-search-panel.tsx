"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Play, X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface RecentSearchUser {
	id: number;
	name: string;
	username: string;
	avatar: string;
}

export interface ViralPost {
	id: number;
	title: string;
	subtitle?: string;
	thumbnail: string;
}

interface ExploreSearchResultsProps {
	recentUsers: RecentSearchUser[];
	recentSearches: string[];
	trendingTopics: string[];
	viralPosts: ViralPost[];
	className?: string;
}

export function ExploreSearchResults({
	recentUsers,
	recentSearches,
	trendingTopics,
	viralPosts,
	className
}: ExploreSearchResultsProps) {
	return (
		<div
			className={cn(
				"mx-auto w-full max-w-3xl space-y-8 rounded-3xl border border-border/60 bg-background/95 p-6 shadow-xl backdrop-blur",
				className
			)}
		>
			<SearchSection title="Recent Search">
				<div className="flex flex-wrap gap-6">
					{recentUsers.map((user) => (
						<button
							key={user.id}
							type="button"
							className="flex w-20 flex-col items-center gap-2 text-center"
						>
							<Avatar className="h-14 w-14">
								<AvatarImage src={user.avatar} alt={user.name} />
								<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
							</Avatar>
							<div className="space-y-0.5">
								<p className="truncate text-sm font-medium text-foreground">
									{user.name}
								</p>
								<p className="truncate text-xs text-muted-foreground">
									{user.username}
								</p>
							</div>
						</button>
					))}
				</div>
				<div className="space-y-3">
					{recentSearches.map((entry, index) => (
						<div
							key={`${entry}-${index}`}
							className="flex items-center justify-between border-b border-border/30 pb-2 last:border-b-0 last:pb-0"
						>
							<span className="text-sm text-foreground">{entry}</span>
							<button
								type="button"
								className="text-muted-foreground transition hover:text-foreground"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
					))}
				</div>
			</SearchSection>

			<SearchSection title="Trending Topics">
				<div className="flex flex-wrap gap-3">
					{trendingTopics.map((topic, index) => (
						<Badge
							key={`${topic}-${index}`}
							variant="outline"
							className="flex items-center gap-2 rounded-full bg-secondary/5 px-4 py-2 text-sm text-secondary"
						>
							{topic}
							<X className="h-3 w-3" />
						</Badge>
					))}
				</div>
			</SearchSection>

			<SearchSection title="Watch viral posts">
				<div className="grid grid-cols-2 gap-3">
					{viralPosts.map((post) => (
						<button
							key={post.id}
							type="button"
							className="group relative aspect-[10/13] overflow-hidden rounded-2xl"
						>
							<Image
								fill
								src={post.thumbnail}
								alt={post.title}
								className="object-cover transition duration-300 group-hover:scale-[1.03]"
							/>
							<div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent" />
							<div className="absolute inset-0 flex flex-col justify-end p-3 text-left text-white">
								<p className="text-sm font-semibold leading-tight">
									{post.title}
								</p>
								{post.subtitle && (
									<span className="mt-1 text-xs text-white/80">
										{post.subtitle}
									</span>
								)}
								<div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs">
									<Play className="h-3.5 w-3.5" />
									<span>Play</span>
								</div>
							</div>
						</button>
					))}
				</div>
			</SearchSection>
		</div>
	);
}

interface SearchSectionProps {
	title: string;
	children: ReactNode;
}

function SearchSection({ title, children }: SearchSectionProps) {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
					{title}
				</h3>
				<button
					type="button"
					className="rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
				>
					<X className="h-4 w-4" />
				</button>
			</div>
			{children}
		</div>
	);
}

