import { User } from "@/types/user";
import { redirect } from "next/navigation";

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
  try {
    const response = await fetch("/api/profile");
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        redirect("/login");
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.user ?? data;
  } catch (error) {
    console.error("Error fetching profile client-side:", error);
    return null;
  }
}
