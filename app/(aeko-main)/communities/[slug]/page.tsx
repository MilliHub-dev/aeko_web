"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from "@/components/ui/avatar";
import type { PostProps } from "@/types/post";
import { PostCard } from "@/components/home/post/post-card";
import {
	Search,
	MoreVertical,
	ChevronLeft,
	Share2
} from "lucide-react";

interface CommunityProfile {
	slug: string;
	name: string;
	category: string;
	tagline: string;
	description: string;
	heroImage: string;
	members: string;
	followers: string;
	timezone: string;
	tags: string[];
	guidelines: string[];
	contact: string;
}

const communityDirectory: Record<string, CommunityProfile> =
	{
		"christian-prayer": {
			slug: "christian-prayer",
			name: "Christian Prayer & Fasting",
			category: "Faith",
			tagline:
				"Daily accountability for prayer and fasting.",
			description:
				"We gather for sunrise intercession, share devotion prompts, and pair up for fasting accountability. Sunday reflection circles close out each week with testimonies and renewed focus.",
			heroImage: "/communities/faith.jpg",
			members: "11.2k members",
			followers: "+11k others",
			timezone: "Global",
			tags: ["devotion", "fasting", "community"],
			guidelines: [
				"Lead with compassion and confidentiality.",
				"Tag resources with the weekday series they belong to.",
				"Keep fundraising and promo requests inside the #support channel only."
			],
			contact:
				"Reach moderators via prayercircle@aeko.app"
		},
		"sports-hub": {
			slug: "sports-hub",
			name: "Sports Hub",
			category: "Sports",
			tagline:
				"Where athletes sync training, recovery, and live commentary.",
			description:
				"Stream training sessions, swap recovery protocols, and coordinate pickup meetups. Weekly coaching office hours rotate across featured disciplines.",
			heroImage: "/communities/sports.jpg",
			members: "9.6k members",
			followers: "+9k others",
			timezone: "Americas / Europe",
			tags: ["training", "nutrition", "meetups"],
			guidelines: [
				"Respect every athlete’s pace and personal records.",
				"Label spoilers when live-commentating televised games.",
				"Coordinate IRL meetups in #events for transparency and safety."
			],
			contact: "sports-hub-mods@aeko.app"
		}
	};

const fallbackCommunity: CommunityProfile = {
	slug: "community",
	name: "Community Hub",
	category: "Lifestyle",
	tagline: "Where builders gather",
	description:
		"Catch office hours, live Q&A rooms, and curated drop roundups from the Aeko ecosystem.",
	heroImage: "/communities/default.jpg",
	members: "1.2k members",
	followers: "Followers joining weekly",
	timezone: "Global",
	tags: ["builders", "education", "community"],
	guidelines: [
		"Keep discussions constructive.",
		"Protect member privacy.",
		"Amplify wins from across the network."
	],
	contact: "community@aeko.app"
};

const communityPosts: Record<string, PostProps[]> = {
	"christian-prayer": [
		{
			id: "cp-1",
			type: "image",
			username: "Martha Joe",
			handle: "@Jesusbaby",
			profileImage: "/users/martha-joe.jpg",
			backgroundImage: "/posts/prayer-time.jpg",
			content: "Sunrise devotion from Psalms 91.",
			likes: "120K",
			shares: "25",
			bookmarks: "200",
			commentMetric: "15",
			timePosted: "1h ago"
		},
		{
			id: "cp-2",
			type: "image",
			username: "Isaiah Rivers",
			handle: "@riverflows",
			profileImage: "/users/isaiah-rivers.jpg",
			backgroundImage: "/posts/prayer-circle.jpg",
			content:
				"Midweek testimonies - share how the fast is sharpening your focus.",
			likes: "34K",
			shares: "8",
			bookmarks: "90",
			commentMetric: "120",
			timePosted: "3h ago"
		}
	],
	"sports-hub": [
		{
			id: "sh-1",
			type: "image",
			username: "Debby",
			handle: "@finegirllikedebs",
			profileImage: "/users/emily-carter.jpg",
			backgroundImage: "/posts/tennis-action.jpg",
			content:
				"Serve routine that helped me shave 0.4s off match openers.",
			likes: "18.4K",
			shares: "56",
			bookmarks: "410",
			commentMetric: "340",
			timePosted: "2h ago"
		}
	]
};

const aboutHighlights: Record<
	string,
	{ title: string; copy: string }[]
