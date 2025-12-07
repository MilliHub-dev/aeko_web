"use client";

import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Heart, MessageCircle, Share2, TrendingUp } from "lucide-react";
import type { FeedPost } from "@/types/post";
import type { ReactNode } from "react";

interface ViralPostsProps {
  posts: FeedPost[];
}

export function ViralPosts({ posts }: ViralPostsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-secondary" />
            Viral Right Now
          </h2>
          <p className="text-sm text-muted-foreground">
            The hottest content breaking the internet today.
          </p>
        </div>
        <button
          type="button"
          className="text-sm font-semibold text-secondary transition hover:text-secondary/80">
          See more
        </button>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {posts.map((post) => (
          <ViralPostCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
}

function ViralPostCard({ post }: { post: FeedPost }) {
  const mediaUrl = post.media || "/placeholder.svg";
  const displayText = post.text || "";

  return (
    <Link
      href={`/home/post/${post._id}`}
      className="group relative aspect-[9/16] overflow-hidden rounded-[24px] bg-black/5 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
      {post.type !== "text" && (
        <>
          <Image
            fill
            src={mediaUrl}
            alt={displayText.substring(0, 50)}
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/40 to-black/90" />
        </>
      )}

      <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
        {/* Top Section - Author */}
        <div className="flex items-center gap-2.5">
          <Avatar className="h-9 w-9 border-2 border-white/70">
            <AvatarImage src={post.user.profilePicture} alt={post.user.name} />
            <AvatarFallback className="bg-primary text-white text-xs">
              {post.user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold leading-tight truncate">
              {post.user.name}
            </p>
            <p className="text-xs text-white/70 truncate">
              @{post.user.username}
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-red-500/90 px-2 py-0.5">
            <TrendingUp className="h-3 w-3" />
            <span className="text-[10px] font-semibold uppercase">Viral</span>
          </div>
        </div>

        {/* Bottom Section - Content & Metrics */}
        <div className="space-y-2.5">
          {displayText && (
            <p className="line-clamp-2 text-sm text-white/95">{displayText}</p>
          )}
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/90">
            <Metric
              icon={<Eye className="h-3.5 w-3.5" />}
              label={post.views.toLocaleString()}
            />
            <Metric
              icon={<Heart className="h-3.5 w-3.5" />}
              label={post.likesCount.toLocaleString()}
            />
            <Metric
              icon={<MessageCircle className="h-3.5 w-3.5" />}
              label={post.commentsCount.toLocaleString()}
            />
            <Metric
              icon={<Share2 className="h-3.5 w-3.5" />}
              label={post.engagement.totalShares.toLocaleString()}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

interface MetricProps {
  icon: ReactNode;
  label: string;
}

function Metric({ icon, label }: MetricProps) {
  return (
    <span className="inline-flex items-center gap-1">
      {icon}
      {label}
    </span>
  );
}
