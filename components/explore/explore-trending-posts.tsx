"use client";

import Image from "next/image";
import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from "@/components/ui/avatar";
import {
	Bookmark,
	Eye,
	Heart,
	MessageCircle,
	Share2
} from "lucide-react";
import type { ReactNode } from "react";

export interface ExploreTrendingPost {
	id: number;
	cover: string;
	title: string;
	caption: string;
	hashtags: string[];
	metrics: {
		views?: string;
		likes: string;
		comments: string;
		shares: string;
		bookmarks?: string;
	};
	author: {
		name: string;
		handle: string;
		avatar: string;
	};
	badge?: string;
}

interface ExploreTrendingPostsProps {
	posts: ExploreTrendingPost[];
	activeFilter?: string;
}

export function ExploreTrendingPosts({
	posts,
	activeFilter
}: ExploreTrendingPostsProps) {
	return (
		<section className="space-y-6">
			<header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h2 className="text-2xl font-semibold text-foreground">
						Trending Posts
					</h2>
					<p className="text-sm text-muted-foreground">
						{activeFilter
							? `Now trending in ${activeFilter}`
							: "Fresh drops and conversations people are engaging with right now."}
					</p>
				</div>
				<button
					type="button"
					className="text-sm font-semibold text-secondary transition hover:text-secondary/80"
				>
					See more
				</button>
			</header>
			<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
				{posts.map((post) => (
					<article
						key={post.id}
						className="group relative aspect-[3/4] overflow-hidden rounded-[32px] bg-black/5 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl sm:aspect-[4/5]"
					>
						<Image
							fill
							src={post.cover}
							alt={post.title}
							sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
							className="object-cover transition duration-500 group-hover:scale-[1.03]"
						/>
						<div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/50 to-black/90" />
						<div className="absolute inset-0 flex flex-col justify-between p-5 text-white">
							<div className="flex items-start justify-between gap-3">
								<div className="flex items-center gap-3">
									<Avatar className="h-12 w-12 border-2 border-white/70">
										<AvatarImage
											src={
												post.author
													.avatar
											}
											alt={
												post.author
													.name
											}
										/>
										<AvatarFallback>
											{post.author.name.charAt(
												0
											)}
										</AvatarFallback>
									</Avatar>
									<div className="space-y-0.5">
										<p className="text-sm font-semibold leading-tight">
											{
												post.author
													.name
											}
										</p>
										<p className="text-xs uppercase tracking-wide text-white/70">
											{
												post.author
													.handle
											}
										</p>
									</div>
								</div>
								<div className="flex flex-wrap items-center gap-2 rounded-full bg-black/35 px-3 py-1 text-xs font-medium uppercase tracking-wide">
									{post.badge && (
										<span>
											{post.badge}
										</span>
									)}
									<Metric
										icon={
											<Eye className="h-4 w-4" />
										}
										label={
											post.metrics
												.views
										}
									/>
									<Metric
										icon={
											<Heart className="h-4 w-4" />
										}
										label={
											post.metrics
												.likes
										}
									/>
								</div>
							</div>
							<div className="space-y-3">
								<h3 className="text-lg font-semibold leading-snug">
									{post.title}
								</h3>
								<p className="line-clamp-3 text-sm text-white/80">
									{post.caption}
								</p>
								<div className="flex flex-wrap gap-2 text-xs text-white/75">
									{post.hashtags.map(
										(tag) => (
											<span
												key={tag}
												className="rounded-full bg-white/20 px-3 py-1"
											>
												#{tag}
											</span>
										)
									)}
								</div>
								<div className="flex flex-wrap items-center gap-3 text-xs text-white/80">
									<Metric
										icon={
											<MessageCircle className="h-4 w-4" />
										}
										label={
											post.metrics
												.comments
										}
									/>
									{post.metrics
										.bookmarks && (
										<Metric
											icon={
												<Bookmark className="h-4 w-4" />
											}
											label={
												post.metrics
													.bookmarks
											}
										/>
									)}
									<Metric
										icon={
											<Share2 className="h-4 w-4" />
										}
										label={
											post.metrics
												.shares
										}
									/>
								</div>
							</div>
						</div>
					</article>
				))}
			</div>
		</section>
	);
}

interface MetricProps {
	icon: ReactNode;
	label?: string;
}

function Metric({ icon, label }: MetricProps) {
	if (!label) {
		return null;
	}

	return (
		<span className="inline-flex items-center gap-1">
			{icon}
			{label}
		</span>
	);
}




