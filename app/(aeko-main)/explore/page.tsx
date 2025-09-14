"use client";

import { ExploreContent } from "@/components/explore/explore-content";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const categories = [
  "For You",
  "Trending",
  "DeFi",
  "NFTs",
  "Trading",
  "Technology",
];

export default function ExplorePage() {
	const [searchQuery, setSearchQuery] =
		useState<string>("");
	const [showSearchResults, setShowSearchResults] =
		useState<boolean>(false);

	// Recent search users data
	const recentSearchUsers = [
		{
			id: 1,
			name: "Dr Mille",
			username: "@drmille",
			avatar: "/users/mike-chen.jpg"
		},
		{
			id: 2,
			name: "Ayo Mash",
			username: "@aymash",
			avatar: "/users/sarah-johnson.jpeg"
		},
		{
			id: 3,
			name: "Debby",
			username: "@fingerlittle",
			avatar: "/users/lisa-wong.jpeg"
		},
		{
			id: 4,
			name: "Joshua Martins",
			username: "@joshmart",
			avatar: "/users/alex-rivera.jpg"
		},
		{
			id: 5,
			name: "Dr Mille",
			username: "@drmille",
			avatar: "/users/emily-carter.jpg"
		}
	];

	// Recent search queries
	const recentSearches = [
		"Pricillia Baby's announcement",
		"Kussman's Wedding",
		"Kussman's Wife",
		"Kussman's Wife's black eye"
	];

	// Trending topics
	const trendingTopics = [
		"#Pric's baby",
		"#you.me.us",
		"#challenge"
	];

	const handleSearchFocus = () => {
		setShowSearchResults(true);
	};

	const handleSearchBlur = (e: React.FocusEvent) => {
		// Only hide if clicking outside the search area
		if (
			!e.currentTarget.contains(
				e.relatedTarget as Node
			)
		) {
			setShowSearchResults(false);
		}
	};

	const handleClearSearch = () => {
		setSearchQuery("");
	};

	return (
		<div className="space-y-5 px-6 mx-auto">
			<div className="sticky top-16 md:top-0 z-10 mb-6 -mx-4 pt-12 px-4  text-black bg-background">
				<div>
					<h1 className="hidden md:block text-3xl font-semibold">
						Explore
					</h1>
				</div>
				<div className=" pb-2 pt-2 ">
					{/* Search Area - Visible on both mobile and desktop */}
					<div
						className="mb-4 relative"
						onBlur={handleSearchBlur}
						tabIndex={-1}
					>
						<div className="relative">
							<div className="absolute left-3 top-1/2 -translate-y-1/2 text-black  size-10 rounded-full flex items-center justify-center">
								<Search className="w-4 h-4" />
							</div>
							<Input
								placeholder="Search for anything"
								className="w-[calc(100%-32rem)] bg-gray-50 rounded-full pl-15 pr-10 shadow-2xl focus:outline-none focus:ring-2 focus:ring-secondary h-15 placeholder:text-xl"
								value={searchQuery}
								onChange={(e) =>
									setSearchQuery(
										e.target.value
									)
								}
								onFocus={handleSearchFocus}
							/>
							{searchQuery && (
								<button
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
									onClick={
										handleClearSearch
									}
								>
									<X className="w-4 h-4" />
								</button>
							)}
						</div>

						{/* Search Results Panel - Show when focused */}
						{showSearchResults && (
							<div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-20 p-4">
								{/* Recent Search Section */}
								<div className="mb-4">
									<div className="flex justify-between items-center mb-2">
										<h3 className="text-sm font-medium">
											Recent Search
										</h3>
										<button className="text-muted-foreground">
											<X className="w-4 h-4" />
										</button>
									</div>

									{/* User Avatars */}
									<div className="flex space-x-4 mb-4 overflow-x-auto pb-2">
										{recentSearchUsers.map(
											(user) => (
												<div
													key={
														user.id
													}
													className="flex flex-col items-center space-y-1 min-w-[60px]"
												>
													<Avatar className="w-12 h-12">
														<AvatarImage
															src={
																user.avatar
															}
															alt={
																user.name
															}
														/>
														<AvatarFallback>
															{user.name.charAt(
																0
															)}
														</AvatarFallback>
													</Avatar>
													<span className="text-xs font-medium truncate w-full text-center">
														{
															user.name
														}
													</span>
													<span className="text-xs text-muted-foreground truncate w-full text-center">
														{
															user.username
														}
													</span>
												</div>
											)
										)}
									</div>

									{/* Recent Search Queries */}
									<div className="space-y-2">
										{recentSearches.map(
											(
												search,
												index
											) => (
												<div
													key={
														index
													}
													className="flex justify-between items-center py-1"
												>
													<span className="text-sm">
														{
															search
														}
													</span>
													<button className="text-muted-foreground">
														<X className="w-3 h-3" />
													</button>
												</div>
											)
										)}
									</div>
								</div>

								{/* Trending Topics Section */}
								<div>
									<div className="flex justify-between items-center mb-2">
										<h3 className="text-sm font-medium">
											Trending Topics
										</h3>
										<button className="text-muted-foreground">
											<X className="w-4 h-4" />
										</button>
									</div>

									<div className="flex flex-wrap gap-2">
										{trendingTopics.map(
											(
												topic,
												index
											) => (
												<Badge
													key={
														index
													}
													variant="outline"
													className="rounded-full px-3 py-1"
												>
													{topic}
													<button className="ml-1 text-muted-foreground">
														<X className="w-3 h-3" />
													</button>
												</Badge>
											)
										)}
									</div>
								</div>

								{/* Watch Viral Posts Section */}
								<div className="mt-4">
									<h3 className="text-sm font-medium mb-2">
										Watch viral posts
									</h3>
									<div className="grid grid-cols-2 gap-2">
										<div className="aspect-video bg-muted rounded-lg"></div>
										<div className="aspect-video bg-muted rounded-lg"></div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			{/* <ExploreContent /> */}
		</div>
	);
}
