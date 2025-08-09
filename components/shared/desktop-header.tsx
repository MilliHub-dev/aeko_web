"use client";

import { Bell, MessageCircle, MessageSquare, User } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Logo } from "../logo";
import { useState } from "react";
import { ThemeSwitcher } from "../theme/theme-switcher";
import { CreatePost } from "../home/create-post";
import { PostType } from "../home/post-feed/post";

interface User {
	name: string;
	email: string;
	avatar?: string;
	initials: string;
}

interface DesktopHeaderProps {
	className?: string;
	notificationCount?: number;
	messageCount?: number;
	user?: User;
	onNotificationClick?: () => void;
	onMessageClick?: () => void;
	onProfileClick?: () => void;
}

const DesktopHeader = ({
	className = "",
	notificationCount = 0,
	messageCount = 0,
	user = { name: "User", email: "user@example.com", initials: "U" },
	onNotificationClick,
	onMessageClick,
	onProfileClick
}: DesktopHeaderProps) => {
	const [isProfileOpen, setIsProfileOpen] = useState(false);

	return (
		<>
			<div className="hidden bg-gray-50 md:block xl:hidden blur-sm fixed top-0 left-0 right-0 z-5 h-16 isolate" />
			<header
				className={`hidden md:block xl:hidden fixed top-0 left-0 right-0 z-5 isolate backdrop-blur-lg   ${className}`}
				role="banner"
			>
				{/* Header Content */}
				<div className="flex justify-between bg-transparent h-full py-4 px-4 relative">
					{/* Logo */}
					<div className="flex-shrink-0 w-14 md:w-16 lg:w-24">
						<Logo />
					</div>

					{/* Action Buttons */}
					<div className="flex justify-center items-center space-x-4">
						<Button
							variant="ghost"
							size="icon"
							className="rounded-full bg-secondary hover:bg-primary hover:text-secondary h-10 w-10 md:h-13 md:w-13 border"
						>
							<Bell className="h-5 w-5" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="rounded-full bg-secondary hover:bg-primary hover:text-secondary h-10 w-10 md:h-13 md:w-13 border"
						>
							<MessageSquare className="h-5 w-5" />
						</Button>
						<Avatar className="h-10 w-10 md:h-13 md:w-13 aspect-square outline-2 outline-offset-2 outline-normal-active">
							<AvatarImage src="/profile.jpeg" />
							<AvatarFallback>You</AvatarFallback>
						</Avatar>
					</div>

					{/* Blurred bottom border illusion */}
					<div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/40 backdrop-blur-md pointer-events-none z-10" />
				</div>
			</header>
		</>
	);
};

export { DesktopHeader };
export type { DesktopHeaderProps, User };
