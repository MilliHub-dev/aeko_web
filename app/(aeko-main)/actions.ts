"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { API_BASE_URL } from "@/lib/config";

export async function createPostAction(formData: FormData) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      console.log("Create Post Action: No token found");
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    console.log(`Create Post Action: Sending request to ${API_BASE_URL}/api/posts/create`);

    const response = await fetch(`${API_BASE_URL}/api/posts/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error(`Create Post Action Failed: ${response.status} ${response.statusText}`, responseText);
      
      let message = "Failed to create post";
      try {
        const data = JSON.parse(responseText);
        message = data.message || message;
      } catch (e) {
        // use default message or responseText if short
        if (responseText.length < 100) message = responseText;
      }
      
      return {
        success: false,
        message: message,
      };
    }

    console.log("Post created successfully");
    revalidatePath("/home");
    return {
      success: true,
      message: "Post created successfully",
    };
  } catch (error: any) {
    console.error("Create post error (catch block):", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
}
