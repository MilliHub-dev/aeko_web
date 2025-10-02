"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
	Search,
	UserPlus,
	LayoutGrid,
	Share2,
	ChevronRight,
	Heart,
	MessageCircle,
	Bookmark
} from "lucide-react";

interface CommunitySummary {
	slug: string;
	name: string;
	category: string;
	description: string;
	members: string;
	cover: string;
	isFollowing: boolean;
}

interface ExploreCommunity extends CommunitySummary {
	growth: string;
}

interface TrendingPost {
	id: string;
	community: string;
	user: string;
	handle: string;
	avatar: string;
	image: string;
	likes: string;
	comments: string;
	shares: string;
}

const myCommunities: CommunitySummary[] = [
	{
		slug: "christian-prayer",
		name: "Christian Prayer & Fasting",
		category: "Faith",
		description:
			"If one could have faith as small as a mustard seed, we can tell a mountain to move.",
		members: "+ 11k others",
		cover: "/communities/faith.jpg",
		isFollowing: true
	},
	{
		slug: "piano-life",
		name: "Piano",
		category: "Music",
		description: "Piano is life.",
		members: "+ 30k others",
		cover: "/communities/piano.jpg",
		isFollowing: true
	},
	{
		slug: "creative-arts",
		name: "Creative Arts Studio",
		category: "Creative",
		description:
			"Daily sketch sprints, live critiques, and supply swaps.",
		members: "+ 8k others",
		cover: "/communities/creative.jpg",
		isFollowing: true
	}
];

const exploreCommunities: ExploreCommunity[] = [
	{
		slug: "sports-hub",
		name: "Sports Hub",
		category: "Sports",
		description:
			"Skating is not just a sport, it's a lifestyle.",
		members: "+ 11k others",
		cover: "/communities/sports.jpg",
		growth: "+6.2% weekly",
		isFollowing: false
	},
	{
		slug: "music-makers",
		name: "Music Makers",
		category: "Music",
		description:
			"Studio workflows, mixes, and collaborative jams.",
		members: "+ 9k others",
		cover: "/communities/music.jpg",
		growth: "+4.4% weekly",
		isFollowing: false
	},
	{
		slug: "dao-builders",
		name: "DAO Builders Circle",
		category: "DeFi",
		description:
			"Operational excellence for tokenised communities.",
		members: "+ 12k others",
		cover: "/communities/dao-builders.jpg",
		growth: "+5.1% weekly",
		isFollowing: false
	}
];

const trendingPosts: TrendingPost[] = [
	{
		id: "post-1",
		community: "Christian Prayer & Fasting",
		user: "Joshua Martins",
		handle: "@dJoshmart",
		avatar: "/users/alex-rivera.jpg",
		image: "/posts/prayer-cap.jpg",
		likes: "120K",
		comments: "200",
		shares: "25"
	},
	{
		id: "post-2",
		community: "Sports Hub",
		user: "Debby",
		handle: "@finegirllikedebs",
		avatar: "/users/emily-carter.jpg",
		image: "/posts/tennis-action.jpg",
		likes: "18.4K",
		comments: "340",
		shares: "56"
	}
];

const exploreFilters = [
	"For You",
	"DeFi",
	"NFTs",
	"Trading",
	"Technology"
];

