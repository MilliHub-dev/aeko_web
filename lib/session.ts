import "server-only";
import { cookies } from "next/headers";
import { User } from "@/types/user";
import { API_BASE_URL } from "./config";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return token;
}

export async function getCurrentUser(): Promise<User | null> {
  const token = await getSession();

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // Always fetch fresh user data
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user || data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}
