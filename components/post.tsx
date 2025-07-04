import Image from "next/image";
import {
  MapPin,
  MoreHorizontal,
  Heart,
  Bookmark,
  Volume2,
  Play,
  MessageCircle,
  Send,
  Repeat2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { Post as PostType } from "@/lib/types";

export function Post({
  post,
  likedPostsSet,
  savedPostsSet,
}: {
  post: PostType;
  likedPostsSet: Set<number>;
  savedPostsSet: Set<number>;
}) {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(likedPostsSet);
  const [savedPosts, setSavedPosts] = useState<Set<number>>(savedPostsSet);

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
    <div className="glass dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-transparent shadow-lg dark:shadow-none max-w-xl mx-auto">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={post.user.avatar} />
            <AvatarFallback className="bg-aeko-purple text-white text-xs">
              {post.user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                {post.user.name}
              </span>
              <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                {post.stats.timePosted}
              </span>
            </div>
            {post.user.location && (
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <MapPin className="w-3 h-3" />
                <span>{post.user.location}</span>
              </div>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Post Content */}
      <div className="relative aspect-square bg-gradient-to-br from-aeko-dark-purple via-aeko-purple to-aeko-light-purple">
        {post.content.grid.map((item, index) => (
          <div key={index} className="absolute inset-0">
            {item.type === 'video' ? (
              <>
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  controls={false}
                />
                {/* Video Controls */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-3">
                  <Button
                    size="icon"
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  >
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="icon"
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  >
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-1" />
                  </Button>
                </div>
              </>
            ) : (
              <Image
                src={item.url}
                alt={`Post content ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </div>
        ))}
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className={`text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 ${
                likedPosts.has(post.id) ? "text-red-500" : ""
              }`}
              onClick={() => toggleLike(post.id)}
            >
              <Heart
                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  likedPosts.has(post.id) ? "fill-current" : ""
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <Send className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <Repeat2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 ${
              savedPosts.has(post.id) ? "text-aeko-primary" : ""
            }`}
            onClick={() => toggleSave(post.id)}
          >
            <Bookmark
              className={`w-5 h-5 sm:w-6 sm:h-6 ${
                savedPosts.has(post.id) ? "fill-current" : ""
              }`}
            />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-gray-900 dark:text-white">
            <span className="font-semibold">{post.stats.likes.toLocaleString()} likes</span>
          </div>
          <div className="text-sm text-gray-800 dark:text-white">
            <span className="font-semibold">{post.user.name}</span>{" "}
            <span>Just dropped my latest Bitcoin analysis! What do you think? 🔥</span>
          </div>
          <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-300">
            View all {post.stats.comments} comments
          </button>
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            {post.stats.timePosted}
          </div>
        </div>
      </div>
    </div>
  );
}
