import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserPlusBroken } from "@/lib/icons";

interface PostHeaderProps {
	username: string | undefined;
	handle: string | undefined;
	profileImage: string | undefined;
	className?: string;
	avatarBackground?: "bg-black/30 backdrop-blur-sm" | "bg-none" | "bg-secondary";
	dropDownBackground?: "bg-black/30 backdrop-blur-sm" | "bg-none" | "bg-secondary";
	avatarText?: "text-white" | "text-primary";
}

const PostHeader = ({
	username,
	handle,
	profileImage,
	className = "",
	avatarBackground = "bg-black/30 backdrop-blur-sm",
	dropDownBackground = "bg-black/30 backdrop-blur-sm",
	avatarText = "text-white"
}: PostHeaderProps) => (
	<div className={`flex items-center justify-between ${className}`}>
		<div
			className={`flex items-center space-x-3 rounded-full px-2.5 py-1.75 w-[206px] ${avatarBackground} h-13`}
		>
			<Avatar className="h-10 w-10 aspect-square outline-2 outline-offset-2 outline-normal-active">
				<AvatarImage src={profileImage} />
				<AvatarFallback>You</AvatarFallback>
			</Avatar>
			<div className="flex flex-col">
				<span className={`${avatarText} font-semibold text-lg`}>{username}</span>
				<span className={`${avatarText}/70 text-sm`}>{handle}</span>
			</div>
		</div>
		<div className="flex gap-4">
			<Button
				className={`w-13 h-13 px-2.5 py-1.75 rounded-full flex items-center justify-center ${dropDownBackground} cursor-pointer`}
			>
				<UserPlusBroken className={`w-5 h-5  ${avatarText}`} />
			</Button>
			<DropdownMenu>
				<DropdownMenuTrigger
					asChild
					className={`w-13 h-13 px-2.5 py-1.75 rounded-full flex items-center justify-center ${dropDownBackground} cursor-pointer`}
				>
					<MoreVertical className={`w-5 h-5  ${avatarText}`} />
				</DropdownMenuTrigger>
				<DropdownMenuContent
					side="bottom"
					align="end"
					className="w-48 bg-gray-50 px-4"
				>
					<DropdownMenuItem>Not Interested</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Report</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Save</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>View Profile</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Block {username}</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	</div>
);

export { PostHeader };
