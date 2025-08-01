import { Bell, Grid3X3, MessageSquare } from "lucide-react";
import { Logo } from "../logo";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const DesktopHeader = () => {
	return (
		<header className="sticky top-0 z-50">
			<div className="container mx-auto py-2 px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center space-x-8">
						<Logo />
					</div>
					<div className="flex items-center space-x-4">
						<Button
							variant="ghost"
							size="icon"
							className="rounded-full bg-secondary h-13 w-13"
						>
							<Bell className="h-5 w-5" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="rounded-full bg-secondary h-13 w-13"
						>
							<MessageSquare className="h-5 w-5" />
						</Button>
						<Avatar className="h-13 w-13 aspect-square">
							<AvatarImage src="/profile.jpeg" />
							<AvatarFallback>You</AvatarFallback>
						</Avatar>
					</div>
				</div>
			</div>
		</header>
	);
};

export { DesktopHeader };
