import type {
  LivestreamCreateData,
  LivestreamResponse,
} from "@/types/livestream";
import { API_BASE_URL } from "./config";

// Use local API proxy instead of direct backend URL to avoid CORS
const API_BASE = "/api";

/**
 * Create a new livestream session
 */
export async function createLivestream(
  data: LivestreamCreateData
): Promise<LivestreamResponse> {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  const response = await fetch(`${API_BASE}/livestream/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create livestream");
  }

  return response.json();
}

/**
 * Upload thumbnail for a livestream
 */
export async function uploadThumbnail(
  streamId: string,
  file: File
): Promise<void> {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  const formData = new FormData();
  formData.append("thumbnail", file);

  const response = await fetch(`${API_BASE}/livestream/${streamId}/thumbnail`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload thumbnail");
  }
}

/**
 * Start a livestream
 */
export async function startLivestream(streamId: string): Promise<void> {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  const response = await fetch(`${API_BASE}/livestream/${streamId}/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to start livestream");
  }
}

/**
 * End a livestream
 */
export async function endLivestream(streamId: string): Promise<LivestreamResponse> {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  const response = await fetch(`${API_BASE}/livestream/${streamId}/end`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to end livestream");
  }

  return response.json();
}
