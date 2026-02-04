import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";
import { User } from "@/types/user";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // 1. Fetch User Details
    const userUrl = `${API_BASE_URL}/api/users/${id}`;
    const userRes = await fetch(userUrl, { headers });

    if (!userRes.ok) {
      return NextResponse.json(
        { error: `Failed to fetch user: ${userRes.statusText}` },
        { status: userRes.status }
      );
    }

    const userData = await userRes.json();
    let user = userData.user || userData.data || userData;
    
    // Validate we got a user object
    if (!user || (!user.id && !user._id)) {
        return NextResponse.json(
            { error: "User not found or invalid response" },
            { status: 404 }
        );
    }

    // 2. Enhance with Post Count if missing or zero
    // This fixes the issue where user has posts but count returns 0
    if (user._id || user.id) {
        const userId = user._id || user.id;
        try {
            const postsUrl = `${API_BASE_URL}/api/posts/user/${userId}?limit=1`;
            const postsRes = await fetch(postsUrl, { headers });
            
            if (postsRes.ok) {
                const postsData = await postsRes.json();
                const realCount = postsData.pagination?.total ?? 
                                (Array.isArray(postsData.posts) ? postsData.posts.length : 
                                (Array.isArray(postsData) ? postsData.length : 0));
                
                if (typeof realCount === 'number') {
                    user.postsCount = realCount;
                }
            }
        } catch (postErr) {
            console.error("Error fetching user posts count:", postErr);
            // Continue without updating count
        }
    }

    // 3. Ensure bio and location are present (should be in user object)
    // The frontend expects these fields.
    const filteredUser = {
        ...user,
        bio: user.bio || "",
        location: user.location || "",
        // Ensure postsCount is at least 0
        postsCount: user.postsCount ?? 0
    };

    return NextResponse.json({ user: filteredUser });

  } catch (error) {
    console.error("Error in GET /api/users/[id]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Failed to delete account" },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/users/[id]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
