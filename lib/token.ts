import "server-only";
import { cookies } from "next/headers";

export async function createSessionToken(token: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const cookieStore = await cookies();

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSessionToken() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}
