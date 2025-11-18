"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { cva } from "class-variance-authority";

import { sidebarRoutes } from "@/lib/routes";
import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from "../ui/avatar";

const navItem = cva(
	"group relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
	{
		variants: {
			active: {
				true: "bg-primary/15 text-foreground shadow-md shadow-primary/20",
				false: "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
			}
		},
		defaultVariants: {
			active: false
		}
	}
);

const MAIN_LINK_COUNT = 5;


export function LeftSidebar() {
	const pathname = usePathname();

	const { mainLinks, secondaryLinks } = useMemo(() => {
		return {
			mainLinks: sidebarRoutes.slice(0, MAIN_LINK_COUNT),
			secondaryLinks: sidebarRoutes.slice(MAIN_LINK_COUNT)
		};
	}, []);

	return (
		<aside className="sticky top-0 hidden h-screen w-[300px] shrink-0 xl:flex">
			<div className="relative flex h-full w-full flex-col overflow-hidden bg-card space-y-4 p-6">
				<div className="space-y-4">
					<div className="flex items-center gap-3">
						<Avatar className="h-14 w-14 border border-border/60">
							<AvatarImage
								src="/profile.jpeg"
								alt="Andrew Smith"
							/>
							<AvatarFallback>AS</AvatarFallback>
						</Avatar>
						<div className="space-y-1">
							<p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
								Product Designer
							</p>
							<p className="text-lg font-semibold">Andrew Smith</p>
						</div>
					</div>
				</div>

				<div className="flex-1">
					<div className="flex h-full flex-col justify-between gap-4 overflow-hidden pb-6">
						<div className="space-y-8">
							<section className="space-y-3">
								<p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
									Main
								</p>
								<div className="space-y-2">
									{mainLinks.map((route) => {
										const Icon = route.icon;
										const active = pathname.startsWith(route.path);
										return (
											<Link
												key={route.path}
												href={route.path}
												className={navItem({
													active
												})}
											>
												<span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-primary transition group-hover:bg-muted/80 group-hover:text-foreground">
													<Icon className="h-4 w-4" />
												</span>
												<div className="flex min-w-0 flex-col">
													<span className="truncate text-lg">{route.name}</span>
												</div>
											</Link>
										);
									})}
								</div>
							</section>

							<section className="space-y-3">
								<p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
									More
								</p>
								<div className="space-y-2">
									{secondaryLinks.map((route) => {
										const Icon = route.icon;
										const active = pathname.startsWith(route.path);
										return (
											<Link
												key={route.path}
												href={route.path}
												className={navItem({
													active
												})}
											>
												<span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-primary transition group-hover:bg-muted/80 group-hover:text-foreground">
													<Icon className="h-4 w-4" />
												</span>
												<span className="truncate text-lg">{route.name}</span>
											</Link>
										);
									})}
								</div>
							</section>
						</div>

						<div className="rounded-[28px] bg-muted p-5">
							<h3 className="text-base font-semibold text-foreground">
								Let&apos;s create something
							</h3>
							<p className="mt-1 text-sm text-muted-foreground">
								Create a new post and share what&apos;s trending.
							</p>
							<Link
								href="/home"
								className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition hover:bg-primary/90"
							>
								Add New Post
							</Link>
						</div>
					</div>
				</div>
			</div>
		</aside>
	);
}
