"use client";

import { useMobile } from "@/hooks/use-mobile";
import { useRouteName } from "@/hooks/use-route-name";
import { Bell, CircleDollarSign, CompassIcon, Home, Search, User } from "lucide-react";
import Link from "next/link";

const MobileNavbar = () => {
	const navItems = [
		{ id: "home", icon: Home, label: "Home", path: "/" },
		{ id: "explore", icon: CompassIcon, label: "Explore", path: "/explore" },
		{ id: "wallet", icon: CircleDollarSign, label: "Wallet", path: "/wallet" },
		{ id: "activity", icon: Bell, label: "Activity", path: "/activity" },
		{ id: "profile", icon: User, label: "Profile", path: "/profile" }
	];

	const isMobile = useMobile();
	const routeName = useRouteName();

	return (
		<nav className="flex justify-center md:hidden fixed bottom-6 left-0 right-0 bg-transparent z-50 ">
			<div className="flex items-center justify-around px-4 py-3 w-[350px] h-[76px] backdrop-blur-2xl bg-black/50 rounded-full ">
				{navItems.map((item) => {
					const IconComponent = item.icon;
					return (
						<Link
							key={item.id}
							href={item.path}
							className={`flex flex-col items-center justify-center p-4 rounded-full hover:bg-accent hover:text-primary transition-colors text-blue-gem-50 dark:text-green-yellow-100 ${
								item.label === routeName ? "bg-white" : "bg-none"
							}`}
						>
							<IconComponent
								strokeWidth={1.5}
								size={isMobile ? 35 : 30}
							/>
						</Link>
					);
				})}
			</div>
		</nav>
	);
};

export { MobileNavbar };
