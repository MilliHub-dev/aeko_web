import { sidebarRoutes } from "@/lib/routes";
import Link from "next/link";

const LeftSidebar = () => {
  return (
    <aside className="hidden md:block fixed left-[max(0px,calc(50%-640px))] top-16 bottom-0 w-16 lg:w-64 bg-background border-r border-gray-200 overflow-y-auto">
      <div className="px-2 lg:px-6 py-8 h-full">
        {/* <div className="bg-green-100 border-2 border-dashed border-green-300 rounded-lg p-2 lg:p-4 h-full flex items-start"> */}
        <div className="text-left">
          <span className="space-y-4 font-medium block text-xs lg:text-base">
            {sidebarRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <Link
                  href={route.path}
                  key={route.name}
                  className="flex-1 flex gap-x-3 space-y-4 md:justify-center lg:justify-start"
                >
                  <span>
                    <Icon />
                  </span>
                  <span className="hidden lg:block">{route.name}</span>
                </Link>
              );
            })}
          </span>
        </div>
        {/* </div> */}
      </div>
    </aside>
  );
};

export { LeftSidebar };
