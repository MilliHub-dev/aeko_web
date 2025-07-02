"use client";

import { Post as PostType } from "@/lib/types";
import { Post } from "@/components/post";
import { useState } from "react";

export default function Home() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());

  const samplePosts: PostType[] = [
    {
      id: 1,
      type: "photo",
      user: {
        name: "Sarah Wilson",
        avatar: "/placeholder.svg",
        location: "New York, USA",
      },
      content: {
        grid: [
          {
            type: "image",
            url: "/placeholder.svg",
          },
          {
            type: "image",
            url: "/placeholder.svg",
          },
        ],
      },
      stats: {
        likes: 1234,
        comments: 89,
        timePosted: "2h ago",
      },
    },
    {
      id: 2,
      type: "video",
      user: {
        name: "Alex Chen",
        avatar: "/placeholder.svg",
      },
      content: {
        grid: [
          {
            type: "video",
            url: "/demo.mp4",
          },
        ],
      },
      stats: {
        likes: 5678,
        comments: 234,
        timePosted: "5h ago",
      },
    },
    {
      id: 3,
      type: "photo",
      user: {
        name: "Maria Garcia",
        avatar: "/placeholder.svg",
        location: "Barcelona, Spain",
      },
      content: {
        grid: [
          {
            type: "image",
            url: "/placeholder.svg",
          },
          {
            type: "image",
            url: "/placeholder.svg",
          },
          {
            type: "image",
            url: "/placeholder.svg",
          },
        ],
      },
      stats: {
        likes: 3456,
        comments: 167,
        timePosted: "1d ago",
      },
    },
  ];

  const toggleLike = (postId: number) => {
    const newLiked = new Set(likedPosts);
    newLiked.has(postId) ? newLiked.delete(postId) : newLiked.add(postId);
    setLikedPosts(newLiked);
  };

  const toggleSave = (postId: number) => {
    const newSaved = new Set(savedPosts);
    newSaved.has(postId) ? newSaved.delete(postId) : newSaved.add(postId);
    setSavedPosts(newSaved);
  };
  return (
    <main className="">
      <div className="space-y-6">
        {samplePosts.map((post) => (
          <Post
            key={post.id}
            post={post}
            likedPostsSet={likedPosts}
            savedPostsSet={savedPosts}
          />
        ))}
      </div>
    </main>
  );
}
