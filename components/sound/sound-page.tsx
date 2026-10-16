"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2, Music, Pause, Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CreatePost } from "@/components/home/create-post";
import { useSoundPlayback } from "@/hooks/use-sound-playback";
import type { FeedPost } from "@/types/post";
import type { Sound } from "@/types/sound";

const firstMediaUrl = (post: Partial<FeedPost>): string | null => {
  if (post.mediaUrls?.length) return post.mediaUrls[0];
  if (Array.isArray(post.media)) return post.media[0] ?? null;
  if (typeof post.media === "string" && post.media) return post.media;
  return post.mediaUrl ?? null;
};

/** A sound's page: credit, use count, "Use this sound", and the posts using it. */
export function SoundPage({ soundId }: { soundId: string }) {
  const router = useRouter();
  const [sound, setSound] = useState<Sound | null>(null);
  const [posts, setPosts] = useState<Array<Partial<FeedPost> & { id?: string; _id?: string }>>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  useSoundPlayback({ src: sound?.audioUrl, active: playing, loop: true });

  const load = useCallback(
    async (nextPage: number) => {
      try {
        const res = await fetch(`/api/sounds/${soundId}/posts?page=${nextPage}&limit=30`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Couldn't load this sound");
        setSound(json.sound);
        setPosts((current) => (nextPage === 1 ? json.posts ?? [] : [...current, ...(json.posts ?? [])]));
        setHasMore(Boolean(json.hasMore));
        setPage(nextPage);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Couldn't load this sound");
      } finally {
        setLoading(false);
      }
    },
    [soundId],
  );

  useEffect(() => {
    void load(1);
  }, [load]);

  if (loading && !sound) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!sound) {
    return <p className="py-20 text-center text-sm text-muted-foreground">This sound isn&apos;t available.</p>;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4">
      <button type="button" onClick={() => router.back()} className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="flex flex-col items-center gap-3 text-center">
        <button type="button" onClick={() => setPlaying((p) => !p)} className="relative" aria-label={playing ? "Pause preview" : "Play preview"}>
          {sound.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={sound.coverUrl} alt="" className="h-28 w-28 rounded-3xl object-cover" />
          ) : (
            <span className="flex h-28 w-28 items-center justify-center rounded-3xl bg-primary/15">
              <Music className="h-10 w-10 text-primary" />
            </span>
          )}
          <span className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground ring-4 ring-background">
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </span>
        </button>
        <h1 className="text-xl font-bold">{sound.title}</h1>
        <p className="text-sm text-muted-foreground">
          {sound.artist ?? (sound.isOriginal ? "Original sound" : "Aeko library")} · {sound.useCount} {sound.useCount === 1 ? "post" : "posts"}
        </p>
        <CreatePost initialSound={sound} trigger={<Button className="mt-2 rounded-full">Use this sound</Button>} />
      </div>

      <div className="mt-8 grid grid-cols-3 gap-1">
        {posts.map((post) => {
          const id = post._id ?? post.id ?? "";
          const url = firstMediaUrl(post);
          return (
            <Link key={id} href={`/${post.user?.username ?? ""}/posts/${id}`} className="relative aspect-[4/5] overflow-hidden rounded-md bg-muted">
              {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="" className="h-full w-full object-cover" />
              ) : null}
            </Link>
          );
        })}
      </div>
      {posts.length === 0 ? <p className="py-10 text-center text-sm text-muted-foreground">No posts use this sound yet. Be the first.</p> : null}
      {hasMore ? (
        <div className="flex justify-center py-6">
          <Button variant="outline" onClick={() => void load(page + 1)}>
            Load more
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default SoundPage;
