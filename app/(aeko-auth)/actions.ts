"use server";

import { createSessionToken, deleteSessionToken } from "@/lib/token";
import { User } from "@/types/user";
import { redirect } from "next/navigation";
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
  user: Omit<
    User,
    | "status"
    | "botEnabled"
    | "botPersonality"
    | "solanaWalletAddress"
    | "createdAt"
    | "updatedAt"
  >;
  error?: string;
};

// const response: SignupResponse = {
//   success: true,
//   message: "Login successful",
//   token:
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MWFiY2NkNWFmNTQyYzMyMzc1NmJjZCIsImlhdCI6MTc2MzcwODE2NCwiZXhwIjoxNzY0MzEyOTY0fQ.ZB90-shdYNrrTFpoG56HzrsbK5rW35xcOOViGx0Howw",
//   user: {
//     _id: "691abccd5af542c323756bcd",
//     name: "John Smith",
//     username: "johnsmith",
//     email: "maikmatt@outlook.com",
//     profilePicture: "",
//     bio: "",
//     blueTick: false,
//     goldenTick: false,
//     aekoBalance: 0,
//     emailVerification: { isVerified: true },
//     profileCompletion: {
//       hasProfilePicture: false,
//       hasBio: false,
//       hasFollowers: false,
//       hasWalletConnected: false,
//       hasVerifiedEmail: true,
//       completedAt: null,
//       completionPercentage: 25,
//     },
//     isAdmin: false,
//     twoFactorEnabled: false,
//   },
// };

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
  redirect("/interests");
}

export async function logoutAction() {
  await deleteSessionToken();
  redirect("/login");
}
