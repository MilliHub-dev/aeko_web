"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from "@/components/ui/avatar";
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
	VolumeX
} from "lucide-react";
import { motion } from "motion/react";
import clsx from "clsx";

interface PostHeaderProps {
	type?: "image" | "video" | "text";
	username?: string;
	handle?: string;
	profileImage?: string;
	className?: string;
	isHovered?: boolean;
	isMuted?: boolean;
	toggleMute?: () => void;
}

const PostHeader = ({
	type,
	username,
	handle,
	profileImage,
	className,
	isHovered = false,
	isMuted = false,
	toggleMute
}: PostHeaderProps) => {
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
					<AvatarImage src={profileImage} />
					<AvatarFallback>You</AvatarFallback>
				</Avatar>
				<div
					className={clsx(
						textColor,
						"flex flex-col"
					)}
				>
					<span className="font-semibold text-lg">
						{username}
					</span>
					<span className="text-sm">
						{handle}
					</span>
				</div>
			</div>

			{/* Right side actions */}
			<div className="flex gap-2 md:gap-4">
				<Button
					className={clsx(
						buttonBg,
						"w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
					)}
				>
					<UserPlusIcon
						className={clsx(
							"w-6 h-6",
							iconColor
						)}
					/>
				</Button>

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
