"use client";

import { usePathname } from "next/navigation";
import { Explore } from "./explore";
import { WhoToFollow } from "./who-to-follow";

const RightSidebar = () => {
  const path = usePathname();

  return (
		<aside
			className={`hidden xl:block w-80 flex-shrink-0 ${
				path === "/wallet" ||
				path === "/live-streams" ||
				path === "/explore" ||
				path === "/settings"
			}`}
		>
			<div className="sticky top-24 space-y-6">
				<WhoToFollow />
				<Explore />
			</div>
		</aside>
  );
};

export { RightSidebar };
