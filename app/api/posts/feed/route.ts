export const dynamic = "force-dynamic";

export async function GET() {
	const res = await fetch("https://dev.aeko.social/api/posts/feed", {
		// move secret token to env var instead of hardcoding
		headers: {
			Authorization: `Bearer ${process.env.BACKEND_TOKEN}`
		}
	});
	const data = await res.json();

	// return the same shape you want clients to consume
	return Response.json({ posts: data }); // or: return Response.json(data);
}
