import { Explore } from "../explore";
import { WhoToFollow } from "../who-to-follow";

const RightSidebar = () => {
  return (
    <aside className="hidden xl:block fixed right-[max(0px,calc(50%-640px))] top-0 bottom-0 w-80 bg-primary backdrop-blur supports-[backdrop-filter]:bg-primary/50 dark:bg-background/30 border-l border-border/30 overflow-y-auto">
      <div className="p-6 h-full">
        <div className="space-y-6">
          <Explore />
          <WhoToFollow />
        </div>
      </div>
    </aside>
  );
};

export { RightSidebar };