> = {
	"christian-prayer": [
		{
			title: "Weekly rhythm",
			copy: "Monday scripture drops, Wed & Fri group fasts, weekend testimony rooms."
		},
		{
			title: "Resource vault",
			copy: "Download prayer journals, fasting meal plans, and scripture playlists from the pinned section."
		}
	],
	"sports-hub": [
		{
			title: "Programming",
			copy: "Daily workout threads, real-time match analysis, and Thursday coach office hours."
		},
		{
			title: "Meetups",
			copy: "IRL sessions in LA, London, Lagos—RSVP inside #events."
		}
	]
};

const pills = [
	"devotion",
	"fasting",
	"community",
	"live-stream"
];

export default async function CommunityProfilePage({
	params
}: CommunityProfileProps) {
	const { slug } = await params;
	const profile =
		communityDirectory[slug] ?? fallbackCommunity;
	const posts =
		communityPosts[slug] ??
		communityPosts["christian-prayer"];
	const highlights =
		aboutHighlights[slug] ??
		aboutHighlights["christian-prayer"];

	const [activeTab, setActiveTab] = useState<
		"posts" | "about"
	>("posts");
	const [showActions, setShowActions] = useState(false);

	return (
		<div className="relative min-h-screen overflow-hidden bg-background">
			<div
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_5%_10%,hsla(var(--primary),0.2),transparent_60%),radial-gradient(circle_at_95%_0%,hsla(var(--muted-foreground),0.12),transparent_60%),linear-gradient(180deg,rgba(6,12,24,0.85),rgba(6,12,24,0.95))]"
				aria-hidden="true"
			/>
			<div className="relative z-10 mx-auto flex w-full flex-col gap-8 px-4 pb-24 pt-8 sm:px-6 lg:px-8">
				<section className="relative overflow-hidden rounded-[32px] bg-card/85 shadow-2xl shadow-primary/10">
					<div className="relative h-[300px] sm:h-[360px] lg:h-[420px]">
						<Image
							src={profile.heroImage}
							alt={profile.name}
							fill
							priority
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.55)_55%,rgba(0,0,0,0.80)_100%)]" />

						<div className="absolute left-4 top-4 flex items-center gap-2 sm:left-6 sm:top-6">
							<Link
								href="/communities"
								className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/45 backdrop-blur text-white"
								aria-label="Back to communities"
							>
								<ChevronLeft className="h-5 w-5" />
							</Link>
						</div>

						<div className="absolute right-4 top-4 flex items-center gap-2 sm:right-6 sm:top-6">
							<button
								className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/45 backdrop-blur text-white"
								aria-label="Search in community"
							>
								<Search className="h-5 w-5" />
							</button>
							<button
								className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/45 backdrop-blur text-white"
								onClick={() =>
									setShowActions(
										(prev) => !prev
									)
								}
								aria-label="Community actions"
							>
								<MoreVertical className="h-5 w-5" />
							</button>
						</div>

						<div className="absolute inset-x-4 bottom-4 flex flex-col gap-3 text-white sm:inset-x-6">
							<Badge className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
								{profile.category}
							</Badge>
							<div className="space-y-1">
								<h1 className="text-2xl font-semibold sm:text-3xl">
									{profile.name}
								</h1>
								<p className="text-sm text-white/80">
									{profile.tagline}
								</p>
							</div>
							<div className="flex flex-wrap items-center gap-3 text-xs text-white/80">
								<AvatarStack
									label={
										profile.followers
									}
								/>
								<span>
									{profile.members}
								</span>
								<span>
									{profile.timezone}
								</span>
							</div>
							<div className="flex flex-wrap gap-2">
								{profile.tags.map((tag) => (
									<Badge
										key={tag}
										className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white"
									>
										#{tag}
									</Badge>
								))}
							</div>
							<div className="flex flex-wrap gap-2">
								<Button
									size="sm"
									className="rounded-full bg-white px-5 text-xs font-semibold text-foreground"
								>
									Join community
								</Button>
								<Button
									size="sm"
									variant="outline"
									className="rounded-full border-white/40 px-5 text-xs font-semibold text-white hover:bg-white/10"
								>
									<Share2 className="mr-2 h-4 w-4" />
									Share invite
								</Button>
							</div>
						</div>
					</div>
				</section>

				<div className="mx-auto w-full max-w-3xl">
					<div className="flex items-center rounded-full border border-border/60 bg-card/80 p-1 text-sm font-semibold">
						{(["posts", "about"] as const).map(
							(tab) => (
								<button
									key={tab}
									onClick={() =>
										setActiveTab(tab)
									}
									className={`flex-1 rounded-full px-4 py-2 transition ${
										activeTab === tab
											? "bg-primary text-primary-foreground shadow-sm"
											: "text-muted-foreground hover:text-primary"
									}`}
								>
									{tab === "posts"
										? "Posts"
										: "About"}
								</button>
							)
						)}
					</div>

					{activeTab === "posts" ? (
						<div className="mt-6 space-y-5">
							{posts.map((post) => (
								<CommunityPostCard
									key={post.id}
									post={post}
									// community={profile.name}
								/>
							))}
						</div>
					) : (
						<AboutSection
							highlights={highlights}
							profile={profile}
							pills={pills}
						/>
					)}
				</div>
			</div>

			{showActions && (
				<div
					className="fixed inset-0 z-20 flex items-start justify-center bg-black/40 px-4 pt-24 sm:px-6"
					onClick={() => setShowActions(false)}
				>
					<div
						className="w-full max-w-sm rounded-3xl border border-primary/40 bg-card/95 p-4 text-sm text-foreground shadow-xl"
						onClick={(event) =>
							event.stopPropagation()
						}
					>
						<header className="mb-3 flex items-center justify-between">
							<span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Community actions
							</span>
							<button
								className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/50 text-muted-foreground"
								aria-label="Close actions"
								onClick={() =>
									setShowActions(false)
								}
							>
								×
							</button>
						</header>
						<div className="space-y-3">
							{[
								{
									label: "About community",
									description:
										"See purpose & guidelines"
								},
								{
									label: "Report community",
									description:
										"Flag safety or policy issues"
								},
								{
									label: "Leave community",
									description:
										"Exit and stop receiving updates"
								}
							].map((item) => (
								<button
									key={item.label}
									className="w-full rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-left transition hover:border-primary/30 hover:text-primary"
								>
									<p className="text-sm font-semibold">
										{item.label}
									</p>
									<p className="text-xs text-muted-foreground">
										{item.description}
									</p>
								</button>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

function CommunityPostCard({ post }: { post: PostProps }) {
	return (
		<div className="overflow-hidden rounded-[32px] border border-border/60 bg-card/70 shadow-md">
			<PostCard {...post} />
		</div>
	);
}

function AboutSection({
	highlights,
	profile,
	pills
}: {
	highlights: { title: string; copy: string }[];
	profile: CommunityProfile;
	pills: string[];
}) {
	return (
		<div className="mt-6 space-y-6">
			<section className="space-y-3 rounded-3xl border border-border/60 bg-card/80 p-5 text-sm text-foreground shadow-sm">
				<h2 className="text-base font-semibold text-foreground">
					About this community
				</h2>
				<p className="text-muted-foreground">
					{profile.description}
				</p>
			</section>
			<section className="space-y-3 rounded-3xl border border-border/60 bg-card/80 p-5 text-sm text-foreground shadow-sm">
				<h3 className="text-base font-semibold">
					Highlights
				</h3>
				<div className="space-y-3 text-muted-foreground">
					{highlights.map((item) => (
						<div key={item.title}>
							<p className="text-sm font-semibold text-foreground">
								{item.title}
							</p>
							<p className="text-sm">
								{item.copy}
							</p>
						</div>
					))}
				</div>
			</section>
			<section className="space-y-3 rounded-3xl border border-border/60 bg-card/80 p-5 text-sm text-foreground shadow-sm">
				<h3 className="text-base font-semibold">
					Guidelines
				</h3>
				<ul className="space-y-2 text-sm text-muted-foreground">
					{profile.guidelines.map((rule) => (
						<li key={rule}>• {rule}</li>
					))}
				</ul>
			</section>
			<section className="rounded-3xl border border-border/60 bg-card/80 p-5 text-sm text-muted-foreground shadow-sm">
				{profile.contact}
			</section>
			<footer className="flex flex-wrap gap-2 text-xs text-muted-foreground">
				{pills.map((pill) => (
					<span
						key={pill}
						className="rounded-full border border-border/60 px-3 py-1"
					>
						#{pill}
					</span>
				))}
			</footer>
		</div>
	);
}

function AvatarStack({ label }: { label: string }) {
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
						className="h-9 w-9 border-2 border-white"
					>
						<AvatarImage
							src={avatar}
							alt="Member avatar"
						/>
						<AvatarFallback>CM</AvatarFallback>
					</Avatar>
				))}
			</div>
			<span>{label}</span>
		</div>
	);
}

interface CommunityProfileProps {
	params: Promise<{ slug: string }>;
}
