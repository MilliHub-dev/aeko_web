export const dynamic = "force-static";

export async function GET() {
	const res = await fetch("https://dev.aeko.social/api/posts/feed", {
		headers: {
			Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MWFiY2NkNWFmNTQyYzMyMzc1NmJjZCIsImlhdCI6MTc2MzM2MDg0OSwiZXhwIjoxNzYzOTY1NjQ5fQ.45aIEN7XkwcAJHC8bHCdc-xx6webMjgs-p71b8GsuHw`
		}
	});
	const data = await res.json();

	return Response.json({ data });
}
