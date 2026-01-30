"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from "@/components/ui/avatar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
	MoreVertical,
	UserPlusIcon,
	Volume2,
	VolumeX,
	Eye
} from "lucide-react";
import { motion } from "motion/react";
import clsx from "clsx";
import { useUser } from "@/components/shared/user-context";
import { useFollowUser } from "@/features/profile/hooks/use-follow-user";
import { formatCount } from "@/lib/utils";

interface PostHeaderProps {
	type?: "image" | "video" | "text";
	username?: string;
	handle?: string;
	profileImage?: string;
	user?: {
		_id?: string;
		name?: string;
		username?: string;
		email?: string;
		profilePicture?: string;
	};
	className?: string;
	isHovered?: boolean;
	isMuted?: boolean;
	toggleMute?: () => void;
	views?: number;
}

const PostHeader = ({
	type,
	username,
	handle,
	profileImage,
	user,
	className,
	isHovered = false,
	isMuted = false,
	toggleMute,
	views = 0
}: PostHeaderProps) => {
	// Extract user info from either flat props or nested user object
	const displayName = user?.name || username || "Unknown User";
	const displayHandle = user?.username || handle || "";
	const displayProfileImage = user?.profilePicture || profileImage || "";

	const { user: currentUser } = useUser();
	const targetUserId = user?._id || "";
	const isOwnPost = currentUser?._id === targetUserId;
	const { isFollowing, toggleFollow } = useFollowUser(targetUserId);
	
	// Show follow button only if:
	// 1. We have a valid target user ID
	// 2. It's not the current user's own post
	// 3. The current user is not already following them
	const showFollowButton = targetUserId && !isOwnPost && !isFollowing;

	// shared style sets
	const isText = type === "text";
	const glassStyles =
		"bg-black/30 backdrop-blur-md border border-white/20 shadow-[inset_0_1px_4px_rgba(255,255,255,0.25),0_4px_10px_rgba(0,0,0,0.35),0_0_12px_rgba(255,255,255,0.15)]";

	const containerPosition = isText
		? "top-4"
		: "top-8 right-4 left-4";
	const headerBg = isText ? "bg-white" : glassStyles;
	const textColor = isText ? "text-black" : "text-white";
	const buttonBg = isText ? "bg-secondary" : glassStyles;
	const iconColor = isText ? "text-black" : "text-white";

	return (
		<motion.div
			className={clsx(
				className,
				containerPosition,
				"z-10 isolate flex items-center justify-between gap-2"
			)}
			animate={{
				opacity: isHovered ? 1 : 0,
				y: isHovered ? 0 : -20
			}}
			transition={{ duration: 0.3 }}
		>
			{/* Left side user info */}
			<div
				className={clsx(
					headerBg,
					"flex items-center space-x-3 rounded-full px-3 h-16 w-[206px]"
				)}
			>
				<Avatar className="h-10 w-10 aspect-square outline-2 outline-offset-2 outline-normal-active">
					<AvatarImage src={displayProfileImage} />
					<AvatarFallback>
						<Image
							src="/profile_icon.jpg"
							alt="Profile"
							fill
							className="object-cover"
						/>
					</AvatarFallback>
				</Avatar>
				<div
					className={clsx(
						textColor,
						"flex flex-col"
					)}
				>
					<span className="font-semibold text-lg">
						{displayName}
					</span>
					<span className="text-sm">
						{displayHandle}
					</span>
				</div>
			</div>

			{/* Right side actions */}
			<div className="flex gap-2 md:gap-4">
				{/* Views Counter */}
				<div
					className={clsx(
						buttonBg,
						"h-16 px-5 rounded-full flex items-center justify-center gap-2"
					)}
				>
					<Eye className={clsx("w-5 h-5", iconColor)} />
					<span className={clsx("font-semibold text-sm", iconColor)}>
						{formatCount(views)}
					</span>
				</div>

				{showFollowButton && (
					<Button
						className={clsx(
							buttonBg,
							"w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
						)}
						onClick={(e) => toggleFollow(e)}
					>
						<UserPlusIcon
							className={clsx(
								"w-6 h-6",
								iconColor
							)}
						/>
					</Button>
				)}

				{/* Volume Control */}
				{type === "video" && (
					<Button
						className={clsx(
							buttonBg,
							"w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
						)}
						onClick={toggleMute}
					>
						{isMuted ? (
							<VolumeX className="text-white w-5 h-5" />
						) : (
							<Volume2 className="text-white w-5 h-5" />
						)}
					</Button>
				)}

				<DropdownMenu>
					<DropdownMenuTrigger
						className={clsx(
							buttonBg,
							"w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
						)}
					>
						<MoreVertical
							className={clsx(
								"w-6 h-6",
								iconColor
							)}
						/>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						side="bottom"
						align="end"
						className="w-48 bg-gray-50 px-4"
					>
						{[
							"Not Interested",
							"Report",
							"Save",
							"View Profile",
							`Block ${username}`
						].map((item, idx, arr) => (
							<div key={item}>
								<DropdownMenuItem>
									{item}
								</DropdownMenuItem>
								{idx < arr.length - 1 && (
									<DropdownMenuSeparator />
								)}
							</div>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</motion.div>
	);
};

export { PostHeader };
