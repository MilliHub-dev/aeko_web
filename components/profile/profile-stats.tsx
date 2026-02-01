"use client";

import { User } from "@/types/user";
import { useState } from "react";
import { UserListModal } from "./user-list-modal";

interface ProfileStatsProps {
  user: User;
}

export function ProfileStats({ user }: ProfileStatsProps) {
  const [modalType, setModalType] = useState<"followers" | "following" | null>(null);

  const openModal = (type: "followers" | "following") => {
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
  };

  return (
    <>
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-12 mb-8">
        <div className="flex flex-col items-center min-w-[60px]">
          <span className="text-lg font-bold text-foreground">
            {user.postsCount ?? user.posts?.length ?? 0}
          </span>
          <span className="text-sm text-muted-foreground">Posts</span>
        </div>
        
        <div 
          className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity min-w-[60px]"
          onClick={() => openModal("followers")}
        >
          <span className="text-lg font-bold text-foreground">
            {user.followersCount ?? user.followers?.length ?? 0}
          </span>
          <span className="text-sm text-muted-foreground">Followers</span>
        </div>

        <div 
          className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity min-w-[60px]"
          onClick={() => openModal("following")}
        >
          <span className="text-lg font-bold text-foreground">
            {user.followingCount ?? user.following?.length ?? 0}
          </span>
          <span className="text-sm text-muted-foreground">Following</span>
        </div>

        <div className="flex flex-col items-center min-w-[60px]">
          <span className="text-lg font-bold text-foreground">
            {user.likesCount ?? 0}
          </span>
          <span className="text-sm text-muted-foreground">Likes</span>
        </div>

        <div className="flex flex-col items-center min-w-[60px]">
          <span className="text-lg font-bold text-foreground">
            {user.bookmarksCount ?? 0}
          </span>
          <span className="text-sm text-muted-foreground">Saved</span>
        </div>
      </div>

      <UserListModal 
        isOpen={!!modalType}
        onClose={closeModal}
        userId={user._id || user.id}
        type={modalType}
      />
    </>
  );
}
