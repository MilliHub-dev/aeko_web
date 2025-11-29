"use client";

import { useMemo, useState } from "react";
import type { FocusEvent } from "react";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ExploreHeader } from "@/components/explore/explore-header";
import { ExploreSearchBar } from "@/components/explore/explore-search-bar";
import {
	ExploreSearchResults,
	type RecentSearchUser,
	type ViralPost
} from "@/components/explore/explore-search-panel";
import {
	ExploreTrendingPosts,
	type ExploreTrendingPost
} from "@/components/explore/explore-trending-posts";
import {
	ExploreCommunities,
	type ExploreCommunity
} from "@/components/explore/explore-communities";
import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

type FeaturedStory = {
	id: number;
	title: string;
	subtitle: string;
	cover: string;
	badge?: string;
	stats: string;
	href: string;
};

type CreatorSpotlight = {
	id: number;
	name: string;
	handle: string;
	avatar: string;
	cover: string;
	followers: string;
	category: string;
};

const recentUsers: RecentSearchUser[] = [
	{
		id: 1,
		name: "Dr Mille",
		username: "@drmille",
		avatar: "/users/mike-chen.jpg"
	},
	{
		id: 2,
		name: "Ayo Mash",
		username: "@aymash",
		avatar: "/users/sarah-johnson.jpeg"
	},
	{
		id: 3,
		name: "Debby",
		username: "@fingerlittle",
		avatar: "/users/lisa-wong.jpeg"
	},
	{
		id: 4,
		name: "Joshua Martins",
		username: "@joshmart",
		avatar: "/users/alex-rivera.jpg"
	},
	{
		id: 5,
		name: "Priscilla",
		username: "@priscilla",
		avatar: "/users/emily-carter.jpg"
	}
];

const recentSearches = [
	"Pricillia Baby's announcement",
	"Kussman's Wedding",
	"Kussman's Wife",
	"Kussman's Wife's black eye"
];

const trendingTopics = [
	"#Prici's baby",
	"#you,me,us",
	"#challenge",
	"#newmusic",
	"#wedding",
	"#viral"
];

const discoverFilters = [
	"For You",
	"Trending",
	"DeFi",
	"NFTs",
	"Creators",
	"Live",
	"Technology",
	"Communities"
];

const viralPosts: ViralPost[] = [
	{
		id: 1,
		title: "Art studio reveal",
		subtitle: "120K views",
		thumbnail: "/posts/interior-design-9x16.jpg"
	},
	{
		id: 2,
		title: "Street style cam",
		subtitle: "98K views",
		thumbnail: "/posts/street-photography-4x5.jpg"
	},
	{
		id: 3,
		title: "Chef Mike live",
		subtitle: "75K views",
		thumbnail: "/posts/interior-design.jpg"
	},
	{
		id: 4,
		title: "New profile pic",
		subtitle: "65K views",
		thumbnail: "/posts/street-photography.jpg"
	}
];

const featuredStories: FeaturedStory[] = [
	{
		id: 1,
		title: "Debby's daily glow-up vlog",
		subtitle: "#beauty #popular",
		cover: "/posts/interior-design-9x16.jpg",
		badge: "Watch now",
		stats: "120K views",
		href: "/home/@debby"
	},
	{
		id: 2,
		title: "Street portraits in Lagos",
		subtitle: "Joshua Martins",
		cover: "/posts/street-photography.jpg",
		badge: "Trending",
		stats: "95K views",
		href: "/home/@joshmart"
	},
	{
		id: 3,
		title: "Chef Mike's ramen drop tonight",
		subtitle: "live at 7pm",
		cover: "/posts/interior-design-4x5.jpg",
		badge: "Live",
		stats: "Set reminder",
		href: "/live-streams/chef-mike"
	},
	{
		id: 4,
		title: "Inside the new Tech Creators studio",
		subtitle: "NFTs, DeFi, AI",
		cover: "/posts/interior-design.jpg",
		stats: "42K likes",
		href: "/communities/tech-creators"
	}
];

