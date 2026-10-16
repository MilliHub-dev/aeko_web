"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, Loader2, Music, Pause, Play, Search, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSoundPlayback } from "@/hooks/use-sound-playback";
import { cn } from "@/lib/utils";
import { SOUND_CLIP_MS, type Sound, type SoundListResponse, type SoundSelection } from "@/types/sound";

interface MusicPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (selection: SoundSelection) => void;
  initial?: SoundSelection | null;
}

const formatDuration = (ms: number) => {
  const total = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};

/**
 * "Add music": search the library, preview, choose where the clip starts, use
 * it. "Your sounds" lists uploads and original sounds, with an upload button.
 */
export function MusicPickerDialog({ open, onOpenChange, onSelect, initial }: MusicPickerDialogProps) {
  const [tab, setTab] = useState<"browse" | "mine">("browse");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [list, setList] = useState<Sound[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [trimming, setTrimming] = useState<Sound | null>(null);
  const [startMs, setStartMs] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const previewSound = useMemo(() => list.find((s) => s.id === previewId) ?? null, [list, previewId]);
  useSoundPlayback({ src: open && !trimming ? previewSound?.audioUrl : null, active: open && !trimming && !!previewSound, loop: false });
  useSoundPlayback({ src: open && trimming ? trimming.audioUrl : null, startMs, active: open && !!trimming, loop: true });

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    if (!open) {
      setPreviewId(null);
      setTrimming(null);
      return;
    }
    if (initial) {
      setTrimming(initial.sound);
      setStartMs(initial.startMs);
    }
    fetch("/api/sounds/categories")
      .then((r) => r.json())
      .then((j) => setCategories(j.categories ?? []))
      .catch(() => {});
  }, [open, initial]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const url =
        tab === "mine"
          ? "/api/sounds/mine"
          : `/api/sounds?${new URLSearchParams({
              ...(debounced ? { q: debounced } : {}),
              ...(category ? { category } : {}),
              sort: debounced ? "recent" : "trending",
              limit: "50",
            })}`;
      const res = await fetch(url);
      const json = (await res.json()) as SoundListResponse & { message?: string };
      if (!res.ok) throw new Error(json.message || "Couldn't load sounds");
      setList(json.sounds ?? []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't load sounds");
    } finally {
      setLoading(false);
    }
  }, [tab, debounced, category]);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("audio", file);
      form.append("title", file.name.replace(/\.[^.]+$/, ""));
      const res = await fetch("/api/sounds", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok || !json.sound) throw new Error(json.message || "Upload failed");
      toast.success("Sound added");
      setList((current) => [json.sound, ...current]);
      setTrimming(json.sound);
      setStartMs(0);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't upload that file");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const maxStart = trimming ? Math.max(0, trimming.durationMs - SOUND_CLIP_MS) : 0;

  const confirm = () => {
    if (!trimming) return;
    onSelect({ sound: trimming, startMs });
    setTrimming(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {trimming ? (
              <button type="button" onClick={() => setTrimming(null)} aria-label="Back to sounds" className="rounded-full p-1 hover:bg-muted">
                <ChevronLeft className="h-5 w-5" />
              </button>
            ) : null}
            {trimming ? "Choose the part to play" : "Add music"}
          </DialogTitle>
          <DialogDescription>
            {trimming ? "Pick where the clip starts. It repeats while the photo is on screen." : "Free tracks and sounds from the community."}
          </DialogDescription>
        </DialogHeader>

        {trimming ? (
          <div className="flex flex-1 flex-col gap-6 pt-2">
            <div className="flex flex-col items-center gap-2 text-center">
              {trimming.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={trimming.coverUrl} alt="" className="h-24 w-24 rounded-2xl object-cover" />
              ) : (
                <span className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/15">
                  <Music className="h-8 w-8 text-primary" />
                </span>
              )}
              <div className="text-base font-semibold">{trimming.title}</div>
              <div className="text-sm text-muted-foreground">
                {trimming.artist ?? "Aeko library"} · {formatDuration(trimming.durationMs)}
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-center text-sm text-muted-foreground">
                Starts at {formatDuration(startMs)} · plays {formatDuration(Math.min(SOUND_CLIP_MS, trimming.durationMs - startMs))} and repeats
              </div>
              <Slider
                min={0}
                max={maxStart}
                step={500}
                value={[Math.min(startMs, maxStart)]}
                onValueChange={(v: number[]) => setStartMs(Math.round(v[0] ?? 0))}
                disabled={maxStart === 0}
                aria-label="Start position"
              />
            </div>
            <Button className="mt-auto w-full" onClick={confirm}>
              Use this sound
            </Button>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-3">
            <Tabs value={tab} onValueChange={(v) => setTab(v as "browse" | "mine")}>
              <TabsList>
                <TabsTrigger value="browse">Browse</TabsTrigger>
                <TabsTrigger value="mine">Your sounds</TabsTrigger>
              </TabsList>
            </Tabs>

            {tab === "browse" ? (
              <>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search songs and sounds"
                    className="pl-9"
                  />
                  {query ? (
                    <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Clear search">
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ) : null}
                </div>
                {categories.length > 0 ? (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {[null, ...categories].map((c) => (
                      <button
                        key={c ?? "all"}
                        type="button"
                        onClick={() => setCategory(c)}
                        className={cn(
                          "shrink-0 rounded-full border px-3 py-1 text-xs",
                          category === c ? "border-primary bg-primary/10 font-semibold text-primary" : "border-border text-muted-foreground",
                        )}
                      >
                        {c ?? "All"}
                      </button>
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={(e) => void handleUpload(e.target.files?.[0])} />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-3 rounded-xl border border-dashed border-border p-3 text-left hover:bg-muted/50 disabled:opacity-60"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15">
                    {uploading ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <Upload className="h-5 w-5 text-primary" />}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{uploading ? "Uploading…" : "Upload audio"}</span>
                    <span className="block text-xs text-muted-foreground">mp3, m4a or wav · up to 5 minutes · others can reuse it</span>
                  </span>
                </button>
              </>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto">
              {loading && list.length === 0 ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : list.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                  {tab === "mine" ? "Sounds you upload, and original sounds from your videos, show up here." : debounced ? "No sounds match that." : "No sounds yet."}
                </p>
              ) : (
                <ul className="divide-y divide-border/60">
                  {list.map((item) => {
                    const playing = previewId === item.id;
                    return (
                      <li key={item.id} className="flex items-center gap-3 py-2">
                        <button
                          type="button"
                          onClick={() => setPreviewId(playing ? null : item.id)}
                          className="relative shrink-0"
                          aria-label={`${playing ? "Pause" : "Preview"} ${item.title}`}
                        >
                          {item.coverUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.coverUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />
                          ) : (
                            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15">
                              <Music className="h-5 w-5 text-primary" />
                            </span>
                          )}
                          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background">
                            {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                          </span>
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold">{item.title}</div>
                          <div className="truncate text-xs text-muted-foreground">
                            {item.artist ?? (item.isOriginal ? "Original sound" : "Aeko library")} · {formatDuration(item.durationMs)}
                            {item.useCount > 0 ? ` · ${item.useCount} posts` : ""}
                          </div>
                        </div>
                        <Button size="sm" className="rounded-full" onClick={() => { setPreviewId(null); setStartMs(0); setTrimming(item); }}>
                          Use
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default MusicPickerDialog;
