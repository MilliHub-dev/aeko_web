"use client";

import { LeftSidebar } from "./left-sidebar";
import { RightSidebar } from "./right-sidebar";
import { MobileNavbar } from "./mobile-navbar";
import { MobileHeader } from "./mobile-header";
import { MobileLeftSidebar } from "./mobile-left-sidebar";
import { usePathname } from "next/navigation";
import { Stories } from "../home/story/stories";
import { getLayoutConfig } from "@/lib/layout-config";
import { CommentsPanelProvider } from "@/components/home/post/comments-panel-context";
import { CommentsPanel } from "@/components/home/post/comments-panel";
import { CommentsMobileModal } from "@/components/home/post/comments-mobile-modal";
import { MobileMenuProvider } from "./mobile-menu-context";
import { MobileMenuDrawer } from "./mobile-menu-drawer";

interface BaseLayoutProps {
	children: React.ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
	const path = usePathname();
	const { variant, showMobileHeader } =
		getLayoutConfig(path);
	const isSimpleLayout = variant === "simple";

	return (
		<CommentsPanelProvider>
			<MobileMenuProvider>
				<div className="relative max-w-full bg-background ">
					{showMobileHeader && <MobileHeader />}
					<div
						className={`pl-2 xl:px-8 grid min-h-screen items-start ${
							isSimpleLayout
								? "md:grid-cols-[5.625rem_1fr] xl:grid-cols-[24rem_1fr] max-w-full"
								: "md:grid-cols-[5.625rem_5rem_1fr] xl:grid-cols-[24rem_6.5rem_minmax(0,1fr)_28rem]"
						}`}
					>
						<MobileLeftSidebar />
						<LeftSidebar />
						{!isSimpleLayout && <Stories />}
						<main className="relative">
							{children}
						</main>
						{!isSimpleLayout && (
							<RightSidebar />
						)}
					</div>
					{/* Comments drawer overlays the right sidebar on xl screens */}
					{!isSimpleLayout && <CommentsPanel />}
					{/* Mobile full-screen comments modal */}
					<CommentsMobileModal />
					{/* Mobile hamburger right sidebar */}
					<div className="md:hidden">
						<MobileMenuDrawer />
					</div>
					<MobileNavbar />
				</div>
			</MobileMenuProvider>
		</CommentsPanelProvider>
	);
}