const trendingCreators: CreatorSpotlight[] = [
	{
		id: 1,
		name: "Debby",
		handle: "@fingerlittle",
		avatar: "/users/lisa-wong.jpeg",
		cover: "/posts/interior-design-4x5.jpg",
		followers: "580K",
		category: "Beauty"
	},
	{
		id: 2,
		name: "Joshua Martins",
		handle: "@joshmart",
		avatar: "/users/alex-rivera.jpg",
		cover: "/posts/street-photography-4x5.jpg",
		followers: "420K",
		category: "Culture"
	},
	{
		id: 3,
		name: "Chef Mike Chen",
		handle: "@chefmikechen",
		avatar: "/users/mike-chen.jpg",
		cover: "/posts/interior-design-9x16.jpg",
		followers: "690K",
		category: "Food"
	}
];

const trendingPosts: ExploreTrendingPost[] = [
	{
		id: 1,
		cover: "/posts/interior-design.jpg",
		title: "New Profile Pic",
		caption:
			"Just framed this shot from the weekend. Natural light is undefeated for portraits!",
		hashtags: ["cute", "pretty", "popular", "loved"],
		metrics: {
			views: "120K",
			likes: "89K",
			comments: "200",
			shares: "25",
			bookmarks: "15"
		},
		author: {
			name: "Debby",
			handle: "@fingerlittle",
			avatar: "/users/lisa-wong.jpeg"
		},
		badge: "Featured"
	},
	{
		id: 2,
		cover: "/posts/street-photography.jpg",
		title: "Joshua on set",
		caption:
			"Took this during last night's session. Moody lighting bringing the story to life.",
		hashtags: ["beardgang", "popular", "viral"],
		metrics: {
			views: "102K",
			likes: "76K",
			comments: "190",
			shares: "19",
			bookmarks: "12"
		},
		author: {
			name: "Joshua Martins",
			handle: "@joshmart",
			avatar: "/users/alex-rivera.jpg"
		},
		badge: "Trending"
	},
	{
		id: 3,
		cover: "/posts/interior-design-4x5.jpg",
		title: "Minimalist loft goals",
		caption:
			"If beige is wrong, I don't want to be right. Captured this beauty for Modern Living.",
		hashtags: ["design", "loft", "aesthetic"],
		metrics: {
			views: "84K",
			likes: "62K",
			comments: "142",
			shares: "12"
		},
		author: {
			name: "Lisa Wong",
			handle: "@lisawongdesigns",
			avatar: "/users/lisa-wong.jpeg"
		}
	},
	{
		id: 4,
		cover: "/posts/interior-design-9x16.jpg",
		title: "Chef Mike's ramen drop",
		caption:
			"Streaming the tonkotsu session tonight. Broth simmered 18 hours - come hungry!",
		hashtags: ["chef", "ramen", "livestream"],
		metrics: {
			views: "68K",
			likes: "54K",
			comments: "168",
			shares: "14",
			bookmarks: "9"
		},
		author: {
			name: "Chef Mike Chen",
			handle: "@chefmikechen",
			avatar: "/users/mike-chen.jpg"
		}
	}
];

const communities: ExploreCommunity[] = [
	{
		id: 1,
		name: "Faith",
		description:
			"If one could have faith as small as a mustard seed you could move mountains.",
		category: "Inspiration",
		cover: "/posts/interior-design-9x16.jpg",
		members: "24.4K"
	},
	{
		id: 2,
		name: "Sports",
		description:
			"Not just the game - it's the discipline, the grind, the glory moments.",
		category: "Lifestyle",
		cover: "/posts/street-photography.jpg",
		members: "18.2K"
	},
	{
		id: 3,
		name: "Tech Creators",
		description:
			"From AI prompts to product drops. Build with the sharpest minds in tech.",
		category: "Technology",
		cover: "/posts/interior-design.jpg",
		members: "32.8K"
	},
	{
		id: 4,
		name: "Global Nomads",
		description:
			"Passport ready? Share itineraries, co-working hacks, and new city blues.",
		category: "Travel",
		cover: "/posts/street-photography-4x5.jpg",
		members: "15.6K"
	}
];