export default function CommunitiesPage() {
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [primaryTab, setPrimaryTab] = useState<
		"my" | "explore"
	>("my");
	const [exploreFilter, setExploreFilter] =
		useState<string>(exploreFilters[0]);

	const filteredExploreCommunities = useMemo(() => {
		if (exploreFilter === "For You")
			return exploreCommunities;
		return exploreCommunities.filter(
			(community) =>
				community.category === exploreFilter
		);
	}, [exploreFilter]);

	return (
		<div className="relative min-h-screen overflow-hidden bg-background">
			<div
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,hsla(var(--primary),0.18),transparent_60%),radial-gradient(circle_at_90%_0%,hsla(var(--muted-foreground),0.12),transparent_55%),linear-gradient(180deg,rgba(6,12,24,0.85),rgba(6,12,24,0.95))]"
				aria-hidden="true"
			/>
			<div className="relative z-10 mx-auto w-full px-4 pb-24 pt-8 sm:px-6 lg:px-8">
				<header className="flex items-center justify-between gap-3 px-4 py-3">
					<div className="flex items-center gap-4">
						<h1 className="text-3xl font-semibold tracking-tight text-foreground">
							Communities
						</h1>
					</div>
					<div className="flex items-center gap-2">
						<button
							className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"
							onClick={() =>
								setSearchOpen(
									(prev) => !prev
								)
							}
							aria-label="Search communities"
						>
							<Search className="h-5 w-5" />
						</button>
					</div>
				</header>

				{searchOpen && (
					<div className="mt-4 rounded-[24px] border border-border/50 bg-card/90 p-4 shadow-lg backdrop-blur">
						<div className="flex items-center gap-3 rounded-full border border-border/60 bg-background/80 px-4 py-2">
							<Search className="h-4 w-4 text-muted-foreground" />
							<Input
								autoFocus
								value={searchQuery}
								onChange={(event) =>
									setSearchQuery(
										event.target.value
									)
								}
								placeholder="Search communities, hosts, topics"
								className="flex-1 border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
							/>
							<button
								className="text-xs font-semibold text-primary"
								onClick={() =>
									setSearchQuery("")
								}
							>
								Clear
							</button>
						</div>
						{searchQuery ? (
							<p className="mt-3 text-xs text-muted-foreground">
								Showing quick matches for
								&quot;{searchQuery}&quot;
							</p>
						) : (
							<p className="mt-3 text-xs text-muted-foreground">
								Type to see recent searches
								and suggested hosts.
							</p>
						)}
					</div>
				)}

				<div className="mt-6 flex mx-auto w-full max-w-4xl items-center rounded-full border border-border/60 bg-card/80 p-1 text-sm font-semibold text-muted-foreground">
					{(["my", "explore"] as const).map(
						(tab) => (
							<button
								key={tab}
								onClick={() =>
									setPrimaryTab(tab)
								}
								className={cn(
									"flex-1 rounded-full px-4 py-2 transition",
									primaryTab === tab
										? "bg-primary text-primary-foreground shadow-sm"
										: "text-muted-foreground hover:text-primary"
								)}
							>
								{tab === "my"
									? "My Communities"
									: "Explore"}
							</button>
						)
					)}
				</div>

				<div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
					<main className="space-y-12">
						{primaryTab === "my" ? (
							<section className="space-y-6">
								<div className="flex items-center justify-between">
									<div>
										<h2 className="text-lg font-semibold text-foreground">
											Communities you
											follow
										</h2>
										<p className="text-sm text-muted-foreground">
											Manage the
											circles you
											contribute to
											regularly.
										</p>
									</div>
									<Link
										href="/communities/following"
										className="text-sm font-semibold text-primary"
									>
										See all
									</Link>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									{myCommunities.map(
										(community) => (
											<CommunityCard
												key={
													community.slug
												}
												community={
													community
												}
											/>
										)
									)}
								</div>
							</section>
						) : (
							<section className="space-y-6">
								<div className="flex flex-wrap items-center justify-between gap-3">
									<div>
										<h2 className="text-lg font-semibold text-foreground">
											Featured
											communities
										</h2>
										<p className="text-sm text-muted-foreground">
											Tailored picks
											based on what
											you engage with.
										</p>
									</div>
									<div className="flex items-center gap-2">
										{exploreFilters.map(
											(filter) => (
												<button
													key={
														filter
													}
													onClick={() =>
														setExploreFilter(
															filter
														)
													}
													className={cn(
														"rounded-full px-3 py-1 text-xs font-semibold transition",
														exploreFilter ===
															filter
															? "bg-primary text-primary-foreground"
															: "border border-border/50 bg-background/80 text-muted-foreground hover:border-primary/30 hover:text-primary"
													)}
												>
													{filter}
												</button>
											)
										)}
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									{filteredExploreCommunities.map(
										(community) => (
											<ExploreCommunityCard
												key={
													community.slug
												}
												community={
													community
												}
											/>
										)
									)}
								</div>
							</section>
						)}

						{/* <section className="space-y-6">
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-semibold text-foreground">
									Trending posts from
									communities
								</h2>
								<button className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
									View feed
									<ChevronRight className="h-4 w-4" />
								</button>
							</div>
							<div className="space-y-4">
								{trendingPosts.map(
									(post) => (
										<TrendingPostCard
											key={post.id}
											post={post}
										/>
									)
								)}
							</div>
						</section> */}
					</main>

					<aside className="space-y-6">
						<div className="rounded-[28px] border border-border/60 bg-card/80 p-6 shadow-sm">
							<h3 className="text-sm font-semibold text-foreground">
								Host a live moment
							</h3>
							<p className="mt-2 text-xs text-muted-foreground">
								Spin up a room for AMAs,
								prayer circles, or creative
								sessions.
							</p>
							<Button className="mt-4 w-full rounded-full text-sm">
								Create community
							</Button>
						</div>
						<div className="rounded-[28px] border border-border/60 bg-primary/10 p-6 text-sm text-primary">
							Keep an eye on safety guidelines
							and signal moderators if you
							spot anything suspicious.
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}

