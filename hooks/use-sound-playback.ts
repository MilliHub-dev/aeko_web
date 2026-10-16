"use client";

import { useEffect, useRef } from "react";

interface SoundPlaybackOptions {
  /** mp3 URL; falsy means no player. */
  src?: string | null;
  /** Where in the track playback starts, and restarts after each loop. */
  startMs?: number;
  /** Play while true, pause while false. */
  active: boolean;
  muted?: boolean;
  loop?: boolean;
}

/**
 * Plays a post's or story's sound from its start offset while `active`,
 * through a single HTMLAudioElement per mounted card. Browsers only allow
 * audible autoplay after a user gesture; the feed is scrolled and stories are
 * opened by click, so that condition holds in practice, and a blocked play()
 * is swallowed rather than surfaced.
 */
export function useSoundPlayback({
  src,
  startMs = 0,
  active,
  muted = false,
  loop = true,
}: SoundPlaybackOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startSeconds = Math.max(0, startMs) / 1000;

  useEffect(() => {
    if (!src || typeof window === "undefined") return;
    const audio = new Audio(src);
    audio.preload = "auto";
    audioRef.current = audio;
    const onEnded = () => {
      if (!loop) return;
      audio.currentTime = startSeconds;
      audio.play().catch(() => {});
    };
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [src, loop, startSeconds]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = muted;
    if (active) {
      audio.currentTime = startSeconds;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [active, muted, startSeconds, src]);
}

export default useSoundPlayback;
