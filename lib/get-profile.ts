import { User } from "@/types/user";
import { redirect } from "next/navigation";

// Client-side request deduplication
let clientProfilePromise: Promise<User | null> | null = null;

export async function getProfile(): Promise<User | null> {
  const isServer = typeof window === "undefined";

  if (isServer) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    try {
      const response = await fetch("https://dev.aeko.social/api/profile", {
        headers: {
          Authorization: `Bearer ${token?.value}`,
        },
        cache: "force-cache",
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
  if (clientProfilePromise) {
    return clientProfilePromise;
  }

  clientProfilePromise = (async () => {
    try {
      const response = await fetch("/api/profile");
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          redirect("/login");
        }
        if (response.status === 429) {
           console.error("Rate limited fetching profile");
           return null;
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
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
