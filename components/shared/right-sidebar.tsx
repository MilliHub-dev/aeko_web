import { Explore } from "../explore";
import { WhoToFollow } from "../who-to-follow";

const RightSidebar = () => {
  return (
    <aside className="hidden xl:block fixed right-[max(0px,calc(50%-640px))] top-0 bottom-0 w-80 bg-primary dark:bg-background border-l border-border/30 overflow-y-auto">
      <div className="flex flex-col gap-y-6 p-6 h-full">
        <WhoToFollow />
        <Explore />
      </div>
    </aside>
  );
};

export { RightSidebar };
