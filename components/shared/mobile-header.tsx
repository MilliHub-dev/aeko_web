"use client";

import { Bell, Grid, MessageSquare } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button"; // Adjust to your actual Button import
import { Logo } from "../logo";

const MobileHeader = () => {
	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md px-4 py-3 md:hidden">
			<div className="flex items-center justify-between">
				{/* Left Icon - Grid */}
				<Button
					variant="ghost"
					size="icon"
					className="rounded-full bg-secondary hover:bg-primary hover:text-secondary h-10 w-10 md:h-13 md:w-13 border"
				>
					<Grid className="h-5 w-5" />
				</Button>

				{/* Center Logo */}
				<div className="flex-shrink-0 w-16">
					<Logo />
				</div>

				{/* Right Icons */}
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
				</div>
			</div>
		</header>
	);
};

export { MobileHeader };
