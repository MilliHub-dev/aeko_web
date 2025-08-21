"use client";

import { Explore } from "./explore";
import { WhoToFollow } from "./who-to-follow";

const RightSidebar = () => {
  return (
    <aside className="hidden xl:block flex-shrink-0 border-l border-gray-200 ">
      <div className="sticky top-0 space-y-6 p-8">
        <WhoToFollow />
        <Explore />
      </div>
    </aside>
  );
};

export { RightSidebar };
