"use client";

import { Bell, MessageSquare, User } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import { Logo } from "../logo";
import { useState } from "react";
import { ChatIcon } from "@/lib/icons";

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
	return (
		<>
			<div className="hidden bg-gray-50 md:block xl:hidden blur-sm fixed top-0 left-0 right-0 z-5 h-16 isolate" />
			<header
				className={`hidden md:block xl:hidden fixed top-0 left-0 right-0 z-5 isolate backdrop-blur-lg   ${className}`}
				role="banner"
			>
				{/* Header Content */}
				<div className="flex justify-between bg-transparent h-full py-4 px-4 relative">
					<div className="flex-1" />
					{/* Logo */}
					<div className="flex flex-2 flex-col justify-center items-center flex-shrink-0 w-14 md:w-16 lg:w-24 justify-self-center">
						<Logo />
					</div>

					{/* Action Buttons */}
					<div className="flex flex-1 justify-center items-center space-x-4">
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
							<ChatIcon
								strokeWidth={0.5}
								className="h-5 w-5"
							/>
						</Button>
						<Avatar className="h-10 w-10 md:h-13 md:w-13 aspect-square outline-2 outline-offset-2 outline-normal-active">
							<AvatarImage src={user?.avatar || undefined} />
							<AvatarFallback>
								<Image
									src="/profile_icon.jpg"
									alt="Profile"
									fill
									className="object-cover"
								/>
							</AvatarFallback>
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
