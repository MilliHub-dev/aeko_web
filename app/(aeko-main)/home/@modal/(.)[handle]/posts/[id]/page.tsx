import { PostModal } from "@/components/home/post/post-modal";
import { getPost } from "@/lib/get-posts";

interface PageProps {
	params: Promise<{
		handle: string;
		id: string;
	}>;
}

export default async function PostModalPage({
	params
}: PageProps) {
	const { handle, id } = await params;
	const post = await getPost(handle, id);

	return (
		<PostModal
			isOpen={true}
			{...post}
		/>
	);
}
