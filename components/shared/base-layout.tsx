"use client";

import { LeftSidebar } from "./left-sidebar";
import { RightSidebar } from "./right-sidebar";
import { MobileNavbar } from "./mobile-navbar";
import { MobileHeader } from "./mobile-header";
import { DesktopHeader } from "./desktop-header";

interface BaseLayoutProps {
	children: React.ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
	return (
		<div className="max-w-full bg-gray-50 root">
			<DesktopHeader />
			<MobileHeader />
			<div className="container xl:mx-auto px-2 lg:px-6 xl:px-8">
				<div className="flex">
					<LeftSidebar />
					<main className="relative flex-4 max-w-4xl md:ml-16 md:mt-16 xl:m-0">
						{children}
					</main>
					<RightSidebar />
				</div>
			</div>
			<MobileNavbar />
		</div>
	);
}
