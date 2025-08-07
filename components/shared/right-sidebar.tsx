"use client";

import { usePathname } from "next/navigation";
import { Explore } from "./explore";
import { WhoToFollow } from "./who-to-follow";
import { Button } from "../ui/button";
import { Bell, MessageSquare, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PostType } from "../home/post-feed/post";
import { CreatePost } from "../home/create-post";

const RightSidebar = () => {
	const path = usePathname();

	return (
		<aside
			className={`hidden xl:block w-90 flex-shrink-0 ${
				path === "/wallet" ||
				path === "/live-streams" ||
				path === "/explore" ||
				path === "/settings"
			}`}
		>
			<div className="sticky top-0 space-y-6 py-8 px-4">
				<div className="flex justify-center items-center space-x-4">
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full bg-secondary hover:bg-primary hover:text-secondary h-13 w-13 border"
					>
						<Bell className="h-5 w-5" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full bg-secondary hover:bg-primary hover:text-secondary h-13 w-13 border"
					>
						<MessageSquare className="h-5 w-5" />
					</Button>
					<Avatar className="h-13 w-13 aspect-square outline-2 outline-offset-2 outline-normal-active">
						<AvatarImage src="/profile.jpeg" />
						<AvatarFallback>You</AvatarFallback>
					</Avatar>
				</div>
				<WhoToFollow />
				<Explore />
			</div>
		</aside>
	);
};

export { RightSidebar };
