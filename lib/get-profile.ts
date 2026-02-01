import { User } from "@/types/user";
import { redirect } from "next/navigation";
import { API_BASE_URL } from "./config";

// Client-side request deduplication
let clientProfilePromise: Promise<User | null> | null = null;
let lastProfileFetchTime = 0;
const PROFILE_FETCH_COOLDOWN = 2000; // 2 seconds

export async function getProfile(): Promise<User | null> {
  const isServer = typeof window === "undefined";

  if (isServer) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    try {
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token?.value}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          redirect("/login");
        }
        console.error(`Failed to fetch profile: ${response.status}`);
        return null;
      }

      const data = await response.json();
      // Adjust based on actual response shape: { success: true, user: ... }
      return data.user ?? data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }

  // Client-side fallback
  // Return existing promise if active
  if (clientProfilePromise) {
    return clientProfilePromise;
  }

  // Rate limiting check
  const now = Date.now();
  if (now - lastProfileFetchTime < PROFILE_FETCH_COOLDOWN) {
    return null; // Return null if within cooldown to prevent spamming
  }

  lastProfileFetchTime = now;

  clientProfilePromise = (async () => {
    try {
      const response = await fetch("/api/profile");
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          redirect("/login");
        }
        if (response.status === 429) {
          console.warn("Rate limited fetching profile");
          return null;
        }
        console.warn(`[getProfile] Failed to fetch profile. Status: ${response.status}`);
        return null;
      }
      const data = await response.json();
      return data.user ?? data;
    } catch (error) {
      console.error("Error fetching profile client-side:", error);
      return null;
    } finally {
      clientProfilePromise = null;
    }
  })();

  return clientProfilePromise;
}
