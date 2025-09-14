"use client";

import { LeftSidebar } from "./left-sidebar";
import { RightSidebar } from "./right-sidebar";
import { MobileNavbar } from "./mobile-navbar";
import { MobileHeader } from "./mobile-header";
import { MobileLeftSidebar } from "./mobile-left-sidebar";
import { usePathname } from "next/navigation";
import { Stories } from "../home/story/stories";
import { getLayoutConfig } from "@/lib/layout-config";

interface BaseLayoutProps {
	children: React.ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
	const path = usePathname();
	const { variant, showMobileHeader } =
		getLayoutConfig(path);
	const isSimpleLayout = variant === "simple";

	return (
		<div className="relative max-w-full bg-background root">
			{showMobileHeader && <MobileHeader />}
			<div
				className={`xl:container xl:max-w-[1900px] xl:mx-auto xl:px-8 grid ${
					isSimpleLayout
						? "md:grid-cols-[5.625rem_1fr] xl:grid-cols-[22rem_1fr] max-w-full"
						: "md:grid-cols-[5.625rem_5rem_1fr] xl:grid-cols-[22rem_6.5rem_minmax(0,1fr)_28rem]"
				}`}
			>
				<MobileLeftSidebar />
				<LeftSidebar />
				{!isSimpleLayout && <Stories />}
				<main className="relative">{children}</main>
				{!isSimpleLayout && <RightSidebar />}
			</div>
			<MobileNavbar />
		</div>
	);
}