function CommunityCard({
	community
}: {
	community: CommunitySummary;
}) {
	return (
		<Link
			href={`/communities/${community.slug}`}
			className="relative overflow-hidden rounded-[28px] border border-border/50 bg-background/80 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
		>
			<div className="relative aspect-[4/3]">
				<Image
					src={community.cover}
					alt={community.name}
					fill
					sizes="(max-width: 768px) 100vw, 50vw"
					className="object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
				<div className="absolute inset-x-4 top-4 flex items-center justify-between">
					<Badge className="rounded-full bg-primary/80 px-3 py-1 text-xs font-semibold text-primary-foreground">
						{community.category}
					</Badge>
					<Button
						variant="secondary"
						size="sm"
						className="rounded-full px-4 text-xs font-semibold"
					>
						{community.isFollowing
							? "Unfollow"
							: "Follow"}
					</Button>
				</div>
				<div className="absolute inset-x-4 bottom-4 space-y-2 text-white">
					<h3 className="text-lg font-semibold">
						{community.name}
					</h3>
					<p className="text-xs text-white/80">
						{community.description}
					</p>
					<AvatarStack
						members={community.members}
					/>
				</div>
			</div>
		</Link>
	);
}

function ExploreCommunityCard({
	community
}: {
	community: ExploreCommunity;
}) {
	return (
		<Link
			href={`/communities/${community.slug}`}
			className="relative overflow-hidden rounded-[28px] border border-border/50 bg-background/80 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
		>
			<div className="relative aspect-[4/3]">
				<Image
					src={community.cover}
					alt={community.name}
					fill
					sizes="(max-width: 768px) 100vw, 50vw"
					className="object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
				<div className="absolute inset-x-4 top-4 flex items-center justify-between text-xs font-semibold text-white">
					<Badge className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
						{community.category}
					</Badge>
					<Badge className="rounded-full bg-primary/80 px-3 py-1 text-xs font-semibold text-primary-foreground">
						{community.growth}
					</Badge>
				</div>
				<div className="absolute inset-x-4 bottom-4 space-y-2 text-white">
					<h3 className="text-lg font-semibold">
						{community.name}
					</h3>
					<p className="text-xs text-white/80">
						{community.description}
					</p>
					<div className="flex items-center justify-between text-xs">
						<AvatarStack
							members={community.members}
						/>
						<Button
							variant="secondary"
							size="sm"
							className="rounded-full bg-white/90 px-4 text-xs font-semibold text-foreground"
						>
							{community.isFollowing
								? "Unfollow"
								: "Follow"}
						</Button>
					</div>
				</div>
			</div>
		</Link>
	);
}

function TrendingPostCard({
	post
}: {
	post: TrendingPost;
}) {
	return (
		<article className="relative overflow-hidden rounded-[32px] border border-border/60 bg-card/80 shadow-md">
			<div className="relative aspect-[4/5]">
				<Image
					src={post.image}
					alt={post.user}
					fill
					sizes="(max-width: 768px) 100vw, 50vw"
					className="object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
				<div className="absolute inset-x-4 top-4 flex items-center justify-between text-white">
					<div className="flex items-center gap-2 rounded-full bg-black/50 px-4 py-2">
						<Avatar className="h-8 w-8 border-2 border-white/80">
							<AvatarImage
								src={post.avatar}
								alt={post.user}
							/>
							<AvatarFallback>
								{post.user.slice(0, 2)}
							</AvatarFallback>
						</Avatar>
						<div className="leading-tight">
							<p className="text-sm font-semibold">
								{post.user}
							</p>
							<p className="text-xs text-white/70">
								{post.handle}
							</p>
						</div>
					</div>
					<Button
						variant="secondary"
						size="sm"
						className="rounded-full bg-black/50 px-4 text-xs text-white"
					>
						<UserPlus className="mr-2 h-4 w-4" />
						Follow
					</Button>
				</div>
				<div className="absolute inset-x-4 bottom-4">
					<div className="flex items-center gap-2 text-xs text-white/80">
						<Badge className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
							{post.community}
						</Badge>
					</div>
				</div>
			</div>
			<div className="flex items-center justify-between gap-4 px-5 py-4 text-sm text-muted-foreground">
				<div className="flex items-center gap-4">
					<span className="flex items-center gap-1 text-rose-500">
						<Heart className="h-4 w-4" />
						{post.likes}
					</span>
					<span className="flex items-center gap-1">
						<MessageCircle className="h-4 w-4" />
						{post.comments}
					</span>
					<span className="flex items-center gap-1">
						<Bookmark className="h-4 w-4" />
						{post.shares}
					</span>
				</div>
				<button className="text-xs font-semibold text-primary">
					Report
				</button>
			</div>
		</article>
	);
}

function AvatarStack({ members }: { members: string }) {
	return (
		<div className="flex items-center gap-3 text-xs text-white/80">
			<div className="flex -space-x-3">
				{[
					"/users/mike-chen.jpg",
					"/users/sarah-johnson.jpeg",
					"/users/lisa-wong.jpeg"
				].map((avatar, index) => (
					<Avatar
						key={avatar + index}
						className="h-8 w-8 border-2 border-white"
					>
						<AvatarImage
							src={avatar}
							alt="Community member"
						/>
						<AvatarFallback>CM</AvatarFallback>
					</Avatar>
				))}
			</div>
			<span>{members}</span>
		</div>
	);
}
