"use client";

import { LeftSidebar } from "./left-sidebar";
import { RightSidebar } from "./right-sidebar";
import { MobileNavbar } from "./mobile-navbar";
import { MobileHeader } from "./mobile-header";
import { usePathname } from "next/navigation";

interface BaseLayoutProps {
	children: React.ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
	const path = usePathname();
	return (
		<div className="min-h-screen bg-gray-50">
			<MobileHeader />

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="flex gap-8">
					<LeftSidebar />
					<main
						className={`relative flex-2 max-w-4xl ${
							path === "/wallet" ||
							path === "/live-streams" ||
							path === "/explore" ||
							path === "/settings"
						}`}
					>
						{children}
					</main>
					<RightSidebar />
				</div>
			</div>
			<MobileNavbar />
		</div>
	);
}
