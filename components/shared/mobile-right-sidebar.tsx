"use client";

import { FeedPost } from "@/types/post";
import { CreatePost } from "../home/create-post";

export function MobileRightSidebar() {
  const handleCreatePost = async (postData: {
    type: FeedPost;
    content: string;
    media?: File;
    hashtags: string[];
  }) => {
    console.log("New post:", postData);
  };

  return (
    <aside className="fixed right-0 top-0 z-40 hidden h-screen w-full flex-col border-l border-border/60 bg-card/80 text-muted-foreground shadow-[0_18px_30px_rgba(15,15,15,0.35)] backdrop-blur-xl md:flex xl:hidden">
      <div className="flex h-full flex-col items-center justify-between py-6">
        <div className="flex gap-1 text-xs">
          <span className="h-2 w-2 rounded-full bg-destructive" />
          <span className="h-2 w-2 rounded-full bg-secondary" />
          <span className="h-2 w-2 rounded-full bg-primary" />
        </div>
        <div className="mt-auto">
          <CreatePost onPost={handleCreatePost} />
        </div>
      </div>
    </aside>
  );
}
