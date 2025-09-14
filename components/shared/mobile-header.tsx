"use client";

import { Bell, Menu } from "lucide-react";
import { Button } from "../ui/button"; // Adjust to your actual Button import
import { Logo } from "../logo";
import { useRouteName } from "@/hooks";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChatIcon } from "@/lib/icons";
import { getLayoutConfig } from "@/lib/layout-config";

const MobileHeader = () => {
    const routeName = useRouteName();
    const path = usePathname();
    const { isUserPostsRoute } = getLayoutConfig(path);

	return (
		<header
			className={
				isUserPostsRoute
					? "hidden "
					: "fixed top-0 left-0 right-0 bg-transparent mask-b-from-80% mask-radial-[70%_100%] mask-radial-from-100% backdrop-blur-sm px-4 py-3 md:hidden z-10 isolate"
			}
		>
			<div className="flex items-center justify-between">
				{/* Left Icon - Grid */}
				<Button
					variant="ghost"
					size="icon"
					className="rounded-full bg-secondary hover:bg-primary hover:text-secondary h-15 w-15 md:h-13 md:w-13 "
				>
					<Menu className="size-6" />
				</Button>

				{/* Center Logo */}
                <div className="flex-shrink-0 w-18">
                    {path === "/" ? (
                        <Logo />
                    ) : (
                        <h1 className="text-3xl font-bold">{routeName}</h1>
                    )}
                </div>

				{/* Right Icons */}
				<div className="flex justify-center items-center space-x-4">
					<Link
						href="/notifications"
						className="rounded-full bg-secondary hover:bg-primary hover:text-secondary h-15 w-15 md:h-13 md:w-13 flex justify-center items-center"
					>
						<Bell className="size-6" />
					</Link>
					{path !== "/messages" && (
						<Link
							href="/messages"
							className="rounded-full bg-secondary hover:bg-primary hover:text-secondary h-15 w-15 md:h-13 md:w-13 flex justify-center items-center"
						>
							<ChatIcon className="size-6" />
						</Link>
					)}
				</div>
			</div>
		</header>
	);
};

export { MobileHeader };
