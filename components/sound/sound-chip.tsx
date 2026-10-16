"use client";

import Link from "next/link";
import { Music, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Sound } from "@/types/sound";

interface SoundChipProps {
  sound: Sound;
  /** Link to the sound's page. Off for composers. */
  link?: boolean;
  onRemove?: () => void;
  /** "dark" sits on media; "light" sits on app surfaces. */
  variant?: "dark" | "light";
  className?: string;
}

/** "♪ Title · Artist" label for a post or story with music. */
export function SoundChip({ sound, link = true, onRemove, variant = "dark", className }: SoundChipProps) {
  const body = (
    <>
      {sound.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={sound.coverUrl} alt="" className="h-6 w-6 shrink-0 rounded-full object-cover" />
      ) : (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20">
          <Music className="h-3 w-3 text-primary" />
        </span>
      )}
      <span className="truncate text-xs font-semibold">
        {sound.title}
        {sound.artist ? <span className="font-normal opacity-80"> · {sound.artist}</span> : null}
      </span>
    </>
  );

  const classes = cn(
    "inline-flex max-w-[80%] items-center gap-2 rounded-full py-1 pl-1 pr-3",
    variant === "dark" ? "bg-black/45 text-white backdrop-blur-sm" : "bg-muted text-foreground",
    className,
  );

  return (
    <span className={classes}>
      {link ? (
        <Link
          href={`/sound/${sound.id}`}
          className="flex min-w-0 items-center gap-2"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Sound: ${sound.title}${sound.artist ? ` by ${sound.artist}` : ""}`}
        >
          {body}
        </Link>
      ) : (
        <span className="flex min-w-0 items-center gap-2">{body}</span>
      )}
      {onRemove ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 rounded-full p-0.5 hover:bg-black/10"
          aria-label="Remove music"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </span>
  );
}

export default SoundChip;
