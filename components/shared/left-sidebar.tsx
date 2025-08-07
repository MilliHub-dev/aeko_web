"use client";

import { sidebarRoutes } from "@/lib/routes";
import Link from "next/link";
import { Button } from "../ui/button";
import { Logo } from "../logo";
import React from "react";
import { SearchPanel, useSearchDialog } from "./search-panel";
import { AnimatePresence, motion } from "motion/react";
import { PlusIcon, SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMobile } from "@/hooks/use-mobile";
import { PostType } from "../home/post-feed/post";
import { CreatePost } from "../home/create-post";

const LeftSidebar = () => {
	const {
		dialogState,
		handleRouteClick,
		handleBackdropClick,
		toggleSearch,
		closeDialog
	} = useSearchDialog();

	const path = usePathname();
	const isMobile = useMobile();

	const handleCreatePost = async (postData: {
		type: PostType;
		content: string;
		media?: File;
		hashtags: string[];
	}) => {
		// Handle post creation here
		// You can send the data to your API
		console.log("New post:", postData);
	};

	return (
		<React.Fragment>
			<aside className="hidden md:block flex-shrink-0 lg:w-70 xl:w-65">
				<div className="sticky top-0 flex flex-col h-[calc(100vw-12rem)] lg:h-auto gap-8 border-none py-8 px-4 text-xl justify-center">
					<div className="hidden lg:inline-block md:w-16 lg:w-24">
						<Logo />
					</div>
					<div className="space-y-5xl">
						<nav className="flex flex-col md:items-center lg:items-start gap-y-4">
							{/* Navigation Links */}
							<button
								className="flex items-center gap-x-3 p-2 rounded-full hover:bg-secondary hover:text-primary transition-colors md:justify-center lg:justify-start lg:w-full lg:flex-1"
								onClick={() => handleRouteClick("Search")}
								// variant={"ghost"}
							>
								<div className="flex justify-center items-center">
									<SearchIcon
										className="w-full"
										strokeWidth={1.5}
										size={isMobile ? 35 : 30}
									/>
								</div>
								<span className="hidden lg:block font-medium">
									Search
								</span>
							</button>
							{sidebarRoutes.map((route) => {
								const Icon = route.icon;
								return (
									<Link
										href={route.path}
										key={route.name}
										className={`
                      w-full flex-1 flex items-center gap-x-3 p-2 rounded-full 
                      hover:bg-secondary hover:text-primary
                      md:justify-center lg:justify-start 
                      transition-all duration-200 ease-in-out
                      ${
							path === route.path
								? "bg-secondary text-primary border"
								: "bg-transparent"
						}
                    `}
									>
										<div className="flex justify-center items-center">
											<Icon
												className="w-full transition-transform duration-200 text-3xl"
												strokeWidth={1.5}
												size={isMobile ? 35 : 30}
											/>
										</div>
										<span className="hidden lg:block font-medium">
											{route.name}
										</span>
									</Link>
								);
							})}
							<CreatePost onPost={handleCreatePost} />
						</nav>
					</div>
				</div>
			</aside>

			{/* Blur Background Overlay */}
			<AnimatePresence>
				{dialogState.isSearchOpen && (
					<motion.div
						className="fixed inset-0 bg-black/50 right-0 top-0 bottom-0 z-10"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						onClick={handleBackdropClick}
					/>
				)}
			</AnimatePresence>

			{/* Search Panel */}
			<AnimatePresence>
				{dialogState.isSearchOpen && (
					<SearchPanel
						isOpen={dialogState.isSearchOpen}
						onClose={closeDialog}
					/>
				)}
			</AnimatePresence>
		</React.Fragment>
	);
};

export { LeftSidebar };
