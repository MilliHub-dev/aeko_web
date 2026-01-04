"use server";

import { createSessionToken, deleteSessionToken } from "@/lib/token";
import { User } from "@/types/user";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupResponse = {
  success: boolean;
  message: string;
  token: string;
  user?: Omit<
    User,
    | "status"
    | "botEnabled"
    | "botPersonality"
    | "solanaWalletAddress"
    | "createdAt"
    | "updatedAt"
  >;
  userId?: string;
  error?: string;
};

export type LoginState = {
  message: string;
  errors: {
    email?: string[];
    password?: string[];
  };
  success: boolean;
};

export type SignupState = {
  message: string;
  errors: {
    name?: string[];
    username?: string[];
    email?: string[];
    password?: string[];
  };
  success: boolean;
};

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  const result = loginSchema.safeParse({ email, password });

  if (!result.success) {
    return {
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const response = await fetch("https://dev.aeko.social/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data: SignupResponse = await response.json();

    if (!response.ok) {
      return {
        message: data.message || data.error || "Login failed",
        errors: {},
        success: false,
      };
    }

    await createSessionToken(data.token);
  } catch (error) {
    console.error("Login error:", error);
    return {
      message: "An unexpected error occurred",
      errors: {},
      success: false,
    };
  }

  redirect("/home");
}

export async function signupAction(
  prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const name = formData.get("name");
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirm = formData.get("confirm");

  if (password !== confirm) {
    return {
      message: "Passwords do not match",
      errors: { password: ["Passwords do not match"] },
      success: false,
    };
  }

  const result = signupSchema.safeParse({ name, username, email, password });

  if (!result.success) {
    return {
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
      success: false,
    };
  }

  let userId: string | undefined;

  try {
    const response = await fetch("https://dev.aeko.social/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        username,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // The API might return field errors
      if (data.details?.fieldErrors) {
        return {
          message: data.message || "Signup failed",
          errors: data.details.fieldErrors,
          success: false,
        };
      }
      return {
        message: data.message || data.error || "Signup failed",
        errors: {},
        success: false,
      };
    }

    userId = data.userId;

    // Auto-login after successful signup
    if (data.token) {
      await createSessionToken(data.token);
    }
  } catch (error) {
    console.error("Signup error:", error);
    return {
      message: "An unexpected error occurred",
      errors: {},
      success: false,
    };
  }

  // Redirect to verify-email with email and userId as query param
  redirect(
    `/verify-email?email=${encodeURIComponent(
      email as string
    )}&userId=${encodeURIComponent(userId || "")}`
  );
}

export async function verifyEmailAction(
  prevState: { message: string; success: boolean },
  formData: FormData
) {
  const verificationCode = formData.get("verificationCode");
  const userId = formData.get("userId");

  if (
    !verificationCode ||
    typeof verificationCode !== "string" ||
    verificationCode.length !== 4
  ) {
    return {
      message: "Please enter a valid 4-digit code",
      success: false,
    };
  }

  try {
    const token = (await cookies()).get("token")?.value;

    const response = await fetch(
      "https://dev.aeko.social/api/auth/verify-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          verificationCode,
          userId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        message: data.message || data.error || "Verification failed",
        success: false,
      };
    }

    // Update session or user state if needed?
    // Usually verification updates the user status in DB.
  } catch (error) {
    console.error("Verification error:", error);
    return {
      message: "An unexpected error occurred",
      success: false,
    };
  }

  redirect("/interests");
}

export async function resendVerificationAction(userId: string) {
  try {
    const token = (await cookies()).get("token")?.value;

    const response = await fetch(
      "https://dev.aeko.social/api/auth/resend-verification",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        message: data.message || data.error || "Failed to resend code",
        success: false,
      };
    }

    return {
      message: "Code sent successfully",
      success: true,
    };
  } catch (error) {
    console.error("Resend error:", error);
    return {
      message: "An unexpected error occurred",
      success: false,
    };
  }
}

export async function logoutAction() {
  await deleteSessionToken();
  redirect("/login");
}
