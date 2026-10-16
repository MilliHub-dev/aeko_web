/** A reusable audio track for photo posts and stories (backend `toPublicSound`). */
export interface Sound {
  id: string;
  title: string;
  /** Display credit; "@username" for original sounds. */
  artist: string | null;
  durationMs: number;
  /** mp3 delivery URL. */
  audioUrl: string;
  coverUrl: string | null;
  source: "LIBRARY" | "USER_UPLOAD" | "EXTRACTED";
  license: string;
  category: string | null;
  useCount: number;
  isOriginal: boolean;
  uploader: {
    id: string;
    username: string;
    name: string;
    profilePicture: string | null;
  } | null;
  sourcePostId: string | null;
  createdAt: string;
}

/** A sound chosen for a post or story: which track and where it starts. */
export interface SoundSelection {
  sound: Sound;
  startMs: number;
}

export interface SoundListResponse {
  success: boolean;
  sounds: Sound[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

/** How much of a track plays over a photo before it loops. */
export const SOUND_CLIP_MS = 15_000;
