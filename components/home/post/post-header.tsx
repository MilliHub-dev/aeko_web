"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
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

import { ReportDialog } from "@/components/report/report-dialog";
import { toast } from "sonner";
import { useState } from "react";
import { usePostsStore } from "@/features/posts/stores";
import { EditPostDialog } from "./edit-post-dialog";

interface PostHeaderProps {
	postId?: string;
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
        blueTick?: boolean;
        goldenTick?: boolean;
	};
	className?: string;
	isHovered?: boolean;
	isMuted?: boolean;
	toggleMute?: () => void;
	views?: number;
    isAd?: boolean;
    targetUrl?: string;
}

const PostHeader = ({
	postId,
	type,
	username,
	handle,
	profileImage,
	user,
	className,
	isHovered = false,
	isMuted = false,
	toggleMute,
	views = 0,
    isAd,
    targetUrl
}: PostHeaderProps) => {
	// Extract user info from either flat props or nested user object
	const displayName = user?.name || username || "Unknown User";
	const displayHandle = user?.username || handle || "";
	const displayProfileImage = user?.profilePicture || profileImage || "";

	const { user: currentUser } = useUser();
	const targetUserId = user?._id || "";
	// Check against both _id and id to handle potential inconsistencies
	const currentUserId = currentUser?._id || currentUser?.id;
	const isOwnPost = currentUserId && targetUserId && currentUserId === targetUserId;
	const { isFollowing, toggleFollow } = useFollowUser(targetUserId);

    const { posts } = usePostsStore();
    const post = posts.find(p => p._id === postId);

    // State for Report Dialog
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
    
    // State for Edit Dialog
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    
    // State for hiding post (Not Interested)
    const [isHidden, setIsHidden] = useState(false);

    const handleNotInterested = async () => {
        if (!postId) return;
        
        try {
            const res = await fetch(`/api/posts/${postId}/not-interested`, {
                method: "POST"
            });
            
            if (res.ok) {
                toast.success("Post marked as not interested");
                setIsHidden(true);
            } else {
                toast.error("Failed to mark as not interested");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    };

    const handleAdClick = () => {
        if (isAd && postId) {
            const originalAdId = postId.split('-instance-')[0];
            fetch('/api/ads/track/click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adId: originalAdId })
            }).catch(console.error);
        }
    };

	// Show follow button only if:
	// 1. We have a valid target user ID
	// 2. It's not the current user's own post
	// 3. The current user is not already following them
	const showFollowButton = targetUserId && !isOwnPost && !isFollowing && !isAd;

    if (isHidden) return null;

	// shared style sets
	const isText = type === "text";
	const glassStyles =
		"bg-black/30 backdrop-blur-md border border-white/20 shadow-[inset_0_1px_4px_rgba(255,255,255,0.25),0_4px_10px_rgba(0,0,0,0.35),0_0_12px_rgba(255,255,255,0.15)]";

	const containerPosition = isText
		? "top-4 relative"
		: "absolute top-4 left-0 right-0 px-4 md:top-8 md:px-0 md:left-4 md:right-4";
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
			<Link
				href={isAd ? (targetUrl || "#") : `/${displayHandle}`}
                target={isAd && targetUrl ? "_blank" : undefined}
                onClick={handleAdClick}
				className={clsx(
					headerBg,
					"flex items-center space-x-3 rounded-full px-3 h-16 w-[206px] hover:opacity-90 transition-opacity cursor-pointer"
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
						"flex flex-col truncate"
					)}
				>
					<span className="font-semibold text-lg truncate flex items-center gap-1">
						{displayName}
            {user?.blueTick && !isAd && (
              <Image
                src="/blue_tick.png"
                alt="Verified"
                width={14}
                height={14}
                className="h-3.5 w-3.5"
              />
            )}
            {user?.goldenTick && !isAd && (
              <Image
                src="/gold_tick.png"
                alt="Gold Verified"
                width={14}
                height={14}
                className="h-3.5 w-3.5"
              />
            )}
            {isAd && (
              <span className="text-[10px] bg-yellow-400 text-black px-1.5 rounded-full font-bold ml-1">
                AD
              </span>
            )}
					</span>
					<span className="text-sm truncate">
						{isAd ? "Sponsored" : displayHandle}
					</span>
				</div>
			</Link>

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
                        {isOwnPost && (
                            <>
                                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                        )}
						{!isOwnPost && (
							<>
								<DropdownMenuItem onClick={handleNotInterested}>
									Not Interested
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => setIsReportDialogOpen(true)}>
									Report
								</DropdownMenuItem>
								<DropdownMenuSeparator />
							</>
						)}
						<DropdownMenuItem>Save</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link 
								href={isOwnPost ? "/profile" : `/${displayHandle.replace(/^@/, '')}`}
								className="w-full cursor-pointer"
							>
								View Profile
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-red-500 focus:text-red-500">
							Block @{displayHandle.replace(/^@/, '') || "user"}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

            {/* Report Dialog */}
            <ReportDialog 
                isOpen={isReportDialogOpen}
                onOpenChange={setIsReportDialogOpen}
                entityId={postId || ""}
                entityType="POST"
                reportedId={targetUserId}
            />

            {/* Edit Post Dialog */}
            <EditPostDialog 
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                postId={postId || ""}
                currentText={post?.text || ""}
            />
		</motion.div>
	);
};

export { PostHeader };
