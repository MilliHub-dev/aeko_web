"use client";

import { useState, useEffect, useCallback } from "react";
import { Bookmark, Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FeedPost, PaginatedPostsResponse } from "@/types/post";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BookmarksPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchBookmarks = useCallback(async (pageNum: number) => {
    try {
      if (pageNum === 1) setLoading(true);
      const res = await fetch(`/api/posts/user/bookmarks?page=${pageNum}&limit=12`);
      const data: PaginatedPostsResponse = await res.json();
      
      if (data.posts) {
        setPosts(prev => pageNum === 1 ? data.posts : [...prev, ...data.posts]);
        setHasMore(data.posts.length > 0 && (data.pagination ? pageNum < data.pagination.pages : false));
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch bookmarks", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks(1);
  }, [fetchBookmarks]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBookmarks(nextPage);
  };

  return (
    <div className="container max-w-4xl mx-auto pb-20 pt-4 px-4 md:px-0">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Bookmarks</h1>
          <p className="text-muted-foreground text-sm">Posts you've saved for later</p>
        </div>
      </div>

      {!loading && posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground p-12 mt-8">
          <div className="p-6 bg-muted/50 rounded-full">
            <Bookmark className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-foreground">No bookmarks yet</h3>
            <p>Save posts to view them here later.</p>
          </div>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/explore">Explore Posts</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-0.5 md:gap-4">
            {posts.map((post, index) => {
              // Handle potential ID mismatch (API might return id or _id)
              const postId = post._id || (post as any).id;
              
              const getMediaSource = () => {
                if (post.mediaUrls && post.mediaUrls.length > 0) return post.mediaUrls[0];
                if (Array.isArray(post.media) && post.media.length > 0) return post.media[0];
                if (typeof post.media === 'string') return post.media;
                return post.mediaUrl;
              };
              const mediaUrl = getMediaSource();
              const isVideo = mediaUrl?.endsWith(".mp4") || mediaUrl?.endsWith(".webm") || mediaUrl?.endsWith(".mov") || post.type === "video";
              
              return (
                <Link
                  href={postId ? `/${post.user?.username || 'user'}/posts/${postId}` : '#'}
                  key={`${postId || 'no-id'}-${index}`}
                  className="relative aspect-[4/5] bg-muted overflow-hidden group cursor-pointer rounded-sm md:rounded-md"
                >
                  {mediaUrl ? (
                    isVideo ? (
                      <div className="w-full h-full relative">
                        <video 
                          src={mediaUrl} 
                          className="w-full h-full object-cover" 
                          muted 
                          loop
                          playsInline
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <div className="p-2 bg-black/40 rounded-full backdrop-blur-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={mediaUrl}
                        alt={`Post ${post._id}`}
                        fill
                        sizes="(max-width: 768px) 33vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground p-4 text-xs text-center">
                      <span className="line-clamp-4">{post.text || "Text Post"}</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {(loading || hasMore) && (
            <div className="flex justify-center py-8">
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : hasMore ? (
                <Button onClick={loadMore} variant="outline">
                  Load More
                </Button>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
