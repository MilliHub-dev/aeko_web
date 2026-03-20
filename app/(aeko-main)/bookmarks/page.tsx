"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Bookmark, Loader2, Play, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { FeedPost, PaginatedPostsResponse } from "@/types/post";
import { Button } from "@/components/ui/button";

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
        setPosts((prev) => (pageNum === 1 ? data.posts : [...prev, ...data.posts]));
        setHasMore(
          data.posts.length > 0 &&
            (data.pagination ? pageNum < data.pagination.pages : false),
        );
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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-24 pt-4 md:px-6 md:pt-6">
      <section className="overflow-hidden rounded-[32px] border border-border/60 bg-[radial-gradient(140%_140%_at_0%_0%,rgba(0,127,109,0.16),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.97),rgba(244,248,247,0.92))] shadow-[0_26px_90px_-56px_rgba(15,23,42,0.45)]">
        <div className="flex flex-col gap-5 p-5 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="md:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="space-y-3">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Saved
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                    Bookmarks
                  </h1>
                  <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                    A cleaner archive for ideas, references, and posts worth coming back to.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 shadow-sm">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Saved posts
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{posts.length}</p>
            </div>
          </div>
        </div>
      </section>

      {!loading && posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-border/70 bg-card/50 px-6 py-16 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10">
            <Bookmark className="h-7 w-7 text-primary" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-foreground">No bookmarks yet</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Save standout posts to build your own reference shelf here.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link href="/explore">Explore Posts</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((post, index) => {
              const postId = post._id || (post as any).id;

              const getMediaSource = () => {
                if (post.mediaUrls && post.mediaUrls.length > 0) return post.mediaUrls[0];
                if (Array.isArray(post.media) && post.media.length > 0) return post.media[0];
                if (typeof post.media === "string") return post.media;
                return post.mediaUrl;
              };

              const mediaUrl = getMediaSource();
              const isVideo =
                mediaUrl?.endsWith(".mp4") ||
                mediaUrl?.endsWith(".webm") ||
                mediaUrl?.endsWith(".mov") ||
                post.type === "video";

              return (
                <Link
                  href={postId ? `/${post.user?.username || "user"}/posts/${postId}` : "#"}
                  key={`${postId || "no-id"}-${index}`}
                  className="group overflow-hidden rounded-[28px] border border-border/60 bg-card/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    {mediaUrl ? (
                      isVideo ? (
                        <>
                          <video
                            src={mediaUrl}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                            muted
                            loop
                            playsInline
                          />
                          <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/15 to-black/55" />
                          <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm">
                            <Play className="h-5 w-5 fill-white" />
                          </div>
                        </>
                      ) : (
                        <>
                          <Image
                            src={mediaUrl}
                            alt={`Post ${postId}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            className="object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/45" />
                        </>
                      )
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted p-5 text-center">
                        <span className="line-clamp-5 text-sm leading-6 text-muted-foreground">
                          {post.text || "Text Post"}
                        </span>
                      </div>
                    )}

                    {!mediaUrl && (
                      <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-background/90 text-primary shadow-sm">
                        <Bookmark className="h-5 w-5" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {post.user?.name || "Unknown user"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          @{post.user?.username || "user"}
                        </p>
                      </div>
                      <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        Saved
                      </div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {post.text || "Media-only post"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {(loading || hasMore) && (
            <div className="flex justify-center py-4">
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : hasMore ? (
                <Button onClick={loadMore} className="min-w-[200px] rounded-full">
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
