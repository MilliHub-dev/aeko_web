"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createPostAction(formData: FormData) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const response = await fetch("https://dev.aeko.social/api/posts/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        message: data.message || "Failed to create post",
      };
    }

    console.log("Post created successfully");
    revalidatePath("/home");
    return {
      success: true,
      message: "Post created successfully",
    };
  } catch (error) {
    console.error("Create post error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}
