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

const LeftSidebar = () => {
	const { dialogState, handleRouteClick, handleBackdropClick, toggleSearch } =
		useSearchDialog();

	const path = usePathname();

	return (
		<React.Fragment>
			<aside className="hidden md:block flex-shrink-0 lg:w-70 xl:w-65">
				<div className="sticky top-0 flex flex-col gap-8 border-none py-8 px-4 text-xl">
					<div className="hidden lg:inline-block w-24">
						<Logo />
					</div>
					<div className="space-y-5xl:w-64">
						<nav className="flex flex-col md:items-center lg:items-start gap-y-4">
							{/* Navigation Links */}
							<Button
								className="flex items-center gap-x-3 rounded-full hover:bg-secondary hover:text-primary transition-colors md:justify-center lg:justify-start lg:w-full lg:flex-1"
								onClick={() => handleRouteClick("Search")}
								variant={"ghost"}
							>
								<div className="flex justify-center items-center">
									<SearchIcon
										className="w-full"
										size={40}
									/>
								</div>
								<span className="hidden lg:block font-medium">
									Search
								</span>
							</Button>
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
												size={30}
											/>
										</div>
										<span className="hidden lg:block font-medium">
											{route.name}
										</span>
									</Link>
								);
							})}
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
					<SearchPanel onClose={handleBackdropClick} />
				)}
			</AnimatePresence>
		</React.Fragment>
	);
};

export { LeftSidebar };
