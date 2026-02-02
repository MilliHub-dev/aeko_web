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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes timeout for large uploads

    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        signal: controller.signal,
        // @ts-ignore - Required for sending FormData/Streams in Node.js fetch
        duplex: "half", 
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const responseText = await response.text();
        console.error(`Create Post Action Failed: ${response.status} ${response.statusText}`, responseText);
        
        let message = "Failed to create post";
        try {
          const data = JSON.parse(responseText);
          message = data.message || message;
        } catch (e) {
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
      clearTimeout(timeoutId);
      console.error("Create post error (catch block):", error);
      // Detailed error message for fetch failures
      const errorMessage = error.cause ? `${error.message} (${error.cause.code || error.cause})` : error.message;
      return {
        success: false,
        message: errorMessage || "An unexpected error occurred",
      };
    }
  } catch (error: any) {
    console.error("Create post error (catch block):", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
}