const filterKeywords: Record<string, string[]> = {
	Trending: ["trend", "popular", "viral"],
	DeFi: ["defi", "finance"],
	NFTs: ["nft"],
	Creators: ["design", "creator", "artist"],
	Live: ["live", "stream"],
	Technology: ["tech", "ai", "design"],
	Communities: ["community", "faith", "sports"]
};

export default function ExplorePage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [activeFilter, setActiveFilter] = useState(
		discoverFilters[0]
	);

	const handleSearchFocus = () => {
		setIsSearchOpen(true);
	};

	const handleSearchBlur = (
		event: FocusEvent<HTMLDivElement>
	) => {
		const relatedTarget =
			event.relatedTarget as Node | null;

		if (
			!relatedTarget ||
			!event.currentTarget.contains(relatedTarget)
		) {
			setIsSearchOpen(false);
		}
	};

	const handleSearchClear = () => {
		setSearchQuery("");
		setIsSearchOpen(false);
	};

	const showSearchOverlay =
		isSearchOpen || Boolean(searchQuery);

	const filteredTrendingPosts = useMemo(() => {
		if (activeFilter === "For You") {
			return trendingPosts;
		}

		const keywords = filterKeywords[activeFilter] ?? [];

		const matching = trendingPosts.filter((post) =>
			keywords.some((keyword) =>
				post.hashtags.some((tag) =>
					tag
						.toLowerCase()
						.includes(keyword.toLowerCase())
				)
			)
		);

		return matching.length > 0
			? matching
			: trendingPosts;
	}, [activeFilter]);

	return (
		<main className="mx-auto flex min-h-screen w-full flex-col space-y-12 px-4 pb-20 pt-10 text-foreground sm:px-6 lg:px-8">
			<ExploreHeader className="flex-col items-center gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left" />

			<div
				tabIndex={-1}
				onBlur={handleSearchBlur}
				className="relative"
			>
				<ExploreSearchBar
					value={searchQuery}
					onChange={setSearchQuery}
					onFocus={handleSearchFocus}
					onClear={handleSearchClear}
					showCancel={showSearchOverlay}
				/>
				{showSearchOverlay && (
					<ExploreSearchResults
						recentUsers={recentUsers}
						recentSearches={recentSearches}
						trendingTopics={trendingTopics}
						viralPosts={viralPosts}
						className="absolute left-0 right-0 top-full z-30 mt-4 w-full max-w-3xl mx-auto max-h-[70vh] overflow-y-auto px-1 sm:px-0"
					/>
				)}
			</div>

			<nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pt-2 pb-1 sm:justify-center">
				{discoverFilters.map((filter) => (
					<button
						key={filter}
						type="button"
						onClick={() =>
							setActiveFilter(filter)
						}
						className={cn(
							"whitespace-nowrap rounded-full border border-border/60 bg-background px-4 py-2 text-sm font-semibold text-primary transition hover:border-secondary/40 hover:text-secondary",
							filter === activeFilter &&
								"bg-primary text-white shadow-sm"
						)}
					>
						{filter}
					</button>
				))}
			</nav>

			<section className="space-y-6">
				<header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<h2 className="text-2xl font-semibold">
							Discover today
						</h2>
						<p className="text-sm text-muted-foreground">
							Curated clips, stories, and live
							drops that the community is
							obsessed with.
						</p>
					</div>
					<Link
						href="/explore/topic/trending"
						className="text-sm font-semibold text-secondary transition hover:text-secondary/80"
					>
						See all
					</Link>
				</header>

				<div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
					<FeaturedStoryCard
						story={featuredStories[0]}
						className="min-h-[460px]"
					/>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
						{featuredStories
							.slice(1)
							.map((story) => (
								<FeaturedStoryCard
									key={story.id}
									story={story}
								/>
							))}
					</div>
				</div>
			</section>

			<ExploreTrendingPosts
				posts={filteredTrendingPosts}
				activeFilter={activeFilter}
			/>

			<section className="space-y-6">
				<header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<h2 className="text-2xl font-semibold">
							Creator spotlight
						</h2>
						<p className="text-sm text-muted-foreground">
							Follow the people shaping
							conversations across Aeko right
							now.
						</p>
					</div>
					<Link
						href="/explore/topic/creators"
						className="text-sm font-semibold text-secondary transition hover:text-secondary/80"
					>
						View creators
					</Link>
				</header>

				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{trendingCreators.map((creator) => (
						<CreatorSpotlightCard
							key={creator.id}
							creator={creator}
						/>
					))}
				</div>
			</section>

			<ExploreCommunities communities={communities} />
		</main>
	);
}

