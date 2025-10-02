"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { sidebarRoutes } from "@/lib/routes";
import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from "../ui/avatar";

const contactList = [
	{ name: "Erik Gunsel", avatar: "/users/mike-chen.jpg" },
	{
		name: "Emily Smith",
		avatar: "/users/sarah-johnson.jpeg"
	},
	{
		name: "Arthur Adelak",
		avatar: "/users/alex-rivera.jpg"
	}
];

export function MobileLeftSidebar() {
	const pathname = usePathname();

	return (
		<aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-20 shrink-0 md:flex xl:hidden">
			<div className="relative flex h-full w-full flex-col items-center overflow-hidden rounded-[32px] bg-card pb-4 text-muted-foreground">
				<nav className="mt-6 flex flex-1 flex-col items-center gap-4">
					{sidebarRoutes.map((route) => {
						const Icon = route.icon;
						const active = pathname.startsWith(
							route.path
						);
						return (
							<Link
								key={route.path}
								href={route.path}
								aria-label={route.name}
								className={`group relative flex h-14 w-14 items-center justify-center rounded-2xl transition ${
									active
										? "bg-primary/20 text-foreground shadow-md shadow-primary/20"
										: "hover:bg-muted/60 hover:text-foreground"
								}`}
							>
								<Icon className="h-6 w-6" />
							</Link>
						);
					})}
				</nav>

				<div className="mt-4 w-full space-y-4 px-4">
					<p className="text-[6.5px] text-center font-semibold uppercase tracking-[0.35em] text-muted-foreground">
						Messages
					</p>
					<div className="flex flex-col items-center gap-3 text-muted-foreground">
						{contactList.map((contact) => (
							<Avatar
								key={contact.name}
								className="h-12 w-12 border border-border/60"
							>
								<AvatarImage
									src={contact.avatar}
									alt={contact.name}
								/>
								<AvatarFallback>
									{contact.name.charAt(0)}
								</AvatarFallback>
							</Avatar>
						))}
					</div>
				</div>
			</div>
		</aside>
	);
}
