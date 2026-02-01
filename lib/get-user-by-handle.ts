import { User } from "@/types/user";
import { API_BASE_URL } from "./config";
import { cookies } from "next/headers";

export async function getUserByHandle(handle: string): Promise<User | null> {
  const cleanHandle = handle.replace(/^@/, '');
  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    
    // First try to fetch by username directly if the API supports it
    const directRes = await fetch(`${API_BASE_URL}/api/users/${cleanHandle}`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
      cache: "no-store",
    });

    let user: User | null = null;

    if (directRes.ok) {
      const data = await directRes.json();
      user = data.user || data.data || data;
      
      // Verify we got the correct user (handle matching)
      if (user && (user.username !== cleanHandle && user._id !== cleanHandle)) {
        user = null; // Mismatch
      }
    }

    // Fallback to search if direct fetch fails or returns wrong user
    if (!user) {
      const searchRes = await fetch(`${API_BASE_URL}/api/users?search=${encodeURIComponent(cleanHandle)}`, {
        headers: {
          Authorization: `Bearer ${token?.value}`,
        },
        cache: "no-store",
      });

      if (searchRes.ok) {
        const data = await searchRes.json();
        const users = data.users || data.data || [];
        
        if (Array.isArray(users)) {
          const found = users.find((u: User) => 
            u.username.toLowerCase() === cleanHandle.toLowerCase()
          );
          if (found) user = found;
        }
      }
    }

    if (!user) return null;

    // Enhanced logic: Fetch post count if missing or 0, and ensure bio/location
    // This addresses the issue where postsCount is 0 even if user has posts
    if (user._id || user.id) {
      const userId = user._id || user.id;
      
      try {
        // Fetch user posts to get the real count from pagination
        const postsRes = await fetch(`${API_BASE_URL}/api/posts/user/${userId}?limit=1`, {
          headers: {
            Authorization: `Bearer ${token?.value}`,
          },
          cache: "no-store",
        });

        if (postsRes.ok) {
          const postsData = await postsRes.json();
          // Check pagination.total first, then posts array length if pagination missing
          const realCount = postsData.pagination?.total ?? 
                           (Array.isArray(postsData.posts) ? postsData.posts.length : 
                           (Array.isArray(postsData) ? postsData.length : 0));
          
          if (typeof realCount === 'number') {
            user.postsCount = realCount;
          }
        }
      } catch (err) {
        console.error("Error fetching user posts count:", err);
        // Continue with existing user data
      }
    }
    
    // Ensure bio and location are accessible (they should be already if in the response)
    // If the backend returns them in a nested object or different casing, handle it here if known.
    // For now, we assume they are at the root level as per the User type.

    return user;

  } catch (error) {
    console.error("Error fetching user by handle:", error);
    return null;
  }
}
