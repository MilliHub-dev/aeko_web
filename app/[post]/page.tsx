export default async function PostPage({
	params
}: {
	params: Promise<{ post: string }>;
}) {
	const { post } = await params;

	return (
		<div>
			<h1>{post}</h1>
		</div>
	);
}
