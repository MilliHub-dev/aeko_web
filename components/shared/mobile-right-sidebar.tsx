"use client";

import Link from "next/link";
import { PostType } from "../home/post-feed/post";
import { CreatePost } from "../home/create-post";

const MobileRightSidebar = () => {
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
    <aside className="hidden md:flex flex-col xl:hidden fixed right-0 top-0 bottom-0 w-[90px] z-40">
      <div className="flex flex-col items-center py-6 h-full">
        <div className="mt-auto">
          <CreatePost onPost={handleCreatePost} />
        </div>
      </div>
    </aside>
  );
};

export { MobileRightSidebar };
