"use client";

import Image from "next/image";
import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Post() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>();
  const [savedPosts, setSavedPosts] = useState<Set<number>>();

  const toggleLike = (postId: number) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    setLikedPosts(newLiked);
  };

  const toggleSave = (postId: number) => {
    const newSaved = new Set(savedPosts);
    if (newSaved.has(postId)) {
      newSaved.delete(postId);
    } else {
      newSaved.add(postId);
    }
    setSavedPosts(newSaved);
  };

  return (
    <div className="border border-border dark:border-border/30 bg-background/95 backdrop-blur-md rounded-2xl overflow-hidden w-full">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-gray-300 text-gray-700 text-sm font-medium">
              XA
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                X_AE_A-13
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Product Designer, slothUI
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 w-8 h-8"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
          Habitant morbi tristique senectus et netus et. Suspendisse sed nisi lacus sed viverra. Dolor morbi non arcu risus quis varius.{" "}
          <span className="text-primary">#amazing</span>{" "}
          <span className="text-primary">#great</span>{" "}
          <span className="text-primary">#lifetime</span>{" "}
          <span className="text-primary">#uiux</span>{" "}
          <span className="text-primary">#machinelearning</span>
        </p>
      </div>

      {/* Post Image */}
      <div className="px-4 pb-4">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300">
          {/* <Image
            src="/placeholder.svg"
            alt="Post content"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          /> */}
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary hover:bg-gray-100 dark:hover:bg-gray-800 w-8 h-8"
                onClick={() => toggleLike(1)}
              >
                <Heart className="w-4 h-4" strokeWidth={1.5} />
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">12 Likes</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary hover:bg-gray-100 dark:hover:bg-gray-800 w-8 h-8"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">25 Comments</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary hover:bg-gray-100 dark:hover:bg-gray-800 w-8 h-8"
              >
                <Share className="w-4 h-4" strokeWidth={1.5} />

              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">187 Share</span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-primary hover:bg-gray-100 dark:hover:bg-gray-800 w-8 h-8"
            onClick={() => toggleSave(1)}
          >
            <Bookmark className="w-4 h-4" strokeWidth={1.5} />  

          </Button>
        </div>
      </div>
    </div>
  );
}
