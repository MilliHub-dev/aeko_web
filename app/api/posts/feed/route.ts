import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const res = await fetch("https://dev.aeko.social/api/posts/feed", {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  });
  const data = await res.json();

  if (!res.ok) {
    return Response.json(data, { status: res.status });
  }

  // return the same shape you want clients to consume
  return Response.json({ posts: data }); // or: return Response.json(data);
}