function FeaturedStoryCard({
	story,
	className
}: {
	story: FeaturedStory;
	className?: string;
}) {
	return (
		<Link
			href={story.href}
			className={cn(
				"group relative flex min-h-[220px] flex-col overflow-hidden rounded-[32px] bg-muted",
				className
			)}
		>
			<Image
				fill
				src={story.cover}
				alt={story.title}
				sizes="(min-width: 1024px) 50vw, 100vw"
				className="object-cover transition duration-500 group-hover:scale-[1.03]"
			/>
			<div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/55 to-black/90" />
			<div className="relative z-10 flex h-full flex-col justify-between p-6 text-white">
				<div className="flex items-center gap-2 text-xs font-semibold uppercase">
					{story.badge && (
						<span className="rounded-full bg-white/15 px-3 py-1 tracking-wide">
							{story.badge}
						</span>
					)}
					<span className="rounded-full bg-white/10 px-3 py-1 text-white/80">
						{story.stats}
					</span>
				</div>
				<div className="space-y-2">
					<h3 className="text-2xl font-semibold leading-tight">
						{story.title}
					</h3>
					<p className="text-sm text-white/80">
						{story.subtitle}
					</p>
				</div>
				<div className="flex items-center gap-2 text-sm font-semibold">
					<span>Watch</span>
					<Play className="h-4 w-4" />
				</div>
			</div>
		</Link>
	);
}

function CreatorSpotlightCard({
	creator
}: {
	creator: CreatorSpotlight;
}) {
	return (
		<article className="relative overflow-hidden rounded-[28px] border border-border/60 bg-background shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
			<div className="relative aspect-[4/3]">
				<Image
					fill
					src={creator.cover}
					alt={creator.name}
					sizes="(min-width: 1280px) 30vw, (min-width: 768px) 40vw, 100vw"
					className="object-cover"
				/>
				<div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/30 to-black/70" />
				<div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-4 text-white">
					<span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
						{creator.category}
					</span>
					<span className="text-xs font-medium text-white/85">
						{creator.followers} followers
					</span>
				</div>
			</div>
			<div className="space-y-4 p-5">
				<div className="flex items-center gap-3">
					<Avatar className="h-12 w-12 border-2 border-border/60">
						<AvatarImage
							src={creator.avatar}
							alt={creator.name}
						/>
						<AvatarFallback>
							{creator.name.charAt(0)}
						</AvatarFallback>
					</Avatar>
					<div>
						<p className="text-base font-semibold">
							{creator.name}
						</p>
						<p className="text-sm text-muted-foreground">
							{creator.handle}
						</p>
					</div>
				</div>
				<Button
					className="w-full"
					variant="secondary"
				>
					Follow
				</Button>
			</div>
		</article>
	);
}







