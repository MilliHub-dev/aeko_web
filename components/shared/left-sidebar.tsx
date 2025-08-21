"use client";

import { sidebarRoutes } from "@/lib/routes";
import Link from "next/link";
import { Logo } from "../logo";
import { usePathname } from "next/navigation";
import { useMobile } from "@/hooks/use-mobile";
import { PostType } from "../home/post-feed/post";
import { CreatePost } from "../home/create-post";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "@base-ui-components/react/scroll-area";

const LeftSidebar = () => {
  const path = usePathname();

  const handleCreatePost = async (postData: {
    type: PostType;
    content: string;
    media?: File;
    hashtags: string[];
  }) => {
    // Handle post creation here
    // You can send the data to your API
    console.log("New post:", postData);
  };

  return (
    <aside className="hidden xl:block flex-shrink-0 border-r border-gray-200 ">
      <div className="sticky top-0 flex flex-col h-screen gap-8 border-none p-8 xl:p-0 xl:px-8 text-xl text-black">
        {/* User Profile at the top */}
        <div className="flex flex-col items-center gap-y-4 pt-8">
          <Avatar className="h-16 w-16 aspect-square outline-2 outline-offset-2 outline-normal-active">
            <AvatarImage src="/profile.jpeg" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="text-lg font-medium">John Doe</p>
            <p className="text-sm font-medium text-muted-foreground">
              @johndoe
            </p>
          </div>
          <div className="flex justify-between w-full text-md mt-2">
            <div className="text-center">
              <p className="font-medium">46</p>
              <p className="text-muted-foreground">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-medium">2.8K</p>
              <p className="text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-medium">200</p>
              <p className="text-muted-foreground">Following</p>
            </div>
          </div>
        </div>

        <ScrollArea.Root className="">
          <ScrollArea.Viewport className="h-[calc(100vh-28rem)]">
            {/* Navigation Links */}
            <nav className="flex flex-col items-start gap-y-4 ">
              {sidebarRoutes.map((route) => {
                const Icon = route.icon;
                return (
                  <Link
                    href={route.path}
                    key={route.name}
                    className={`
                      flex items-center w-full p-3 gap-x-3 rounded-md 
                      hover:bg-secondary hover:text-primary
                      transition-all duration-200 ease-in-out xl:w-65
                      ${
                        path === route.path || path.startsWith(`${route.path}/`)
                          ? "bg-primary text-white"
                          : "bg-transparent"
                      }
                `}
                    title={route.name}
                  >
                    <div className="flex justify-center items-center">
                      <Icon
                        className="transition-transform duration-200"
                        strokeWidth={1.5}
                        size={24}
                      />
                    </div>
                    <span className="block font-medium">{route.name}</span>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar className="m-2 flex w-1 justify-center rounded bg-secondary opacity-0 transition-opacity delay-300 data-[hovering]:opacity-100 data-[hovering]:delay-0 data-[hovering]:duration-75 data-[scrolling]:opacity-100 data-[scrolling]:delay-0 data-[scrolling]:duration-75">
            <ScrollArea.Thumb className="w-full rounded bg-primary" />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner />
        </ScrollArea.Root>
        <div className="">
          <CreatePost onPost={handleCreatePost} />
        </div>

        {/* Logo at the bottom */}
        <div className="mt-auto mb-8 flex-shrink-0 w-20">
          <Logo />
        </div>

        {/* Create Post Button */}
      </div>
    </aside>
  );
};

export { LeftSidebar };
