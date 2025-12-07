"use client";

import { useState } from "react";
import { Sparkles, Radio, Flame } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryTabs } from "@/components/category-tabs";
import { LiveStreamContent } from "@/components/live-streams/live-stream-content";

const heroHighlights = [
	{
		label: "Viewers right now",
		value: "4.2k",
		caption: "+18% in the last hour"
	},
	{
		label: "Creators live",
		value: "312",
		caption: "27 new in the past 10 minutes"
	},
	{
		label: "Average session",
		value: "46 min",
		caption: "Up 9% vs yesterday"
	}
];

const trendingTags = [
	"#foryou",
	"#creatorspotlight",
	"#nightshift",
	"#musicroom",
	"#buildinpublic"
];

export default function LiveStreamsPage() {
	const [activeCategory, setActiveCategory] =
		useState<string>("All");

	const categories = [
		"All",
		"Gaming",
		"Music",
		"Talk Shows",
		"Sports",
		"Education",
		"Creative"
	];

	return (
		<div className="relative min-h-screen overflow-hidden bg-background">
			<div
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,hsla(var(--primary),0.18),transparent_55%),radial-gradient(circle_at_90%_20%,hsla(var(--muted-foreground),0.14),transparent_60%)]"
				aria-hidden="true"
			/>
			<div className="relative z-10 mx-auto w-full  px-6 pb-20 pt-12 sm:pt-16 lg:px-8">
				<section className="overflow-hidden rounded-[36px] border border-border/60 bg-card/80 p-8 shadow-lg shadow-primary/5 backdrop-blur">
					<div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
						<div className="space-y-6">
							<Badge className="w-fit rounded-full bg-primary/15 text-xs font-medium uppercase tracking-wide text-primary">
								Live Discoveries
							</Badge>
							<div className="space-y-4">
								<h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
									Dive into the creators
									shaping the live moment
								</h1>
								<p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
									Browse curated rooms
									that echo our explore
									page energy while
									putting live-first
									content front and
									centre. Surf categories
									in one tap and find the
									next conversation to
									join.
								</p>
							</div>
							<div className="grid gap-4 sm:grid-cols-3">
								{heroHighlights.map(
									(item) => (
										<div
											key={item.label}
											className="rounded-2xl border border-border/40 bg-background/70 px-5 py-4 shadow-sm"
										>
											<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
												{item.label}
											</p>
											<p className="mt-2 text-2xl font-semibold text-foreground">
												{item.value}
											</p>
											<p className="text-sm text-muted-foreground">
												{
													item.caption
												}
											</p>
										</div>
									)
								)}
							</div>
							<div className="flex flex-wrap items-center gap-3">
								<Button
									size="lg"
									className="rounded-full px-6 text-sm font-semibold"
								>
									<Sparkles className="mr-2 h-4 w-4" />
									Discover live rooms
								</Button>
								<Button
									variant="outline"
									size="lg"
									className="rounded-full border-border/70 px-6 text-sm font-semibold text-foreground"
								>
									<Radio className="mr-2 h-4 w-4" />
									Browse categories
								</Button>
								<Button
									variant="secondary"
									size="lg"
									className="rounded-full bg-secondary/80 px-6 text-sm font-semibold text-secondary-foreground"
								>
									<Flame className="mr-2 h-4 w-4" />
									Go live
								</Button>
							</div>
						</div>
						<div className="flex flex-col justify-between gap-6">
							<div className="rounded-[28px] border border-border/50 bg-background/80 p-6 shadow-sm">
								<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
									Trending tags
								</p>
								<div className="mt-4 flex flex-wrap gap-2">
									{trendingTags.map(
										(tag) => (
											<Badge
												key={tag}
												variant="outline"
												className="rounded-full border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground"
											>
												{tag}
											</Badge>
										)
									)}
								</div>
							</div>
							<div className="rounded-[28px] border border-border/50 bg-background/80 p-6 shadow-sm">
								<h3 className="text-sm font-semibold text-foreground">
									Weekly highlights
								</h3>
								<p className="mt-2 text-sm text-muted-foreground">
									Creator spotlights,
									interactive workshops,
									and after-hours music
									sessions refreshed every
									Monday.
								</p>
							</div>
						</div>
					</div>
				</section>

				<div className="mt-12 rounded-[28px] border border-border/60 bg-card/80 p-4 shadow-sm">
					<CategoryTabs
						categories={categories}
						activeCategory={activeCategory}
						setActiveCategory={
							setActiveCategory
						}
					/>
				</div>

				<LiveStreamContent
					activeCategory={activeCategory}
				/>
			</div>
		</div>
	);
}
